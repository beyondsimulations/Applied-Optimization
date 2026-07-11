# Review: tutorial-04-04-advanced.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

The GPS-settings analogy for solver options is excellent for this audience, and the three options chosen (time limit, MIP gap, presolve) are the right ones. The tutorial has one serious defect: Exercise 2.1's test asserts exact variable values (widgets = 80, gadgets = 46), but the modified problem has **multiple optimal solutions** with the same objective 3780, so a perfectly correct student model can fail the test depending on the solver's path. A second missed opportunity: the Section 2 demo problem has a quietly instructive integer optimum that is never discussed.

## 1. High-impact teaching improvements

- **Discuss the Section 2 demo's solution (lines ~101–134).** The integer optimum is widgets = 78, gadgets = 28 with profit 25·78 + 30·28 = 2790 — *not* the greedy answer "max out widgets first" (widgets = 80, gadgets = 26 gives only 2780; the LP relaxation is 2800 at (80, 26.67)). The code prints the results but the text never reads them. One paragraph — "notice the solver does not simply max out the more profitable-per-minute product; rounding the LP answer down loses money" — would be the best integer-programming lesson in the whole tutorial series.
- **Close the loop on re-initialization (Exercise 2.1, line ~150).** The hint tells students to re-create `model = Model(HiGHS.Optimizer)`, which silently discards the time limit, MIP gap, and presolve settings they just set in Exercise 1.1. Pointing this out ("solver options belong to the model — after re-initializing you must set them again") reinforces exactly what Section 1 taught; currently the tutorial undercuts its own lesson without comment.
- **Show Section 3's output (lines ~170–177).** The block explaining termination/primal/dual status is `eval: false`, so the rendered page explains output the reader never sees. Evaluate it against the solved Section 2 model so the explanation sits next to real output.

## 2. Model & notation issues

- **Exercise 2.1 test is not robust to alternative optima (lines ~158–160).** The modified problem — max 30w + 30g s.t. 2w + 3g ≤ 300, w ≤ 80, g ≤ 60, integer — is optimized by *any* integer point with w + g = 126 that stays feasible: (80, 46), (79, 47), and (78, 48) all satisfy 2w + 3g ≤ 300 (160+138, 158+141, 156+144) and all yield exactly 3780. Because both profits are 30, the objective can't break the tie; HiGHS is free to return any of the three, and the asserts `value(widgets) ≈ 80` / `value(gadgets) ≈ 46` then fail on a correct model. Fix: assert only `objective_value(model) ≈ 3780`, or make the tie impossible (e.g., set the widget profit to 31 — then (80, 46) is the unique optimum with value 3860).
- **Time-limit explanation slightly wrong (line ~66):** "stop after 60 seconds if it hasn't found a solution" — the solver stops after 60 s even if it *has* found (possibly suboptimal) solutions; what it gives up is the proof of optimality. Say "stop after 60 seconds and return the best solution found so far, if any."
- **MIP gap vs. exact asserts:** with `mip_rel_gap = 0.005` a solver may legally stop at any solution proven within 0.5% of optimal. It doesn't bite here (the problem is tiny and the student re-initializes the model), but since the tutorial teaches both the gap *and* exact-value asserts, one sentence on this tension would be honest and instructive.
- Verified: 3780 is the correct optimal value of the modified problem (w + g ≤ 126 is forced by 2w + 3g ≤ 300 with w ≤ 80, and 30·126 = 3780).

## 3. Content & robustness

- **Learning-objectives list doesn't render as a list (lines ~18–21):** no blank line between "you'll be able to:" and "1. Understand…", so the three items collapse into one paragraph (same bug as IV.III; IV.V does it correctly).
- **Heading style inconsistency:** this file uses "Section 1: …" (colon) while tutorials IV.I–IV.III and IV.V use "Section 1 - …" (dash).
- Exercise 1.1's student block is `#| eval: true` (line ~78) while all other tutorials mark student blocks `eval: false`; empty it is harmless, but a pasted solution would then execute at render and mutate `model` before Section 2 runs.

## 4. Pedagogy & polish

- "Dual status: … (don't worry too much about this)" (line ~183) — fine for the audience, but a six-word teaser ("it becomes important for sensitivity analysis later") beats pure dismissal.
- Section 2's closing sentence (line ~136) says the problem is "given time constraints and maximum demand" — the constraints are named `widget_demand`/`gadget_demand`, good; consider echoing the units (minutes) in the constraint comment since 240 appears unitless until Exercise 2.1 calls it "minutes".
- No typos of note; prose is clean.
