# Review: tutorial-13-recap.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

An intentionally light session-closer, and the warm, personal tone (honest ask for feedback, explicit "no influence on your grade", thesis/seminar invitation) is a genuine strength. The main weakness is that a tutorial titled "Recap and Discussion" contains no recap material at all — students who prepare from the website get only a feedback form. Secondary issues are the fragile third-party form embed and a couple of typos in a very short file.

## 1. High-impact teaching improvements

- **Add actual recap scaffolding.** The page promises "a last chance to ask questions and discuss the content" (line ~8) but gives students nothing to prepare with or to structure the session around. Concretely: (a) a table of the course's problem classes with links to their lectures (transport LP, production, scheduling, districting, safety scheduling, …); (b) links to the existing cheatsheets in `general/`; (c) 3–5 discussion prompts in the style of the exam ("Which problems needed binary variables and why?", "When did we linearize, and how?"). Even half a page turns a blank session into a guided one and helps students who can't attend.
- **State exam logistics once more.** This is the last tutorial before the exam — a short callout linking the FAQ (permitted DIN A4 sheet, bonus-point calculation) would land exactly where students look for it.
- **Give the feedback deadline as a date, not "before the exam"** (line ~12), and say where/when the bonus half-point is credited — the FAQ (`general/faq.qmd`) explains bonus points per exercise but not this feedback bonus; a cross-link in both directions would prevent "does this really count?" emails.

## 2. Code issues

No issues found (the tutorial contains no code and no optimization model).

## 3. Content & robustness

- **Fragile third-party embed** (lines ~16–17): the Tally form iframe plus raw `<script>` loading `tally.so/widgets/embed.js` fails silently offline, behind ad/script blockers, and in any non-HTML render. Add a plain fallback link ("If the form does not load, open it directly: https://tally.so/r/Ekl9gN") so the bonus opportunity never disappears with the widget.
- **Hardcoded academic year** (line ~16): the iframe title says "Applied Optimization 25/26" — fine today, but this and the form ID will silently go stale next winter semester; worth a comment in the source as a yearly-update reminder.
- **Privacy policy gap:** `general/privacy.qmd` covers the chatbot's data processing but does not mention Tally, even though the embedded form sends student input (and the embed script request itself) to a third party. Given the site maintains a privacy policy, add Tally there or a one-line privacy note next to the form.
- Minor: the iframe sets a fixed `height="347"` while also requesting `dynamicHeight=1` — harmless, but the fixed height is dead weight if the script loads and a wrong size if it doesn't.

## 4. Pedagogy & polish

- **Typo** (line ~21): "Thank's for your participation!" → "Thanks for your participation!".
- **Idiom** (line ~14): "I know this is much to ask of you" → "this is a lot to ask of you"; same line has a double space after "coming up.".
- **Typography** (line ~12): "15 - 20 minutes" → "15–20 minutes" (en dash, no spaces).
- The rhetorical "that's not too bad …, right?" (line ~12) suits the informal tone of this page — keep it; no change needed.
