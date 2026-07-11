# Review: tutorial-04-05-transport.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

This is the capstone that connects Lecture 1's solar-panel transport model to real data (100 warehouses, 1000 solar farms, 100,000 cost pairs — verified from the CSVs), and the dictionaries section is a genuinely useful bridge from DataFrames to model indexing. Two significant problems: the introduction promises a *cost-minimization* model that "meets all customer demands" while the implemented model *maximizes profit* with demand as a `≤` cap, and the actual modeling — variables, objective, constraints — is handed to students fully worked, so the capstone of tutorials IV.I–IV.IV contains no modeling exercise at all.

## 1. High-impact teaching improvements

- **Let students build the model.** The only exercises are counting rows (1.1), creating an empty model (3.1), and calling `optimize!` (5.1); the variables, objective, and both constraints (lines ~239–283) are given as finished code. After four tutorials of scaffolding, students should write at least the objective and the two constraints themselves, with folded tests (`is_valid` on the constraint containers, plus an assert on `objective_value` — currently the tutorial has **no correctness check whatsoever** beyond `termination_status == OPTIMAL`, so a wrong-signed objective would pass silently).
- **Surface the unmet-demand insight.** The profit margin is revenue − varCosts = 11000 − 6300 = 4700, and in `cost.csv` 66,293 of the 100,000 routes cost more than 4700 (costs range 1000–12000) — two thirds of all routes are unprofitable, which is exactly why the demand constraint is `≤` and why the model is a profit maximization. Every farm does have at least one profitable route (verified: the per-farm minimum cost never exceeds 4700), so any unserved demand comes from capacity competition, not isolation. A closing question — "inspect `transport_df`: which farms receive less than they requested, and why?" — would tie this tutorial back to the `=` vs `≤` discussion in Lecture 1.

## 2. Model & notation issues

- **Story–model contradiction (lines ~25, ~63 vs. ~252–258, ~277–283).** The introduction and Section 1 both state the goal as "minimize the total cost of transportation while meeting all customer demands", but the objective maximizes `(revenue − varCosts − travelCosts)·X` and the demand constraint is `sum(X[i,j] for i) <= requested_dict[j]` — demand may legitimately go unmet. Either rewrite the narrative as profit maximization with optional demand (matching Lecture 1's revised model), or change the model. Relatedly, `revenue` and `varCosts` (lines ~67–68) are introduced with no stated purpose because the declared goal doesn't use them.
- **Constraint described incorrectly (line ~262):** "we need to ensure that the supply from each supplier is enough to cover the demand of each customer" describes neither constraint. `restrictAvailable` caps total shipments per supplier at availability; `restrictDemand` caps total deliveries per farm at demand. Describe each constraint next to its code block.
- **Feasibility/boundedness (verified from data):** total supply 30,321 vs. total demand 28,014; with both constraints `≤` and X ≥ 0 the model is always feasible (X = 0) and bounded. Worth one sentence, since students coming from the "meet all demand" narrative may expect infeasibility to be possible.
- **Three different index expressions for the same sets:** the variable uses `X[available.supplier, keys(requested_dict)]` (line ~244), the objective iterates `keys(available_dict)` (line ~256), and `restrictDemand` iterates `requested.solar_farm` / `available.supplier` (lines ~279–281). The text says mixing is deliberate "to show you that it is possible", which is fair — but add the caution that this only works because all three expressions contain exactly the same labels; a filtered DataFrame or a stale dictionary would produce a `KeyError` or, worse, a silently smaller model.
- **Integrality:** truckloads are continuous (`>= 0`). Consistent with Lecture 1, but since the results section filters `transport_values[i,j] > 0` and reports "truckloads", a note that this transport LP happens to return integral solutions (or simply that fractional truckloads are acceptable here) would preempt questions.

## 3. Content & robustness

- **Untyped DataFrame columns (lines ~327–331):** `supplier = []` creates `Vector{Any}` columns; `supplier = String[]`, `solar_farm = String[]`, `truckloads = Float64[]` is the idiomatic DataFrames style the course teaches. Also, this init block is `eval: true` while the loop that fills it (line ~337) is `eval: false`, so the rendered page displays a 0-row DataFrame with no explanation.
- **Download instructions (line ~78):** "right-click the CSV icon for the desired dataset ... located below the notebook" — the `code-links` render in the page sidebar in the current theme, not below; verify the wording against the rendered site so students can actually find the three files.
- `requested_dict` is the only dictionary never previewed (available and travelCosts are, lines ~165–174) — add the symmetric preview, since Exercise 1.1's `num_solar_farms = 1000` makes it the largest lookup table students have met so far.

## 4. Pedagogy & polish

- **Typos:** "convinient" (line ~74) → "convenient"; "Begining of the transportation plan" (line ~356) → "Beginning"; "it is dictionary with tuples as keys" (line ~184) → "a dictionary"; "iterate over the keys dictionaries" (line ~322) → "keys of the dictionaries".
- "The variable costs from each truckload" (line ~68) → "for each truckload"; also state the resulting margin (4700) explicitly here so the objective expression later reads naturally.
- The claim "Calling the variable itself will just show the structure of the variable, not the values" (line ~308) is paired with `first(X, 5)` (line ~312), which shows five `VariableRef`s rather than "the structure"; either show plain `X` or adjust the sentence.
- Good practices worth keeping: the learning-objectives list renders correctly (blank line present, unlike IV.III/IV.IV), the `@__DIR__` data-loading pattern, and the honest callout that the result-extraction loop "looks rather complicated" (line ~360).
