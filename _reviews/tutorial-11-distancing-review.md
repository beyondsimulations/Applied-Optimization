# Review: tutorial-11-distancing.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A strong capstone-style tutorial: the "guardrails removed" framing is honest, the provided data (group table, blocked seats) matches both the lecture table and the exercise SVG exactly, and the solution's distancing constraint is a faithful, correct translation of the lecture's rectangle formulation with matching symbol names (`h`, `b`, `p`, `x[g,r,c]`). The main weaknesses are a duplicated `tutorial_end.qmd` include that renders the closing "Solutions" boilerplate at the top of the Introduction, a solution model that leaves right-edge overhang variables unfixed (handled only by filtering the objective), and a visualization helper that can silently hide exactly the constraint violations it is meant to reveal.

## 1. High-impact teaching improvements

- **Show the solution's payoff in the solutions profile.** The solutions block (lines ~85–170) ends at `optimize!(arena_model)` with no `println(objective_value(arena_model))`, no termination-status check, and the visualization block (line ~250) is `eval: false` even under the solutions profile — so the rendered solutions page never shows the objective value or a seating plan. Add a result printout and an evaluated `visualize_seating` call under the solutions profile so students can compare against their own plan.
- **Part 2 has no solutions block at all** (lines ~347–377), while Part 1 does. Within one file this reads as an omission rather than a convention. Add a `content-visible when-profile="solutions"` block with the attendance objective (`sum(req_seats[g] * x[g,r,c] ...)`) and the difference calculation.
- **Surface the score-per-seat insight in Part 2.** Score per seat is: a = 1.0, b = 1.0, c = 4/2 = 2.0, d = 1.0, e = 5/4 = 1.25, f = 1.0, g = 12/6 = 2.0. Under the revenue objective, types c, e, g are favoured; under the attendance objective every seat counts equally, so the trade-off collapses. A one-line question ("Which group types do you expect to gain or lose seats under the new objective? Compare the values per seat!") turns the objective swap into an actual insight instead of a mechanical edit.
- **Warn students to save the first result before re-optimizing.** The difference task (line ~371) needs the Part-1 seat count, but if students modify `arena_model` in place, the first solution is gone. One sentence ("store the number of occupied seats from Task 1 in a variable before you change the objective") prevents a frustrating dead end.

## 2. Model & notation issues

- **Comment contradicts the constraint** (lines ~150–152): the comment says "Each group can only be assigned once" but the constraint is `... <= availability[g]`, i.e. each group *type* may be placed up to its availability. This is precisely the "given differently than in the lecture" adaptation the note (line ~81) announces — say so in the comment ("Each group type is assigned at most as often as available"), otherwise students comparing against the lecture's `≤ 1` set-packing constraint will be confused.
- **Right-edge overhang positions are never forbidden** (lines ~139, ~147): `x` is declared over the full `groups × 10 × 10` grid, but starting positions with `c > 11 - req_seats[g]` (e.g. a size-6 group starting in column 10) are only *excluded from the objective* via the `if c <= maximum(col_set)-req_seats[g]+1` filter — nothing fixes them to 0. They still appear in the availability, per-row, and distancing constraints. In practice presolve will fix them (zero objective coefficient, only `≤` constraints), but the lecture handles this cleanly through the set $\mathcal{C}_{g,r}$; the code should mirror that, e.g. declare `x[g in groups, r in row_set, c in 1:(length(col_set)-req_seats[g]+1)]` or add an explicit `== 0` constraint. As written, the math-to-code mapping of $\mathcal{C}_{g,r}$ is split invisibly across the objective filter and the blocked-seats constraint.
- **What is correct (verified):** the combined horizontal/vertical constraint (lines ~159–162) matches the lecture's $\sum_g \sum_{\tilde r \in [r-b,r]} \sum_{\tilde c \in [c-d_g+1-h,\,c]} X \le 1$ exactly, and with `h = b = 1` it enforces one empty seat between groups, between rows, and diagonally (checked by hand on adjacent, diagonal, and two-apart placements). The blocked-seats constraint (lines ~165–166) correctly forbids any start that would cover a blocked seat. The ten `blocked_seats` coordinates match the exercise SVG exactly (rows 1: cols 1, 2, 9, 10; row 2: cols 1, 10; rows 6–7: cols 5, 6), and `req_seats`/`scores`/`availability` match the lecture table one-for-one.
- **Order of definitions** (lines ~139–144): the "Parameters" (`h`, `b`, `p`) are defined *after* the variables, while the course consistently teaches sets → parameters → variables. Move the parameter block above `@variable` (it also reads oddly that the objective at line ~147 uses `req_seats` before the "Parameters" comment appears).
- `p` is a scalar while the lecture uses $p_r$ per row — fine as a simplification, but a half-sentence noting it ("we use one value for all rows") would keep the lecture correspondence explicit.

## 3. Content & robustness

- **Duplicate include renders the closing boilerplate at the top** (line ~14): `{{< include ../include/tutorial_end.qmd >}}` appears both in the Introduction and at the end (line ~381). The include contains a "# Solutions" advice section, so the rendered page opens with end-of-tutorial text before the problem is even stated. Every other tutorial except tutorial-12-rail.qmd (which has the same defect) includes it only once, at the end. Remove line ~14.
- **Malformed code cell** (lines ~365–369): the second Part-2 cell contains `#| # YOUR CODE BELOW` and a bare `#|` — the marker is buried inside Quarto option-comment syntax instead of being a plain Julia comment. Students copying the pattern from other cells will find nothing to write below. Change to a normal `# YOUR CODE BELOW` line.
- **The visualization can hide model errors** (lines ~250–333), which undercuts its stated purpose of "check if your solution is correct":
  - `if c+i-1 <= 10` (line ~300) silently truncates a group that overhangs the row edge instead of exposing it (this interacts directly with the overhang issue above).
  - The "Mark blocked seats" loop (lines ~281–283) erases any group start on a blocked seat from the matrix, and grey squares are drawn after group squares, over-painting a group that illegally covers a blocked seat.
  - Consider plotting violations in a loud colour instead of erasing them.
- **Visualization polish:** empty seats are never drawn — the `else` branch only plots when `is_blocked`, so the ternary `is_blocked ? :gray : :white` (line ~315) is dead code and the `"" => :white` entry in `color_map` is unused; the plot shows no venue outline. The debug `println` calls (lines ~301, ~313) spam one line per seat. `legend=:outerright` (line ~291) produces an empty legend because every `scatter!` uses `label=nothing`, so students cannot tell which colour is which group type.
- **Missing alt text** (line ~59): the second use of the venue image has no alt text; the first (line ~28) has a caption. Reuse it.

## 4. Pedagogy & polish

- **Typo** (line ~335): "If you encounter any difficulties ad cannot solve" → "and cannot solve".
- **Confusing sentence** (line ~248): "We figure it is likely, that you won't have an applicable solution after the first round, even if your model is working correctly." — German-style comma before "that", and the logic is muddled: if the model is correct, why would the solution not be applicable? Presumably: "Your first model will likely run without errors yet still violate some distancing rule — the plot makes such violations easy to spot." Say that.
- **Comma errors:** "Don't worry, if you cannot solve everything" (line ~49) → "Don't worry if…".
- **Word order** (line ~371): "How many seats more are in use" → "How many more seats are in use".
- **English variant** (line ~36): "travelling" (British) vs. the American spelling used elsewhere in the course ("optimization", "maximize") → "traveling".
- **Awkward phrasing** (line ~26): "Here's our event venue's seating arrangement, as we have used in the lecture" → "Here is the venue's seating arrangement — the same one we used in the lecture".
- **Heading scope** (line ~61): "Distance Requirements" also lists "Maximum two groups per row" and "Grey seats are obstacles", which are not distances. The lecture calls the same list "Seating Constraints" — reuse that title.
