# Review: tutorial-04-03-constraints.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

This tutorial teaches three genuinely important JuMP skills — container objectives, container constraints, and conditional (filtered) constraints — and the final combined test with an asserted objective value of 68 is correct (verified: 4·5 + 4·12 = 68) and a nice end-to-end payoff. The main weakness is conceptual: the decision variables are named `profits` while the story talks about production quantities, capacities, and demand, so the exercise quietly teaches students to conflate decision variables with objective coefficients. There are also a heading-level bug and a Markdown list that won't render.

## 1. High-impact teaching improvements

- **Fix the `profits` variable muddle (Exercises 1.1–3.1).** The scenario says "Each product has a different profit margin" (line ~59), yet the objective is `sum(profits)` — i.e., every margin is 1. Then "maximum daily production capacity due to machine limitations" (line ~94) is modeled as *profit* ≤ 12, and "limited market demand" (line ~128) as *profit* ≤ 5. Cleanest fix: rename the variables `production[1:8]`, introduce a small margin vector (e.g., `margin = [3,2,4,...]`), make the objective `sum(margin[i] * production[i] for i in 1:8)`, and let the capacity/demand constraints bound production. That is exactly the parameter-vs-variable distinction Lecture 1 labors to establish; as written the tutorial undoes it. (If the variables stay as-is, at least rename the story to "profit contributions".)
- **Interpret the solution.** With the correct model the optimum is profits 1–4 at 5 and profits 5–8 at 12 (objective 68) — the bar chart in "Visualization of Results" (line ~156) will show exactly two levels. Add one sentence pointing this out and asking why ("every variable sits at its tightest upper bound — what does that tell you about the constraints?"). Currently the plot is shown but never read.
- **Warn about the model before Exercise 2.1.** Between Exercise 1.1 and 2.1 the model is unbounded (maximize a sum of nonnegative variables with no upper limits). A one-line callout ("if you called `optimize!` now, HiGHS would report the problem unbounded — the constraints you add next fix that") converts a latent trap into a teaching moment about boundedness.

## 2. Model & notation issues

- **Verified:** with `maxProfit[i]: profits[i] <= 12` for i ∈ 1:8 and `smallProfit[i]: profits[i] <= 5` for i ∈ 1:4, the maximum of `sum(profits)` is 4·5 + 4·12 = 68, matching the assert (line ~147). Feasible and bounded once both constraint sets exist.
- **Conditional-constraint test can't distinguish filter from range (line ~141):** `all(is_valid(another_model, smallProfit[i]) for i in 1:4)` passes equally if a student wrote `smallProfit[i in 1:4]` without the condition syntax the section teaches (`[i in 1:8; i <= 4]`). Since the point of Section 3 is the `;` filter, consider also checking that `smallProfit` has exactly 4 elements or that index 5 is absent.
- The conditional example (lines ~118–124) is correct JuMP syntax; the prose "and `variableName[3]` was not restricted" should be present tense ("is not restricted").

## 3. Content & robustness

- **Learning-objectives list doesn't render as a list (lines ~16–19):** there is no blank line between "you'll be able to:" and "1. Create simple constraints…", so Pandoc renders the three items as one run-on paragraph. Add a blank line (Tutorial IV.V does this correctly; IV.IV has the same bug).
- **Model-creation block is `#| eval: false` (line ~36)** while the `Pkg.add` block above it is `eval: true` — so the rendered page installs packages but never shows the model being created or its confirmation message, and `another_model` doesn't exist at render time. Other IV tutorials evaluate this block; align.
- **`using Plots` (line ~158)** but Plots is not in the `Pkg.add(["JuMP", "HiGHS"])` at line ~26 — works only if the shared environment already has it; add it to the list or drop the hidden add block.

## 4. Pedagogy & polish

- **Heading-level bug (line ~92):** "# Exercise 2.1 - Define constraints" is a level-1 heading; every other exercise is level-2 (`##`). This breaks the section hierarchy/TOC.
- **Typos:** "lower or equalthan 5" (line ~130) → "lower than or equal to 5"; "Add a conditional constraints" (line ~126) → "constraint"; assert message "the should be 68" (line ~148) → "the objective should be 68".
- The chart labels continue the variable muddle: title "Optimal Production Levels" with y-label "Profit" (lines ~163–165) — they can't both be right; fix together with the renaming above.
- Title says "Constraints in JuMP" but Section 1 is about objective functions, and the conclusion (line ~173) says "advanced handling of objective functions and constraints" — retitle to "Objectives and Constraints with Containers" or move Section 1's content to where objectives are taught.
