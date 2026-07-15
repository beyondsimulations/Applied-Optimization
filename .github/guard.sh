#!/usr/bin/env bash
# Branding & content guard for a lecture repo.
#
#   bash .github/guard.sh          # run from the repo root — locally or in CI
#
# Fast (a few git/grep calls, no Quarto/Julia/Python, no build), and asserts the
# handful of invariants this brand rollout established, each of which broke once
# and would break silently again:
#
#   1  no worked solutions are tracked under a top-level solutions/ directory
#      (the Applied-Optimization leak: a .gitignore line cannot untrack what is
#      already committed, and nothing was watching). Lectures that publish
#      solutions ON PURPOSE are unaffected — they live elsewhere:
#      Optimization-with-Julia ships part-NN/solution/, and the retired DuSpo
#      lectures gate them behind `profile:`. Only a top-level solutions/ fails.
#
#   2  no live Google-Fonts source in _brand.yml. `source: google` makes Quarto
#      emit an @import of fonts.googleapis.com into every page (a GDPR problem
#      here — LG München, 2022). Comments are stripped first, because the German
#      note in Grundlagen-OR's _brand.yml literally reads "... source: google
#      mehr" and must NOT trip the guard.
#
#   3  no `sandstone` theme. Bootswatch's sandstone hardcodes its own Google
#      Roboto import that no brand config can strip, so it re-introduces the CDN
#      call by the back door.
#
#   4  the brand assets exist: styles.scss and _fonts.scss are hard requirements
#      (losing _fonts.scss silently drops every self-hosted face); a missing
#      images/favicon.svg is only a warning, because Mathe-Advent-25 has no logo
#      to derive one from yet.
#
# The check deliberately runs against TRACKED files (git ls-files), because a
# leak is by definition something committed — and that automatically ignores the
# build tree (_site/, .quarto/, _freeze/). The generated chatbot corpus
# (docs/_repo-md/) and third-party _extensions/ are filtered out explicitly.

set -u

root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$root" || exit 2
repo="$(basename "$root")"

fail=0
warn=0
say()  { printf '%s\n' "$*"; }
ok()   { printf '  \033[32mok\033[0m    %s\n' "$*"; }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$*"; fail=1; }
note() { printf '  \033[33mwarn\033[0m  %s\n' "$*"; warn=1; }

# Strip YAML/SCSS comments without eating "#hex" values inside quotes: drop a
# whole-line comment (optional leading space then #) and any trailing " #...".
strip_comments() { sed -E 's/^[[:space:]]*#.*$//; s/[[:space:]]#.*$//'; }

say "guard: $repo"

# 1 — no top-level solutions/ tracked -----------------------------------------
leaked="$(git ls-files 'solutions' 'solutions/**' 2>/dev/null)"
if [ -n "$leaked" ]; then
  bad "tracked files under a top-level solutions/ directory:"
  printf '        %s\n' $leaked
else
  ok "no top-level solutions/ tracked"
fi

# 2 — no live Google-Fonts source in _brand.yml -------------------------------
if [ -f _brand.yml ]; then
  hit="$(strip_comments < _brand.yml \
        | grep -nE 'fonts\.googleapis|fonts\.gstatic|source:[[:space:]]*google' || true)"
  if [ -n "$hit" ]; then
    bad "_brand.yml declares a live Google-Fonts source:"
    printf '        %s\n' "$hit"
  else
    ok "_brand.yml has no live Google-Fonts source"
  fi
else
  note "no _brand.yml at repo root"
fi

# 3 — no sandstone theme -------------------------------------------------------
scan="$(git ls-files '*.yml' '*.yaml' '*.qmd' \
        | grep -vE '^(docs/_repo-md/|_extensions/|_site/)' || true)"
sand=""
if [ -n "$scan" ]; then
  sand="$(printf '%s\n' "$scan" | while IFS= read -r f; do
            strip_comments < "$f" | grep -niw 'sandstone' | sed "s|^|$f:|"
          done)"
fi
if [ -n "$sand" ]; then
  bad "sandstone theme referenced (re-adds a Google Roboto import):"
  printf '        %s\n' "$sand"
else
  ok "no sandstone theme referenced"
fi

# 4 — brand assets -------------------------------------------------------------
for f in styles.scss _fonts.scss; do
  if [ -f "$f" ]; then ok "$f present"; else bad "$f missing"; fi
done
if [ -f images/favicon.svg ]; then
  ok "images/favicon.svg present"
else
  note "images/favicon.svg missing (expected only for a lecture with no logo yet)"
fi

say ""
if [ "$fail" -ne 0 ]; then
  say "guard: FAILED"
  exit 1
fi
if [ "$warn" -ne 0 ]; then
  say "guard: passed with warnings"
else
  say "guard: passed"
fi
exit 0
