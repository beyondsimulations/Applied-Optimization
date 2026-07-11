# Course Review — Applied Optimization

**Reviewed:** 2026-07-07 · 13 lectures + 24 tutorials, one review file per source file.
Criteria and required format: [REVIEW-CRITERIA.md](REVIEW-CRITERIA.md). Source files were not modified.

## Most critical issues (fix first)

These are outright bugs — in a model, in code, or in tests that fail students who did everything right.

1. **lecture-05-production**: The CLSP inventory-balance constraint holds only for t > 1 with no initial-inventory condition, so period-1 demand is never enforced — the model as presented has a trivial all-zero optimum. The same first-period gap recurs in **tutorial-05-production**.
2. **lecture-07-routing**: The tour-duration constraint never counts depot-to-first and last-to-depot legs against the 8-hour legal cap; the MTZ explanation twice says "$d_i + U_i$" where it must be "$d_j + U_i$".
3. **lecture-08-districting / tutorial-08-districting**: The lecture's objective omits the incident weights the slides promise — while the tutorial's code correctly applies them, so math and code contradict each other. The tutorial also crashes in a cell labeled "no mistakes" (`Random.seed!` without `using Random`), which breaks reproducibility of the whole exercise.
4. **lecture-09-safety**: The linking constraint gives each group one stoning slot for the entire four-day horizon instead of per day; fluctuation constraints reference undefined $U_{r,0}$ and use cardinality bars on a quantifier set.
5. **Tests that fail correct students:**
   - **tutorial-04-01-jump**: final verification block references undefined variables and uses malformed interpolation — errors even on correct solutions.
   - **tutorial-04-04-advanced**: asserts exact values (80, 46) when (79, 47) and (78, 48) are equally optimal — correct models can fail depending on the solver's path. Assert the objective instead.
   - **tutorial-07-routing**: the `U` test iterates over all locations including the depot (KeyError for students following the lecture); the `X` test forces a dense matrix admitting zero-cost self-loops.
   - **tutorial-03-04-IO**: `mkdir` crashes on re-run (use `mkpath`); Exercise 2.1 test checks a relative path, contradicting the tutorial's own `@__DIR__` teaching.
   - **tutorial-06-ordersplit**: `Model(SCIP.Optimizer())` errors as written (drop the parentheses); the objective assert accepts `LOCALLY_SOLVED` from a local solver on a nonconvex problem.
6. **tutorial-03-02-handling**: Exercise 1.1's "test" runs `Pkg.update()` — slow, network-dependent, and mutates the pinned course Manifest.
7. **tutorials 11 & 12**: duplicated `tutorial_end.qmd` include renders the closing "Solutions" boilerplate at the top of the page.
8. **lecture-12-rail**: symbol `d` is both the destination index and the travel-time parameter (`d_{o,d}` collides with its own subscript); hidden infeasibility when a queue is smaller than $m \cdot c_o^{min}$; the results section cites three mutually inconsistent runtimes.
9. **lecture-10-intermission (exam practice)**: the debugging exercise contains nine discrepancies where the key says seven; task 1.e's sample solution charges full shifts while the text says "each worked hour"; task 1.a promises production costs that never appear in the solution objective.

## Cross-cutting themes

- **Show the payoff.** Almost every lecture/tutorial formulates a model but never shows (or interprets) its optimal solution. The strongest recurring missed moment: in both lecture 01 and tutorial-04-05, profit maximization makes some customers unprofitable to serve (Hamburg in the lecture; 66,293 of 100,000 routes in the tutorial) — the very reason demand becomes `≤` — and neither ever surfaces it.
- **Fragile external dependencies.** Unsplash `download?...` background URLs and Giphy iframes appear across nearly all lectures (lecture 13 *ends* on a bare Giphy iframe). Host these on images.beyondsimulations.com.
- **Recurring notation issues.** Set symbols used as summation limits ($\sum_{i=1}^{\mathcal{I}}$ instead of $|\mathcal{I}|$); `X_{i,j}` vs `X_{ij}` inconsistency; variable domains (continuous/integer/binary) frequently undeclared; Minimize/maximize capitalization drift.
- **Empty or placeholder content.** "Literature II" slides with no content (lectures 01, 05, 08); "14. ????" in lecture 01; lecture 04 ("Modelling with JuMP") contains no JuMP; tutorial 13 ("Recap") contains no recap material.
- **Invalid Quarto callout types** (`{.callout-attention}`, `{.callout-example}`) render as unstyled divs in tutorials 09 and 03-02.
- **Asserts that don't test what they claim** in the basics series (e.g., `1` passes a Boolean check; `haskey` passes any wrong value); accumulator exercises break under script scoping rules without a `global` note (tutorial 02-04).
- **Stale/administrative:** "submission in 2024" (lecture 01), hardcoded "25/26" and a Tally form absent from the privacy policy (tutorial 13), semester-specific phrasing in lecture 13.

## Index

| File | Review | Headline |
|---|---|---|
| lecture-01-introduction | [review](lecture-01-introduction-review.md) | Unserved-Hamburg insight never surfaced; `c` symbol collision; circular set definitions |
| lecture-02-firststeps | [review](lecture-02-firststeps-review.md) | Advertises a "Scope" tutorial that doesn't exist (it's Dictionaries) |
| lecture-03-packages | [review](lecture-03-packages-review.md) | `while` described backwards; `if`/`else` filed under "Loops"; no packages/data content |
| lecture-04-jump | [review](lecture-04-jump-review.md) | No JuMP content in the JuMP lecture; `CSV.read()` missing sink argument |
| lecture-05-production | [review](lecture-05-production-review.md) | Period-1 demand never enforced; Julia section stops before `optimize!` |
| lecture-06-ordersplit | [review](lecture-06-ordersplit-review.md) | Code example doesn't match the slides' 4-SKU build-up; MIQCP vs MIQP mislabel |
| lecture-07-routing | [review](lecture-07-routing-review.md) | Depot legs missing from 8-hour cap; MTZ index typo (×2) |
| lecture-08-districting | [review](lecture-08-districting-review.md) | Promised incident weighting missing from objective; `X_{i,i}` trick unexplained |
| lecture-09-safety | [review](lecture-09-safety-review.md) | One slot per group over whole horizon, not per day; undefined $U_{r,0}$ |
| lecture-10-intermission | [review](lecture-10-intermission-review.md) | Exam key says 7 discrepancies, exercise has 9; truckloads/units mixed |
| lecture-11-distancing | [review](lecture-11-distancing-review.md) | Horizontal constraint silently subsumed without explanation; $\mathcal{C}_r$ undefined |
| lecture-12-rail | [review](lecture-12-rail-review.md) | `d` symbol collision; hidden infeasibility trap; contradictory runtimes |
| lecture-13-recap | [review](lecture-13-recap-review.md) | Recap names contradict the lectures' own terminology; ends on a Giphy iframe |
| tutorial-02-01-variables | [review](tutorial-02-01-variables-review.md) | Type asserts don't test types (`1` passes Boolean) |
| tutorial-02-02-vectors | [review](tutorial-02-02-vectors-review.md) | Calls column vectors "rows"; `[1 2 3]` vs `[1, 2, 3]` never taught |
| tutorial-02-03-comparisons | [review](tutorial-02-03-comparisons-review.md) | `hello` shown without quotes (UndefVarError); `if` promised but never taught |
| tutorial-02-04-loops | [review](tutorial-02-04-loops-review.md) | Accumulator exercises fail under script scoping; needs `global` callout |
| tutorial-02-05-dicts | [review](tutorial-02-05-dicts-review.md) | No exercises in Section 2; no link to dicts as JuMP parameter containers |
| tutorial-03-01-functions | [review](tutorial-03-01-functions-review.md) | Implicit-return teaching moment missed; swapped assertion messages |
| tutorial-03-02-handling | [review](tutorial-03-02-handling-review.md) | Test runs `Pkg.update()`; env path mismatch creates wrong empty environment |
| tutorial-03-03-DataFrames | [review](tutorial-03-03-DataFrames-review.md) | `eachrow`/`push!` prose errors; hidden dependency between exercises |
| tutorial-03-04-IO | [review](tutorial-03-04-IO-review.md) | `mkdir` crashes on re-run; relative-path test contradicts `@__DIR__` teaching |
| tutorial-03-05-Plotting | [review](tutorial-03-05-Plotting-review.md) | Title copy-pasted from DataFrames tutorial; duplicate section numbering |
| tutorial-04-01-jump | [review](tutorial-04-01-jump-review.md) | Verification block is broken Julia; `@constraint` template missing `@` |
| tutorial-04-02-bounds | [review](tutorial-04-02-bounds-review.md) | Conclusion describes a different tutorial; cosmetic comment/flag issues |
| tutorial-04-03-constraints | [review](tutorial-04-03-constraints-review.md) | Variables named `profits` conflate variables with coefficients |
| tutorial-04-04-advanced | [review](tutorial-04-04-advanced-review.md) | Exact-value assert rejects alternative optima; greedy-vs-IP moment missed |
| tutorial-04-05-transport | [review](tutorial-04-05-transport-review.md) | Prose promises cost min with full demand; model does profit max with `≤` |
| tutorial-05-production | [review](tutorial-05-production-review.md) | Unbounded without domain hints yet passes asserts; week-01 demand ignored |
| tutorial-06-ordersplit | [review](tutorial-06-ordersplit-review.md) | `SCIP.Optimizer()` errors; hand-solve answer assumes a rule taught later |
| tutorial-07-routing | [review](tutorial-07-routing-review.md) | Hidden tests contradict the lecture's math; leftover "library" framing |
| tutorial-08-districting | [review](tutorial-08-districting-review.md) | "No mistakes" cell crashes; broken seed changes the instance every run |
| tutorial-09-safety | [review](tutorial-09-safety-review.md) | Invalid callout kills the key hint; 16k vs 10k capacity insight unused |
| tutorial-10-intermission | [review](tutorial-10-intermission-review.md) | Sample solution contradicts "worked hours" text; missing production costs |
| tutorial-11-distancing | [review](tutorial-11-distancing-review.md) | Duplicate include; edge-overhang positions filtered, not fixed to zero |
| tutorial-12-rail | [review](tutorial-12-rail-review.md) | Duplicate include; $\mathcal{R}_{e,t}$ never defined in the tutorial itself |
| tutorial-13-recap | [review](tutorial-13-recap-review.md) | No recap content; Tally form missing from privacy policy |
