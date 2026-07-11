# Review: tutorial-02-04-loops.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A solid loops tutorial with well-verified expected values (15, 30, 56, and the 9 pairwise products all check out) and a good arc from `for` through `while` to comprehensions. The two most important issues are structural: `if`/`elseif`/`else` is used here without ever having been taught (the comparisons tutorial stops at booleans), and every accumulator exercise silently relies on Julia's *interactive* soft-scope rule — the same code fails (ambiguity warning, wrong result) when run as a plain `.jl` script, which is exactly what the tutorial's own "Julia" code-link hands out.

## 1. High-impact teaching improvements

- **`if` statements are used before being taught.** Line ~41 introduces `break` "to check some condition, we can use `if` statements" and line ~56 chains `if/elseif/else` — but no prior tutorial in the series covers conditionals (tutorial-02-03 ends at boolean values). Either add a brief `if/else` primer at the top of Section 1 or (better) move conditionals into the comparisons tutorial and reference it here.
- **Soft-scope hazard for the `.jl` variants.** Exercises 1.1, 1.2, 2.1, 2.2 (lines ~90, ~107, ~197, ~214) all follow the pattern "global accumulator, then assign to it inside a loop". In notebooks/REPL this works, but in a non-interactive script Julia's soft-scope rule emits an ambiguity warning and treats the assignment as a *new local* — leaving `sum_numbers == 0` and failing the assert. Since the front matter links a `tutorial-02-04-loops.jl` file, students running that path hit a wall the tutorial never explains. Add a callout ("in scripts you'd need `global sum_numbers` — in the notebook it just works"), which is also a genuinely instructive Julia lesson.
- **Say why comprehensions matter for this course.** Section 4 calls them "more Julia-like" (line ~278) but the real payoff is three weeks away: JuMP constraint/variable containers use exactly this generator syntax (`sum(x[i] for i in 1:n)`). One forward-pointing sentence would make students take the section seriously.
- **Missing variable name in Exercise 4.1** (line ~299): the task says only "Create a list of even numbers from 1 to 10 using a list comprehension", but the test (line ~309) requires it to be called `even_numbers`. Every other exercise states the target name; students will fail on `UndefVarError` through no fault of their own. Add "…and store it in `even_numbers`".

## 2. Code issues

- **Untyped empty array in Exercise 3.1** (line ~259): `products = []` creates a `Vector{Any}`. The assert still passes (`==` is elementwise), but since the scaffold is instructor-provided, `products = Int[]` would model good practice; at minimum worth a tip, as `Vector{Any}` performance is a recurring Julia gotcha.
- **Exercise 3.1 order dependency:** the expected `[4, 5, 6, 8, 10, 12, 12, 15, 18]` (line ~266) requires the outer loop over `numbers1` and inner over `numbers2`. The nested-loop example (line ~243) implies this order, but a hint ("loop over `numbers1` on the outside") would prevent correct-but-reordered solutions like `[4, 8, 12, 5, ...]` from failing.
- **Test cells are not folded:** unlike tutorials 02-01 to 02-03, none of the test cells here carry `#| code-fold: true` (e.g., lines ~95, ~113, ~135). The rendered page therefore shows the answers' assert values unfolded — inconsistent with the series convention.
- Expected values verified: 1+2+3+4+5 = 15; 2+4+6+8+10 = 30; countdown from 10 while `>= 3` ends at 2; first multiple of 7 above 50 is 56; products list is correct.

## 3. Content & robustness

- No stale content, placeholders, or fragile external dependencies found. The "Continue to the next file" hand-off (line ~317) correctly leads to tutorial-02-05-dicts.qmd.

## 4. Pedagogy & polish

- **Grammar** (line ~317): "tackled iterable structure" → "iterable structures".
- **Wording** (line ~124): "store the current fruit  in `current_fruit`" has a double space; also `banana` should be quoted as `"banana"` since it's a string literal (same unquoted-string issue as tutorial-02-03).
- **Bucket example duplicates Exercise 2.2's lesson** (lines ~168–180): the `while true ... break` idiom is fully revealed in the example, then Exercise 2.2's tip (line ~226) re-explains it. Fine for reinforcement, but consider making the example use a plain `while current_liters < bucket_size` so the exercise still has something to discover.
- **Section 2 title** "While Loops for Conditional Execution" is heavier than the parallel "Section 1 - For Loops"; "While Loops" suffices.
