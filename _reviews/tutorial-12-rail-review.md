# Review: tutorial-12-rail.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A well-designed conceptual tutorial: the progression from manually constructing $\mathcal{R}_{(D,A),7}$ (task 1) to generalizing it in code (task 5) with a built-in self-check is genuinely good scaffolding, and I verified all solution sets, shortest paths, and travel times against the figures — they are correct throughout. The main weaknesses are a copy-paste include bug that renders the "Solutions" advice block at the top of the page, the fact that the set $\mathcal{R}_{e,t}$ is never (re)defined in the tutorial itself, and a task 4 model answer that misses the key mechanism its own question is about.

## 1. High-impact teaching improvements

- **Restate the definition of $\mathcal{R}_{e,t}$ before task 1** (line ~24). The entire tutorial hinges on the lecture's definition (lecture-12-rail.qmd, line ~481: $t - d_{o,e} \in I_p$), but the tutorial never states it or the timing convention. Add the definition specialized to this instance ($m = 1$, so period = minute and $p = t - d_{o,e}$) plus one worked micro-example, e.g.: a passenger entering B in minute 4 travels B→C (2 min) and C→D (1 min), so they enter arc (D,A) in minute $4 + 3 = 7$ — hence $(B,A,4) \in \mathcal{R}_{(D,A),7}$. Without this, students must reverse-engineer the convention from slides, and off-by-one answers are near-guaranteed.
- **Close the loop to the optimization model.** "The Challenge" (line ~22) promises "minimize the queues" subject to the 100 passengers/minute arc capacity, but no task ever uses the capacity, demand data, or objective. Task 5 computes $\mathcal{R}_{e,t}$ and then stops. Add a short final step (or at least a closing sentence) showing how the computed dictionary `R` plugs into the lecture's arc-capacity constraint $\sum_{(o,d,p) \in \mathcal{R}_{e,t}} X_{o,p} \cdot q_{o,d,p}/\sum_f q_{o,f,p} \leq \alpha c_e$ — that is the payoff the whole tutorial builds toward.
- **Strengthen the task 4 model answer** (line ~157). "Depends on the actual demand" is correct but skips the mechanism the question is designed to teach: with an unchanged fleet now split over both directions, capacity per directed arc roughly halves, while shortest paths shorten substantially — total travel time over all 12 OD pairs drops from 48 arc-minutes (one-directional) to 26 (bidirectional), a 46% reduction (verified from the solution's own distance data). So under uniform demand it is roughly a wash, and demand asymmetry breaks the tie. Spelling this out turns a hand-wave into a quantitative argument students can check.
- **Print a targeted check in task 5** instead of (or in addition to) the full dump: the solution prints all 40 (then 80) entries of `R` plus travel times (~136 lines of output). Printing `R[((:D, :A), 7)]` explicitly and asking "does this match your task 1 answer?" would make the promised self-check (line ~173) concrete and cut the output flood in the rendered solutions page.

## 2. Model & notation issues

- **Stray symbols in the set subscript** (line ~121): "$\mathcal{R}_{(MD,MA),7}$" should be $\mathcal{R}_{(D,A),7}$ — the "M" prefixes look like leftovers from an earlier "Metro D/Metro A" naming and contradict the very next sentence.
- **"a dictionary $R$ that contains $e \times t$ entries"** (line ~173): $e \times t$ is a product of indices, not a count. Say "$|\mathcal{E}| \cdot |\mathcal{T}| = 4 \cdot 10 = 40$ entries". The follow-up "Each entry $r_{e,t}$" also introduces a lowercase $r$ never used elsewhere; stick with $\mathcal{R}_{e,t}$.
- **Dropped condition $q_{o,d,p} > 0$**: the lecture's set definition includes $q_{o,d,p} > 0$, but the task 5 code enumerates all OD pairs unconditionally. The intro's "each origin-destination pair will be requested by at least 1 passenger" (line ~18) is clearly meant to license this, but it does not say *in every period*. Either write "at least 1 passenger in every minute" in the intro or add a one-line comment in the solution noting why the $q > 0$ condition can be skipped here.
- **Math-code naming mismatch in task 2** (lines ~97–101): the lecture variable is $X_{o,p}$ with $o$ indexing stations; the solution uses `x[i in set_stations, p in set_periods]`. Rename the index to `o` (and ideally the variable to `X`) so the code mirrors the lecture formulation, per the course's math-symbol/code-name convention.
- **Ambiguous "in both directions"** (line ~82): "allowed to change by 20 persons in both directions per period" means up/down, but task 3 introduces *travel* directions one section later, inviting misreading. Say "by at most 20 persons up or down per period".
- **Task 3 tie comment is vaguer than the facts** (line ~133): "we can also include more entries such as (B,A,4)" — I verified that (B,A) is the *only* tie affecting arc (D,A): direct B→A takes 4 min, equal to B→C→D→A. The other tied pair, (A,B) (direct 4 = A→D→C→B 4), never touches (D,A). State it precisely: "if ties are broken the other way, exactly one extra entry appears: (B,A,4)."
- **Task 5 code style** (line ~235): looping `for tt in Minutes` and filtering `t - travel_times[(o,e[1])] == tt` works but is roundabout, and `(tt >= 1) && (tt <= 10)` is doubly redundant given `tt in Minutes`. Computing `tt = t - travel_times[(o, e[1])]` once and testing `tt in Minutes` is both faster and closer to the math. Also `R = Dict()` creates `Dict{Any,Any}`; a typed dict would be more idiomatic.
- **Solutions verified correct** (for the record): task 1's six tuples match the figure's travel times (A→B 4, B→C 2, C→D 1, D→A 1) and match what the task 5 code computes for `R[((:D,:A), 7)]`; task 3's set {(C,A,6),(D,A,7)} is correct; all 12 bidirectional shortest paths in the task 5 solution (lines ~279–292) check out, including A→C via A→D→C (2 min) and D→B via D→C→B (3 min).

## 3. Content & robustness

- **`tutorial_end.qmd` is included twice** (lines ~14 and ~410). The first include renders the full "Solutions" advice section at the *top* of the page, right after the environment activation and before the network figure — clearly unintended (every tutorial through 10 includes it only at the end). The same duplicate exists in `tutorials/tutorial-11-distancing.qmd` (line ~14); fix both.
- **"the depicted 'Golden Line' on the left"** (line ~18): the figure is *above* the text in the rendered tutorial, not to the left — the phrase was inherited from a two-column slide layout. Say "the depicted 'Golden Line'".
- **Missing alt text** on the main network figure (line ~16); the other images (lines ~73, ~77, ~119) at least carry captions.
- **Bonus task sanity check passes** (lines ~358–407): without regulation the peak genuinely overloads the network — e.g., arc (B,T) carries about 100 passengers/min in the peak minute (60 entering at B plus 40 arriving from A) and arc (T,E) about 109/min, both above the 90 capacity — so "experiment to find feasible values" is a meaningful exercise. Consider adding a small network sketch though: stations T, E, F and the two-line topology exist only inside the code block.
- **No solution for the bonus** — appropriate, since it is graded (0.5 points).

## 4. Pedagogy & polish

- **Typo** (line ~336): "If you encounter any difficulties ad cannot solve" → "and cannot solve".
- **"constraint" as a verb** (line ~87): "You just need to constraint the fluctuations" → "constrain".
- **"shortly explain"** (lines ~28, ~123): Germanism; use "briefly explain".
- **Terminology drift**: "Bidirectional" (task 3 heading, figure caption) vs "two-directional" (task 4, twice) vs "one-directional" — pick one pair (bidirectional/unidirectional or two-/one-directional) and use it throughout.
- **Redundant callout** (line ~177): "This task can be a bit tricky, as it is a bit of a challenge." — circular; one clause suffices.
- **Grammar in solutions**: "That does really depend on the actual demand" (line ~157) → "That really depends on the actual demand"; "In case we acknowledge, that the travel time on some paths is identical" (line ~133) → "If we account for the fact that some paths have identical travel times".
- **Phrasing** (line ~22): "max. 100 passengers per minute of each arc" → "on each arc"; "the arcs cannot handle each input" → "the arcs cannot handle the full inflow".
- **Hyphenation** (line ~149): "crowd-accidents" → "crowd accidents".
