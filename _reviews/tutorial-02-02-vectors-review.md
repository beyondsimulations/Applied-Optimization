# Review: tutorial-02-02-vectors.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

Good progression (vectors → matrices → tuples) with concrete analogies and a nicely chained exercise pipeline where each result feeds the next (`my_matrix` → `added_matrices` → `my_tuple`). The chaining is also the main fragility: a skipped or re-run cell breaks every downstream assert with no hint why. The matrix section has one garbled sentence and skips the single most important syntax pitfall for later JuMP work — that `[1, 2, 3]` (column) and `[1 2 3]` (row) are different objects.

## 1. High-impact teaching improvements

- **Surface the column-vs-row pitfall.** Section 1 calls a vector "a row of boxes" (line ~30) and the intro "a single row in a spreadsheet" (line ~16), yet `[95, 87, 91, 78, 88]` is a *column* vector, and in Section 2 spaces suddenly mean "same row". Students who internalize "vector = row" will write `[1 2 3]` and get a `1×3 Matrix`, which fails `== [1, 2, 3]` comparisons later. Add a short callout contrasting `[1, 2, 3]` vs `[1 2 3]` with `typeof` output — this is the number-one beginner confusion with Julia arrays.
- **Explain what `*` actually does before dismissing it.** Line ~139 shows `[2 2; 3 3] * [1 2; 3 4]` labeled only "Not element-wise" (result: `[8 12; 12 18]`). One sentence — "this is the matrix product from linear algebra; row-times-column" — turns a confusing non-example into a teaching moment, and matrix products reappear the moment they meet constraint matrices.
- **Tuples exercise quietly contradicts the immutability story.** Section 3 sells tuples as "a sealed package - once you create it, you can't change what's inside" (line ~238), then Exercise 3.1 puts the mutable matrix `added_matrices` inside one. A student who then runs `my_tuple[2][1,1] = 99` will see the "sealed package" change. Either use only scalars/strings in the tuple, or add a callout: the tuple's *slots* are fixed, but a mutable object in a slot can still be mutated.
- **Make the chained-state dependency explicit.** Exercise 2.3's expected answer `[11 22 33; 44 55 77]` (line ~213) is only right if Exercise 2.2 was completed (`my_matrix == [1 2 3; 4 5 17]`); Exercise 3.2 hardcodes `[21 32 43; 54 65 87]` from 2.4. A student who skips one step or re-runs from the middle gets baffling assert failures. Add a note at the top of Section 2 ("exercises build on each other — if an assert fails, re-run from Exercise 2.1") or make each assert message name the prerequisite.

## 2. Code issues

- **Weak test in Exercise 1.4** (line ~121): `@assert first_three_elements == fib[1:3]` compares against the *current* `fib`, so the test passes even if `fib` is wrong from earlier steps — and is tautological for the expected solution. Assert against the literal `[1, 2, 3]` instead.
- **Exercise 2.2 wording vs. indexing order** (line ~183): "Change the 3rd column of the 2nd row" is correct but the earlier access example only shows `matrix[2,2]` without stating the `[row, column]` convention. State it explicitly once ("index as `matrix[row, column]`") — mixing this up is a classic beginner error.
- **Broadcasting framing** (line ~146): "But we can change this by using broadcasting!" suggests broadcasting alters `*`; it is a different operation (`.*`). Reword: "If we want element-wise multiplication instead, we use broadcasting."
- **Inconsistent eval directives:** the Section 2 example cells (lines ~132, ~141, ~152, ~159) lack the `#| eval: true` used elsewhere; harmless but inconsistent.

## 3. Content & robustness

- No stale content, placeholders, external-link fragility, or broken cross-references found. The `tutorial-02-02-vectors.jl` code-link matches the naming convention of its siblings.

## 4. Pedagogy & polish

- **Garbled sentence** (line ~129): "You can add or substract matrices of the same dimensions element-wise if you add or substract them." — circular; also "substract" → "subtract" (twice). Suggest: "You can add or subtract matrices of the same dimensions; these operations work element-wise."
- **Heading style inconsistency** (line ~236): "Section 3: Tuples" uses a colon while Sections 1–2 use "Section N - Title".
- **Abrupt line** (line ~55): "Use '?' in the REPL for function details." floats without context — attach it to the function list above, e.g., "Type `?push!` in the REPL to read a function's documentation."
- **Stray leading space** (line ~20): " Understanding these data structures…" begins with a space, which can render as a literal indent.
