# Review: tutorial-04-02-bounds.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A short, well-scoped tutorial: the continuous/integer/binary typology with one relatable example each (water, cars, store) is exactly right for the audience, and the exercises escalate sensibly from single variables to arrays to a matrix. There is no optimization model here (no objective or constraints), which is fine for the scope. Weaknesses are cosmetic but real: a wrong code comment, inconsistent `eval` options on exercise blocks, and a conclusion paragraph that describes a different tutorial.

## 1. High-impact teaching improvements

- **Say why `Model()` has no optimizer (line ~36).** Tutorial IV.I taught `Model(HiGHS.Optimizer)`; here it's suddenly `Model()` with no explanation. One sentence ("we only build variables here, we never solve, so no solver is needed — you can also attach one later with `set_optimizer`") prevents students from thinking the solver argument is optional in general.
- **Show how to change bounds after creation.** Section 3 only sets bounds at declaration. `set_lower_bound` / `set_upper_bound` / `delete_lower_bound` are the natural companions (and `has_lower_bound` is already used in the tests) — two lines of example would round off the "Bounds" half of the title.
- **Connect Exercise 2.2 forward:** the 3×4 binary `stock_decision` matrix is precisely the shape of the transport variables in Tutorial IV.V; a closing sentence ("matrices of variables like this are the backbone of the transportation model in Tutorial IV.V") would give the exercise a destination.

## 2. Code issues

- **Wrong comment (line ~24):** the hidden setup block says `# Import the DataFrames package` but runs `Pkg.add("JuMP")` — copy-paste leftover.
- **Inconsistent `eval` flags on student blocks:** Exercise 2.1's code block (line ~139) and Exercise 3.1's (line ~192) lack `#| eval: false`, while Exercises 1.1 (line ~97) and 2.2 (line ~156) have it. Empty blocks render harmlessly, but the inconsistency will bite the moment solutions are pasted in for a solution render.
- **Tests don't pin the model:** the checks (lines ~106–108, ~146–147, ~199–200) verify type/bounds but not that the variables live in `model` (e.g., via `is_valid(model, water_amount)`). A student who created their own model would pass. Minor, but `is_valid` was already introduced in IV.I.
- The example variables `variableName5`–`variableName7` (lines ~119–131) silently add 20 + 100 + 900 variables to the shared `model` on every render — harmless here, but worth a comment since students may wonder why their model is "full" if they inspect it.

## 3. Content & robustness

- **Conclusion describes the wrong tutorial (line ~208):** "the tutorial on advanced variables … create variables in containers … and work with indexed variables" — it never mentions bounds (the title topic, Section 3) and reads like a leftover from a previous version. Rewrite to match: variable types, containers, bounds.
- No external links, no stale dates, no placeholders — robust otherwise.

## 4. Pedagogy & polish

- "The amount of water in a reservoir (can be any number, like 3.7 liters)" (line ~47) — a reservoir measured in single liters is odd; "water in a bottle" or "millions of liters" reads better.
- "To create a set based on a range" (line ~121) — it creates a *container* (array) indexed by a range, not a set; the word "set" collides with the mathematical sets from Lecture 1.
- Exercise 3.1 (line ~189): "between 0 and 37 degrees" — specify Celsius for the (German) audience, and note that both `lower_bound == 0` and `upper_bound == 37` are checked so students know the interval syntax `0 <= temperature <= 37` is expected.
- The intro (line ~16) mentions "confirm your understanding with `@assert` statements" — good; consider adding the one-line learning objectives list used in IV.III and IV.IV for consistency across the tutorial series.
