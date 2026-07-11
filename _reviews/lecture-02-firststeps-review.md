# Review: lecture-02-firststeps.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A short, well-scoped logistics deck: the install → verify → "Everything working?" troubleshooting rhythm is good, the Git section is a genuinely useful addition for beginners, and the grading slide states the bonus rule unambiguously ("pass the exam first"), fixing the ambiguity flagged in lecture 1. The main problems are a factually wrong tutorial list (the fifth tutorial is Dictionaries, not Scope), image sizing attributes that Quarto won't apply, and a handful of typos.

## 1. High-impact teaching improvements

- **The tutorial topic list is wrong** (line ~218): "Topics of the Tutorials" lists **Scope** as the fifth topic, but the actual fifth tutorial is `tutorial-02-05-dicts.qmd` ("Tutorial II.V - Dictionaries"). No week-2 tutorial covers scope. Replace with "**Dictionaries**: Learn how to store and look up key-value pairs" — and consider adding one sentence on *why* (dictionaries are how you will index parameter data in JuMP models from lecture 4 on).
- **Zero Julia content in "First Steps in Julia".** Apart from the one-line `print("Hello World!")`, the deck is pure logistics. A single teaser slide — e.g., three lines of Julia that compute something a business student cares about (compound interest, a tiny loop over products) — would give students a first "I can read this" moment before they open the tutorials alone.
- **Add a learning-objectives slide** ("After today you have a working Julia + VS Code setup, know how to submit assignments, and have made your first Git commit") — same gap as lecture 1; the checklist framing fits this deck especially well.
- **"The easiest way is by using VS Code"** (line ~91): easiest way *to do what*? The referent (running the tutorials as notebooks) is only implicit from the slide title. Also, "just open the first tutorial" (line ~92) and "You can find the tutorials here on the website" (line ~224) mention the tutorials without hyperlinking them — add links so students following the deck online can click through.

## 2. Code issues

- **`{max-width=400px}` has no effect** (lines ~21, ~33): Quarto passes `max-width` through as a raw HTML attribute, which browsers ignore (it is a CSS property, not an HTML attribute). Use `{width=400}` or `{style="max-width: 400px;"}` — as written, both images render at full size.
- **"Control+Enter" or "STRG+Enter"** (line ~65): these are the same key (STRG is the German keycap label for Ctrl), so the "OR" reads as two alternatives when it is one. Say: `Ctrl+Enter` (`Strg+Enter` on German keyboards). Also note the macOS variant (`Cmd`/`Ctrl` depending on binding), since many students use Macs. Strictly, `Ctrl+Enter` executes the current line/cell in the REPL rather than "the file" — for a one-line file the distinction is invisible, but a one-line footnote ("for longer files, use *Julia: Execute active File in REPL*") would prevent later confusion.
- The `print("Hello World!")` block (line ~58) is fine; `println` would be marginally more idiomatic for a first script (adds the newline students expect), but not wrong.

## 3. Content & robustness

- **Redundant `---` before the Literature section** (line ~234): the horizontal rule directly before `# [Literature]` is a slide delimiter and can render an empty slide (the same class of issue as the blank "Literature II" slide in lecture 1). Remove it.
- **Verified consistent:** "0.5 points each, maximum 6.0" (lines ~199–200) checks out — there are 12 weekly tutorial assignments (tutorials 02–13), and 12 × 0.5 = 6.0; this also matches `general/faq.qmd`.
- **Duplicate heading:** section title and first slide are both "Submission of Assignments" (lines ~182–184), producing two near-identical consecutive slides. Rename the section (e.g., "Assignments & Grading") or drop one.
- Images are hosted on `images.beyondsimulations.com` — good; no fragile Unsplash/Giphy dependencies in this deck.
- **"MS"** (line ~37) is never expanded — write "Microsoft".

## 4. Pedagogy & polish

- **Typos/grammar:** "webside" → "website" (line ~42); "Following three lectures" → "The following three lectures" (line ~82); "a `.ipynb`file" → missing space, and "an `.ipynb` file" (line ~107); "how to use `.jl` or `.ipynb` files as notebook" → "as notebooks" (line ~93); "once you get used to it it becomes invaluable" → add a comma: "used to it, it becomes" (line ~146); "This weeks" pattern appears in later lectures — here "the coming weeks" (line ~113) is fine.
- **Heading capitalization is inconsistent:** "Create a new file" / "Verify the Installation" / "Making Your First Commit" / "Viewing History" mix sentence case and title case — pick one convention.
- **Accessibility:** all three images (lines ~15, ~21, ~33) lack alt text — add short descriptions for the website render.
- The Git tip "You don't need to use Git" (line ~146) slightly undercuts the later "Start using Git from day one!" (line ~179) — align the messaging (e.g., "not required for the course, but strongly recommended from day one").
