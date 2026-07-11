# Review: lecture-01-introduction.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, content robustness, writing polish

## Summary

A well-crafted deck overall: the interactive question–fragment rhythm, the sets → parameters → variables → objective → constraints progression, and the "Model Reflection" tabset are genuinely good teaching. The findings below are ordered by impact.

## 1. High-impact teaching improvements

- **Surface the hidden insight in the profit example.** With profit per truckload p = 11,000 − 6,300 = 4,700, both routes to Hamburg are unprofitable (Dresden→HH: 4,700 − 5,010 = −310; Laupheim→HH: 4,700 − 7,120 = −2,420). The optimal solution leaves Hamburg completely unserved — which is exactly *why* the demand constraint had to become `≤`. Add a slide after the new model: "Question: Which customer will not receive any panels? Why?" This turns the formulation change from a mechanical edit into an "aha" moment.
- **Show the optimal solution.** Neither example ever shows its solution. A payoff slide with the optimal transport plan and cost would close the loop and set up JuMP in lecture 4 ("in three weeks you'll compute this yourself in 10 lines").
- **Add a learning-objectives slide** at the start ("After today you will be able to…"), pairing with the checklist style already used in the installation section.

## 2. Model & notation issues

- **Symbol collision `c`** (line ~627): the profit model defines `c` as production cost per truckload while `c_{i,j}` is still transport cost; the objective `(p − c_{i,j}) X_{i,j}` mixes both. Rename production cost to `k` or `c^prod`.
- **Sunk-cost subtlety** (line ~598): the description says the company *already produced* the panels, making production cost sunk — strictly the objective should be `(r − c_{i,j}) X_{i,j}`. Either reword to "will produce" or use it as a discussion question about sunk costs.
- **"Former Model" isn't the former model** (line ~648): shows the demand constraint as `≥ b_j`, but the model built earlier (line ~564) used `= b_j`. If the switch is deliberate (following the inequality discussion), say so on the slide; it currently looks like an error.
- **Circular set definitions** (lines ~300–301): "𝓘: set of i ∈ 𝓘" defines nothing. Say "set of resources/constraints, indexed by i" as done correctly later (line ~401).
- **"Objective value without any constraints?" → "zero"** (lines ~501–506): only true if non-negativity is kept; with no constraints at all, the minimization is unbounded. Reword to "without the supply and demand constraints".
- **Integrality never addressed:** `X_{i,j} ≥ 0` is continuous, yet the Variations tab (line ~719) treats fractional truckloads as an extension — implying the base model is integer. Either add `X_{i,j} ∈ ℤ≥0`, or note that this LP always has integral optimal solutions (teaser for total unimodularity).
- **Small notation nits:** `X_{ij}` vs `X_{i,j}` inconsistency (line ~561); missing colon in the variable definition (line ~452); `c_{12}` vs the `c_{i,j}` comma convention (line ~363); "maximize" vs "Minimize" capitalization differs between the general model and the transport model. Consider `\cdot` instead of `\times` (× reads as cross product), though usage is at least consistent.

## 3. Content & robustness

- **Empty slide:** "Literature II" (line ~881) is a header with no content — renders as a blank slide.
- **Stale date:** "likely paper submission in 2024" (line ~110) — update or drop.
- **Ambiguous grading note** (line ~55): "Bonus points only count if the mark is at least 4.0" — on the German scale "at least 4.0" numerically means 4.0 *or worse*. Say "only count if the exam is passed (4.0 or better)".
- **External dependencies:** six Unsplash `download?...` background URLs and a Giphy iframe (line ~230) are slow and can break mid-lecture (or offline in the lecture hall). Move to images.beyondsimulations.com like the other assets.
- **"14. ????"** (line ~156): if an intentional teaser, fine; otherwise fill in.

## 4. Pedagogy & polish

- **Component order inconsistency** (line ~259): "Model Components" lists Objective → Constraints → Variables, but the actual (and better) teaching order is Sets → Parameters → Variables → Objective → Constraints. Align the list.
- **Garbled sentence** (line ~380): "…based on the available solar panels adhering to the available panels" — ending duplicated; trim to "…while meeting demand within the available supply."
- **Typos:** "caligraphic" → "calligraphic" (~409), "Installating" → "Installing" (~772), "a models solution space" → "a model's" (~238), "Use an available algorithms" → "an available algorithm" (~239), "Has anyone an idea" → "Does anyone have an idea" (~545), "todays lecture" → "today's" (~865).
- **Accessibility:** images have no alt text — add short descriptions for the website render.
