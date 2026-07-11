# Review: lecture-05-production.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A well-motivated deck: the brewery case study (retiring planner, shrinking batch sizes) sets up the setup-vs-holding-cost trade-off nicely, the question–fragment rhythm carries through the whole formulation, and the "goal of this constraint" callouts are good scaffolding. The two main weaknesses are a genuine model bug — the inventory balance is only stated for t > 1, so period-1 demand is never enforced and the model as presented has the trivial all-zero optimum — and a Julia section that stops after the objective, so students never see constraints coded, the model solved, or a production plan.

## 1. High-impact teaching improvements

- **Finish the Julia implementation** (lines ~387–436). The section declares variables and the objective, then the lecture jumps to "Model Characteristics". No demand data `d`, capacity `a`, times `b`/`g` are defined; no constraints are added; `optimize!` is never called; no solution is shown. As written, `clsp_model` contains only an objective over non-negative variables, so its optimum is 0 with everything empty — a misleading artifact if students run the code. Add the three constraint blocks (they map almost one-to-one from the math and would reinforce the `@constraint` syntax from lecture 4), solve a small instance, and show the resulting plan — e.g., which weeks each beer is bottled and how inventory bridges the gaps. That payoff slide is the whole point of the lecture.
- **Answer (or at least resolve) the Big-M tightening question.** Slide "Model Characteristics" (line ~477) asks "Can the Big-M constraint be tightened?" but the answer never appears. Surface it: production in period t can only serve demand from t onward, so `M = Σ_{τ≥t} d_{i,τ}`, and capacity gives a second bound `M = (a_t − g_i)/b_i`; the tight choice is the minimum of the two. This is the single best teaching moment about MIP formulation strength in the lecture — one fragment slide would do it.
- **Add a learning-objectives slide.** After today: formulate the CLSP, explain the setup/holding trade-off, recognize and construct Big-M constraints, discuss end-of-horizon effects.
- **The planning-horizon question deserves a hint** (line ~488): "What is the problem with the planning horizon?" is a good question, but nothing on the slide or nearby anchors the answer (end-of-horizon effect: the model builds no inventory for demand after week |T|; rolling horizons as the fix). Add a fragment with the answer, as done for the other interactive questions.

## 2. Model & notation issues

- **Period-1 demand is never enforced** (lines ~257, ~361): the inventory balance `W_{i,t-1} + X_{i,t} − W_{i,t} = d_{i,t}` holds only `∀ t ∈ 𝓣 | t > 1`, and no `t = 1` constraint or initial inventory is given. The solver can set all X = Y = 0 and pick `W_{i,1}` freely, so the stated model has optimal cost 0 and satisfies no demand in week 1 (and, via free `W_{i,1}`, effectively none afterwards either, since `W_{i,1}` is an unconstrained-from-above variable that can fake any starting stock). Fix: define `W_{i,0} = 0` (or a given initial inventory parameter) and state the constraint `∀ t ∈ 𝓣`. Alternatively add the explicit period-1 constraint `X_{i,1} − W_{i,1} = d_{i,1}`. The nice interactive question "What does |t>1 mean?" (line ~272) could then extend to "…and what goes wrong if we forget t = 1?".
- **Setup-constraint goal is vacuous** (line ~278): "Set up beer types where the batch size is ≥ 0" — that holds for every batch, including empty ones. Must read "> 0".
- **Set symbol used as summation limit** (lines ~207, ~298, ~342): `∑_{i=1}^{𝓘}` and `∑_{τ=1}^{𝓣}` should be `∑_{i=1}^{|𝓘|}` or, better, the `∑_{i∈𝓘}` form that the recap slides (lines ~350, ~363, ~365) already use correctly. Currently the same objective function appears with two different notations 140 lines apart.
- **Index-comma inconsistency:** `d_{iτ}` (line ~298) vs `d_{i,τ}` (line ~363); everywhere else the lecture uses the comma convention.
- **Quantifier style inconsistency:** `∀ i∈𝓘, t∈𝓣` (line ~257) vs `∀ i∈𝓘, ∀ t∈𝓣` (lines ~298, ~363) — pick one.
- **Integrality of X never discussed:** batch sizes `X_{i,t} ≥ 0` are continuous (line ~378), which is fine for bottles at this scale, but after lecture 1's truckload discussion a one-line remark ("we allow fractional bottles — why is that acceptable here?") would preempt the obvious student question.
- **`c_i` symbol reuse across lectures:** within this lecture `c` (holding cost) is consistent, but note lecture 1 used `c_{i,j}` for transport cost; if decks are meant to share a notation table this is worth a glance. Minor.

## 3. Content & robustness

- **Empty slide:** "Literature II" (line ~565) is a bare header — renders as a blank slide.
- **External dependencies:** three Unsplash hotlinked images (lines ~19, ~35, ~52) and one Unsplash `download?...&force=true` background URL (line ~506) — slow and fragile in the lecture hall; move to images.beyondsimulations.com like the `ao_clsp_overview.png` asset.
- **CLSP acronym used before definition:** headers say "CLSP: Objective Function" (line ~348) onward, but "Capacitated Lot-Sizing Problem" is first spelled out only at line ~535 ("Multi-level Capacitated Lot-Sizing Problem") — and even there the base acronym is never explicitly tied to the letters. Define it when first used, ideally on the Problem Structure title slide.
- **Misused technical term "feasible"** (line ~508): "Solving the problem with commercial solvers is not feasible" — in an optimization course "infeasible" has a precise meaning that is not this one. Say "not tractable" or "does not solve in acceptable time".
- **Scale slide vs. model mismatch is silent** (lines ~513–520): the case study has semi-finished products, multiple production levels, and storage resources — none of which the single-level CLSP covers. One sentence ("our model is the single-level core; the real case is multi-level, see [^1]") would prevent confusion about why the taught model doesn't match the bullet list.

## 4. Pedagogy & polish

- **"for unit of beer type"** (line ~143): missing "one" — the same parameter is correctly written "for one unit" at line ~201.
- **"set-up costs" vs "setup cost/time"** (lines ~59 vs ~141–142, ~225): hyphenation inconsistent; the model slides use "setup", so align the intro slides.
- **"todays lecture"** (line ~543): "today's".
- **"Math-Heuristics"** (line ~461): the standard term is "matheuristics" (and "Tabu-Search" is usually "tabu search" — it is a metaheuristic, arguably misplaced under matheuristics examples).
- **Awkward sentence** (line ~338): "It has more variables and parameters when compared to the other constraints but it is easier to understand." — trim to "It uses more parameters than the previous constraints, but it is easier to understand."
- **Footer link labeled "Home" points at the lecture itself** (line ~7): `[Home](lecture-05-production.qmd)` — if the convention is deck → document page this is fine, but the label "Home" suggests the course landing page; consider "Notes" or link to the site index.
- **Accessibility:** none of the images has alt text — add short descriptions for the website render.
