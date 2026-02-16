"""Generate PDFs from Reveal.js HTML presentations using Playwright.

Usage:
    Single file:
        uv run helpers/create_pdf.py input.html output.pdf

    Batch mode (auto-detect Reveal.js files in a directory):
        uv run helpers/create_pdf.py --dir _site/ --output-dir pdf-slides/

Options:
    --scale FLOAT       PDF scale factor (default: 1.5)
    --timeout INT       Timeout in ms for Reveal.js readiness (default: 30000)
    --width INT         Browser viewport width (default: 1920)
    --height INT        Browser viewport height (default: 1080)
"""

import argparse
import os
import sys
import threading
from functools import partial
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeout
from playwright.sync_api import sync_playwright


class _QuietHandler(SimpleHTTPRequestHandler):
    """HTTP handler that suppresses per-request log output."""

    def log_message(self, format, *args):
        pass


def _start_local_server(directory):
    """Start a local HTTP server serving *directory* on a random free port.

    Returns ``(server, base_url)`` where *base_url* is e.g.
    ``http://127.0.0.1:8432``.  The server runs in a daemon thread and
    should be shut down with ``server.shutdown()`` when no longer needed.
    """
    handler = partial(_QuietHandler, directory=str(directory))
    server = HTTPServer(("127.0.0.1", 0), handler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, f"http://127.0.0.1:{port}"


def is_revealjs_file(path):
    """Check whether an HTML file contains Reveal.js markup."""
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            # Read a generous chunk — the reveal div is typically near the top
            head = f.read(51200)
        return 'class="reveal' in head or "class='reveal" in head
    except OSError:
        return False


def find_revealjs_files(directory):
    """Recursively find all Reveal.js HTML files in a directory."""
    directory = Path(directory)
    found = []
    for html_file in sorted(directory.rglob("*.html")):
        if is_revealjs_file(html_file):
            found.append(html_file)
    return found


def generate_output_name(input_path, base_dir):
    """Derive a flat PDF filename from the input path relative to base_dir.

    Example:
        input_path = _site/lectures/lecture-01.html
        base_dir   = _site/
        result     = lectures-lecture-01.pdf
    """
    rel = Path(input_path).relative_to(base_dir)
    stem = str(rel.with_suffix("")).replace(os.sep, "-")
    return stem + ".pdf"


class BrowserLaunchError(RuntimeError):
    """Raised when the browser fails to launch (e.g. Chromium not installed)."""


_WAIT_FOR_MATHJAX = """
() => new Promise((resolve, reject) => {
    // If MathJax 2 is present, wait for its Hub queue to drain.
    if (typeof MathJax !== 'undefined' && MathJax.Hub) {
        MathJax.Hub.Queue(function () { resolve('mathjax2'); });
        return;
    }
    // If MathJax 3 is present, wait for its startup promise.
    if (typeof MathJax !== 'undefined' && MathJax.startup) {
        MathJax.startup.promise
            .then(function () { return MathJax.typesetPromise(); })
            .then(function () { resolve('mathjax3'); })
            .catch(reject);
        return;
    }
    // No MathJax found — nothing to wait for.
    resolve('none');
})
"""

# ---------------------------------------------------------------------------
# CSS injected before PDF capture to fix print-mode rendering issues.
# ---------------------------------------------------------------------------
_PRINT_CSS = """
/* Fix section headers: the .flow class uses background-clip:text with a
   huge animated background image — incompatible with static PDF output.
   Fall back to the normal heading color for a clean render. */
html.reveal-print .flow {
    -webkit-text-fill-color: inherit !important;
    background-image: none !important;
    background-clip: initial !important;
    -webkit-background-clip: initial !important;
    animation: none !important;
}

/* Ensure all animations are frozen in print mode. */
html.reveal-print *,
html.reveal-print *::before,
html.reveal-print *::after {
    animation-play-state: paused !important;
    transition: none !important;
}
"""

# ---------------------------------------------------------------------------
# JS that inlines all @font-face web fonts as base64 data: URIs so that
# Chromium's page.pdf() embeds them correctly.  Without this, lazily loaded
# MathJax fonts (e.g. MathJax_Caligraphic) render as empty squares.
# ---------------------------------------------------------------------------
_EMBED_FONTS_JS = """
async () => {
    const fontFaces = [];
    for (const sheet of document.styleSheets) {
        try {
            for (const rule of sheet.cssRules) {
                if (rule instanceof CSSFontFaceRule) {
                    fontFaces.push(rule);
                }
            }
        } catch (e) {
            // Skip cross-origin stylesheets we cannot read.
        }
    }
    if (fontFaces.length === 0) return 0;

    let embedded = 0;
    for (const rule of fontFaces) {
        const src = rule.style.getPropertyValue('src');
        if (!src) continue;

        // Extract the first url(...) from the src value.
        const urlMatch = src.match(/url\\(['"]?([^'"\\)]+)['"]?\\)/);
        if (!urlMatch) continue;
        const fontUrl = urlMatch[1];

        // Skip fonts that are already data: URIs.
        if (fontUrl.startsWith('data:')) continue;

        try {
            const resp = await fetch(fontUrl);
            if (!resp.ok) continue;
            const blob = await resp.blob();
            const dataUri = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            // Determine the format from the original src for the new rule.
            let fmt = '';
            if (fontUrl.endsWith('.woff2'))     fmt = "format('woff2')";
            else if (fontUrl.endsWith('.woff'))  fmt = "format('woff')";
            else if (fontUrl.endsWith('.otf'))   fmt = "format('opentype')";
            else if (fontUrl.endsWith('.ttf'))   fmt = "format('truetype')";

            const newSrc = fmt ? `url('${dataUri}') ${fmt}` : `url('${dataUri}')`;
            rule.style.setProperty('src', newSrc);
            embedded++;
        } catch (e) {
            // Font fetch failed — leave the original src intact.
        }
    }
    return embedded;
}
"""


def render_pdf(
    browser,
    input_path,
    output_path,
    *,
    scale,
    timeout,
    width,
    height,
    base_url=None,
    serve_root=None,
):
    """Render a single Reveal.js HTML file to PDF using an existing browser.

    When *base_url* and *serve_root* are provided the file is loaded via
    the local HTTP server (``http://127.0.0.1:{port}/…``) instead of the
    ``file://`` protocol.  This allows the in-page font-embedding script
    to ``fetch()`` MathJax font files from the CDN — something Chromium
    blocks under the ``file://`` origin.

    Returns True on success, False on failure (after printing the error).
    """
    input_path = Path(input_path).resolve()
    output_path = Path(output_path)

    if not input_path.exists():
        print(f"Error: input file not found: {input_path}", file=sys.stderr)
        return False

    output_path.parent.mkdir(parents=True, exist_ok=True)

    if base_url and serve_root:
        rel = input_path.relative_to(Path(serve_root).resolve())
        url = f"{base_url}/{rel.as_posix()}?print-pdf"
    else:
        url = f"file://{input_path}?print-pdf"

    try:
        page = browser.new_page(viewport={"width": width, "height": height})
        page.goto(url, wait_until="networkidle")
        page.locator(".reveal.ready").wait_for(timeout=timeout)

        # Wait for MathJax to finish typesetting all equations.
        # MathJax loads asynchronously *after* Reveal.js is ready, so
        # .reveal.ready alone is not sufficient.  We push a callback onto
        # the MathJax queue / promise chain and wait for it to fire.
        math_engine = page.evaluate(_WAIT_FOR_MATHJAX)
        if math_engine != "none":
            # After typesetting, MathJax web fonts may still be loading.
            # A second networkidle wait lets those requests settle.
            page.wait_for_load_state("networkidle", timeout=timeout)

        # Inline all @font-face web fonts as base64 data: URIs so that
        # Chromium embeds them in the PDF.  Without this, lazily loaded
        # MathJax fonts (e.g. Caligraphic, AMS, Fraktur) render as □.
        page.evaluate(_EMBED_FONTS_JS)

        # Inject print-mode CSS fixes (e.g. disable background-clip:text
        # animations that break in static PDF output).
        page.add_style_tag(content=_PRINT_CSS)

        # Let the injected styles and font changes settle.
        page.wait_for_timeout(200)

        page.pdf(
            path=str(output_path),
            scale=scale,
            prefer_css_page_size=True,
        )
        page.close()
    except PlaywrightTimeout:
        print(
            f"Error: timed out waiting for Reveal.js / MathJax: {input_path}",
            file=sys.stderr,
        )
        return False
    except Exception as exc:
        print(f"Error rendering {input_path}: {exc}", file=sys.stderr)
        return False

    return True


def launch_browser(pw, width, height):
    """Launch a Chromium browser instance.

    Raises BrowserLaunchError with a helpful message if Chromium is missing.
    """
    try:
        return pw.chromium.launch(
            args=["--disable-web-security", "--allow-file-access-from-files"],
        )
    except Exception as exc:
        msg = str(exc)
        if "Executable doesn't exist" in msg or "browserType.launch" in msg:
            raise BrowserLaunchError(
                "Chromium not found. Install it with:\n"
                "  uv run python -m playwright install chromium"
            ) from exc
        raise BrowserLaunchError(f"Failed to launch browser: {exc}") from exc


def main():
    parser = argparse.ArgumentParser(
        description="Generate PDFs from Reveal.js HTML presentations.",
        epilog="Provide either (input + output) for a single file, "
        "or (--dir + --output-dir) for batch conversion.",
    )

    # Single-file positional arguments
    parser.add_argument(
        "input", nargs="?", default=None, help="Input HTML file (single-file mode)"
    )
    parser.add_argument(
        "output", nargs="?", default=None, help="Output PDF file (single-file mode)"
    )

    # Batch-mode arguments
    parser.add_argument(
        "--dir",
        default=None,
        help="Directory to scan for Reveal.js HTML files (batch mode)",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Output directory for generated PDFs (batch mode)",
    )

    # Shared options
    parser.add_argument(
        "--scale", type=float, default=1.5, help="PDF scale factor (default: 1.5)"
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=30000,
        help="Timeout in ms for Reveal.js readiness (default: 30000)",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=1920,
        help="Browser viewport width (default: 1920)",
    )
    parser.add_argument(
        "--height",
        type=int,
        default=1080,
        help="Browser viewport height (default: 1080)",
    )

    args = parser.parse_args()

    single_mode = args.input is not None or args.output is not None
    batch_mode = args.dir is not None or args.output_dir is not None

    # --- Validate argument combinations ---
    if single_mode and batch_mode:
        parser.error(
            "Cannot combine positional arguments (input/output) with "
            "--dir/--output-dir. Use one mode at a time."
        )

    if not single_mode and not batch_mode:
        parser.error(
            "Provide either (input + output) for single-file mode, "
            "or (--dir + --output-dir) for batch mode."
        )

    render_opts = dict(
        scale=args.scale,
        timeout=args.timeout,
        width=args.width,
        height=args.height,
    )

    # --- Single-file mode ---
    if single_mode:
        if args.input is None or args.output is None:
            parser.error("Single-file mode requires both input and output arguments.")

        input_path = Path(args.input).resolve()

        # Determine a suitable directory to serve.  Walk up from the input
        # file until we find a directory containing ``site_libs/`` (a Quarto
        # marker) or fall back to the file's parent directory.
        serve_root = input_path.parent
        for parent in input_path.parents:
            if (parent / "site_libs").is_dir():
                serve_root = parent
                break

        server, base_url = _start_local_server(serve_root)

        print(f"Rendering {args.input} -> {args.output}")
        try:
            with sync_playwright() as pw:
                browser = launch_browser(pw, args.width, args.height)
                ok = render_pdf(
                    browser,
                    args.input,
                    args.output,
                    **render_opts,
                    base_url=base_url,
                    serve_root=serve_root,
                )
                browser.close()
        except BrowserLaunchError as exc:
            print(f"Error: {exc}", file=sys.stderr)
            sys.exit(1)
        finally:
            server.shutdown()
        sys.exit(0 if ok else 1)

    # --- Batch mode ---
    if args.dir is None or args.output_dir is None:
        parser.error("Batch mode requires both --dir and --output-dir.")

    base_dir = Path(args.dir)
    out_dir = Path(args.output_dir)

    if not base_dir.is_dir():
        print(f"Error: directory not found: {base_dir}", file=sys.stderr)
        sys.exit(1)

    files = find_revealjs_files(base_dir)
    if not files:
        print(f"No Reveal.js HTML files found in {base_dir}")
        sys.exit(0)

    print(f"Found {len(files)} Reveal.js file(s) in {base_dir}")
    out_dir.mkdir(parents=True, exist_ok=True)

    serve_root = base_dir.resolve()
    server, base_url = _start_local_server(serve_root)

    try:
        with sync_playwright() as pw:
            browser = launch_browser(pw, args.width, args.height)

            succeeded, failed = 0, 0
            for html_file in files:
                pdf_name = generate_output_name(html_file, base_dir)
                pdf_path = out_dir / pdf_name
                print(f"  {html_file} -> {pdf_path}")
                if render_pdf(
                    browser,
                    html_file,
                    pdf_path,
                    **render_opts,
                    base_url=base_url,
                    serve_root=serve_root,
                ):
                    succeeded += 1
                else:
                    failed += 1

            browser.close()
    except BrowserLaunchError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
    finally:
        server.shutdown()

    print(f"\nDone: {succeeded} succeeded, {failed} failed out of {len(files)} files.")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()


# --- Alternative: decktape-based approach ---
# decktape may produce better results for some presentations.
# Install: npm install -g decktape
#
# decktape reveal _site/part-01/lecture-presentation.html pdf-slides/ao_lecture_01.pdf
# decktape reveal _site/part-02/lecture-presentation.html pdf-slides/ao_lecture_02.pdf
# decktape reveal _site/part-03/lecture-presentation.html pdf-slides/ao_lecture_03.pdf
# decktape reveal _site/part-04/lecture-presentation.html pdf-slides/ao_lecture_04.pdf
# decktape reveal _site/part-05/lecture-presentation.html pdf-slides/ao_lecture_05.pdf
# decktape reveal _site/part-06/lecture-presentation.html pdf-slides/ao_lecture_06.pdf
# decktape reveal _site/part-07/lecture-presentation.html pdf-slides/ao_lecture_07.pdf
# decktape reveal _site/part-08/lecture-presentation.html pdf-slides/ao_lecture_08.pdf
# decktape reveal _site/part-09/lecture-presentation.html pdf-slides/ao_lecture_09.pdf
# decktape reveal _site/part-10/lecture-presentation.html pdf-slides/ao_lecture_10.pdf
# decktape reveal _site/part-11/lecture-presentation.html pdf-slides/ao_lecture_11.pdf
# decktape reveal _site/part-12/lecture-presentation.html pdf-slides/ao_lecture_12.pdf
# decktape reveal _site/part-13/lecture-presentation.html pdf-slides/ao_lecture_13.pdf
