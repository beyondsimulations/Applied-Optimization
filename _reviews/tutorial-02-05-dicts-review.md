# Review: tutorial-02-05-dicts.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

The school-directory analogy and the books exercises are clear and appropriately gentle. However, this is by far the thinnest tutorial in the series (about half the length of its siblings): Section 2 introduces `keys`, `values`, and dictionary iteration with zero exercises, the tutorial never says why dictionaries matter for *this* course (they become the standard container for model parameters in the JuMP tutorials), and Exercise 1.1's test accepts a wrong answer.

## 1. High-impact teaching improvements

- **Section 2 has no exercises at all** (lines ~101–140): "Advanced Dictionary Operations" shows `keys()`, `values()`, and `for (student, grade_list) in grades` and then the tutorial ends. Iteration over key-value pairs is precisely the skill students need later (looping over parameter dictionaries in models). Add at least one exercise, e.g., "compute each student's average into a new dictionary `averages`" — it would also recycle the loops tutorial and give the section a payoff.
- **Motivate dictionaries with the course's own use case.** From tutorial-04 onward, problem data lives in dictionaries (costs, demands keyed by location/product). One sentence in the introduction ("later in this course, dictionaries will store the parameters of our optimization models — e.g., `cost = Dict("Hamburg" => 7.2, ...)`") converts a generic CS topic into visible course infrastructure.
- **Exercise 1.1's test can't catch a wrong author** (line ~80): `@assert haskey(books, "Harry Potter and the Philosophers Stone")` passes even if the student stores `"Rowling"`, `42`, or an empty string as the value. Add `@assert books["Harry Potter and the Philosophers Stone"] == "J.K. Rowling"`.
- **Missing everyday tools:** `get(dict, key, default)` and `delete!` are absent, although `get` with a default is the idiomatic answer to exactly the `haskey` pattern shown at line ~55. A three-line addition to Section 2 would round out the toolkit.

## 2. Code issues

- **Weak assert in Exercise 1.1** — see above (line ~80); the value is never checked.
- **Exercise title mismatch** (line ~62): "Exercise 1.1 - Create and Modify a Dictionary" — the dictionary is created *for* the student in the scaffold (line ~69); the student only adds an entry. Retitle "Add to a Dictionary" (and 1.2 already covers "Modify").
- **Test cells not folded:** as in tutorial-02-04, the test cells lack the `#| code-fold: true` used in tutorials 02-01 to 02-03 (lines ~77, ~92) — inconsistent series convention.

## 3. Content & robustness

- **Missing apostrophe in a load-bearing string** (lines ~64, ~80): the book title is "Harry Potter and the Philosophers Stone" — correctly "Philosopher's Stone". Note the exercise text and the assert use the same misspelled key, so they are *internally* consistent; if you fix it, fix both places, or students copying the correct title from memory will fail the `haskey` check.
- **Conclusion heading level** (line ~144): `## Conclusion` is an H2, while every other tutorial in the series uses `# Conclusion` (H1) — this changes the rendered sectioning/TOC.
- No stale dates, placeholders, or external-link fragility found; the closing "Continue to the next file to learn more advanced Julia concepts" correctly points ahead to tutorial-03-01-functions.qmd.

## 4. Pedagogy & polish

- **Stilted instruction** (line ~16): "affirm your comprehension with `@assert` statements" — the sibling tutorials say "verify your implementations with `@assert` statements"; use the same plain phrasing.
- **Naming inconsistency in examples:** the student roster is "Elio, Bob, Yola" (line ~33) — Section 1 of the vectors tutorial uses "Mike, Yola, Elio". Harmless, but a consistent cast of characters across the series is a nice touch and "Bob" is the odd one out.
- **Missing `#| eval` directives are consistent here** (all demo cells use `#| eval: true`) — good; this is the convention the other tutorials should follow.
