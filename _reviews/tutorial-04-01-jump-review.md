# Review: tutorial-04-01-jump.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A well-paced first contact with JuMP: the model → variables → constraints → objective → solve progression mirrors the actual JuMP workflow, the factory story is concrete, and the `@assert` feedback loop is a genuinely good device. The main problem is that the final verification block (lines ~288–296) is broken Julia — students who solve the problem *correctly* will still see errors — and a syntax example is missing its `@`, which beginners will copy verbatim.

## 1. High-impact teaching improvements

- **State the payoff.** The optimal solution is productA = 12, productB = 4 with profit 100·12 + 150·4 = **1800**, and both department constraints are exactly binding (2·12+4·4 = 40, 4·12+3·4 = 60). None of this is ever said in prose — the test only checks quantities. Add a closing paragraph: "Maximum profit is 1800, and both departments are fully used" plus a reflection question: "Product B earns 150 vs. 100 — why don't we produce only B?" (Answer: B consumes cutting hours twice as fast; producing only B yields 10·150 = 1500 < 1800.) This turns the solve step into an insight.
- **Assert the objective value too.** The test (line ~293) checks `value(productA)` and `value(productB)` but never `objective_value(model) ≈ 1800`. A student with a wrong objective but the right feasible corner would pass; asserting the profit closes that hole.
- **Integrality note.** The variables count "units produced" but are declared continuous. The optimum happens to be integral (12, 4), so nothing breaks, but one sentence ("here the optimal solution is whole numbers anyway; Tutorial IV.II introduces integer variables") would preempt the obvious student question.

## 2. Model & notation issues

- **Broken final test block (lines ~288–296).** Three independent bugs:
  1. `val_productA` and `val_productB` are used in the `println` (line ~292) and in the assert messages (lines ~293–294) but are **never defined** → `UndefVarError` even for a correct model. Should be `value(productA)` / `value(productB)` or define the `val_` variables first.
  2. `"$termination_status(model)"` (line ~291) interpolates only the function name and appends literal `(model)`; needs `$(termination_status(model))`.
  3. The stray `.` after the closing quote on line ~291 (`... $termination_status(model)".`) is not valid where it stands — it gets parsed as field access on the string and breaks the block.
- **Missing `@` in the constraint example (line ~163):** `constraint(model_name, constraint_name, 4 * variable_name <= 100)` must be `@constraint(...)`. This is the template students are told to imitate in Exercise 3.1; as printed it throws `UndefVarError: constraint not defined`.
- **Duplicated assert (lines ~129/134):** `@assert @isdefined productA` appears twice; the second occurrence should be `@assert @isdefined productB`. As written, a missing `productB` fails only inside `typeof(productB)` with a less friendly error.
- **Verified numbers:** cutting 2A+4B ≤ 40, finishing 4A+3B ≤ 60 intersect at (12, 4); corner profits are (0,10) → 1500, (15,0) → 1500, (12,4) → 1800, so the asserted solution A = 12, B = 4 is correct and unique.

## 3. Content & robustness

- **Environment activation conflict (lines ~58–61):** the hidden include already runs `Pkg.activate("../applied-optimization")`, then this visible block runs `Pkg.activate("applied-optimization")` (no `../`) — a different path, which silently creates a fresh empty environment when run from the tutorials directory. Other IV tutorials keep this hidden (`echo: false`); align the path and visibility, and avoid `Pkg.add` on every render.
- The Exercise 3.1 test honestly says only existence is checked (good), but combined with the broken Section 5 block there is currently **no working end-to-end correctness check** in the tutorial.

## 4. Pedagogy & polish

- **Typos/grammar:** "based on the on the Cutting and Finishing" (line ~169) — duplicated "on the"; "This defines a constraint that ensures, that the variable" and "Note, that you will have to change" (line ~166) — German-style commas, drop them; the sentence "This defines a continuous variable that's equal to or larger than 0." (line ~114) repeats line ~108 almost verbatim.
- Step 3 of Section 5 (line ~250) is a long run-on sentence; split after "objective function."
- The floating-point callout (line ~282) is good; consider moving it next to the assert with `atol`, where students actually encounter it.
