# Review: lecture-09-safety.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, content robustness, writing polish

## Summary

A strong applied lecture: the real-world Hajj case is compelling, the staged build-up (goals → sets → subsets → variables → objective → constraints) is disciplined, and the recurring "Question:" fragments keep students engaged. The main weaknesses are a story/model mismatch (four ritual days are promised but the model schedules each group exactly once), a broken quantifier notation in the fluctuation constraints, a set-domain inconsistency in the linking constraint, and several "tricky" modeling ideas whose resolution is never actually explained on the slides.

## 1. High-impact teaching improvements

- **Reconcile the four-day story with the one-shot model.** The narrative says the ritual is repeated "on four consecutive days" (line ~52) and that the model should "assign one of the feasible paths to a camp on all four ritual days" (line ~230), and "Time preference satisfaction" says a slot is "assigned per ritual day to each pilgrim group" (line ~257). But the linking constraint (line ~589) gives each group exactly **one** stoning slot over the entire horizon $\mathcal{T}$. Presumably scheduling groups are day-specific (so $\mathcal{T}_s$ restricts a group to its day) or the model is solved per day — but the deck never says. One sentence on the sets slide ("a scheduling group is a camp-group on one specific day") would close the gap; as written, attentive students will spot the contradiction.
- **Resolve the "very tricky" capacity constraint — the trick is never explained.** The slide (line ~608) promises the constraint "also ensur[es] that the utilization does not exceed the capacity limit", but no capacity inequality ever appears. The enforcement is hidden in the *combination* of the equality (line ~638) with the variable bound $U_{r,t} \leq 1$ (line ~740). This is an elegant modeling idiom worth making explicit: add a fragment "Where is the capacity constraint? — Hidden in $U_{r,t} \leq 1$: the equality forces flow $= b_{r,t} U_{r,t} \leq b_{r,t}$."
- **Show how the 5 "Key Constraints" map to the 4 formulated ones.** The list (lines ~534–538) promises "each group one path" (item 1) and "each group one time slot" (item 3), but neither gets its own constraint. Both follow from summing the linking constraint over $p \in \mathcal{P}_c$: $\sum_p \sum_t X_{s,t,p} = \sum_p Y_{c,p} = 1$. Deriving this on a slide is a genuine teaching moment (constraints implying other constraints) and prevents students from hunting for two "missing" constraints.
- **Add a learning-objectives slide** at the start, as in the style used elsewhere in the course ("After today you can: structure a scheduling problem, use subsets to shrink models, linearize preferences via precomputed penalties, ...").
- **Discuss infeasibility as a safety feature.** Capacities are hard ($U \leq 1$) and every group must be scheduled — so the model is infeasible if demand exceeds bottleneck capacity. The "Model Assumptions" slide (line ~761) asks about "likely issues" but this specific, important behavior (the model refuses to produce an unsafe plan) deserves an explicit fragment.

## 2. Model & notation issues

- **Broken quantifier in the fluctuation constraints** (lines ~694, ~698, repeated ~727–728): $\forall (r,t) \in \left|\mathcal{R}\times \mathcal{T}\right|$ — the cardinality bars turn the set into a number. Should be $\forall r \in \mathcal{R}, t \in \mathcal{T}: t > 1$. Note the added $t > 1$: as written the constraint also ranges over the first period, where $U_{r,t-1} = U_{r,0}$ is undefined.
- **Domain mismatch in the linking constraint** (line ~589): it iterates $p \in \mathcal{P}_c$ for each $s \in \mathcal{S}_c$, but $X_{s,t,p}$ is only declared for $p \in \mathcal{P}_s$ (line ~738). If $\mathcal{P}_s \subsetneq \mathcal{P}_c$ for some group, the constraint references undefined variables — and worse, if camp $c$ is assigned a path some group in it cannot use, the model is infeasible. Either state $\mathcal{P}_s = \mathcal{P}_c$ for all $s \in \mathcal{S}_c$, or index the constraint over $p \in \mathcal{P}_s$ and require $Y_{c,p} = 0$ for $p \notin \mathcal{P}_s$.
- **Objective sets inconsistent between slides:** the build-up version (line ~502) sums over full $\mathcal{T}$ and $\mathcal{P}$, the summary model (line ~713) over $\mathcal{T}_s$ and $P_s$. Only the latter matches the variable declaration; align the first version (this also reinforces the subset lesson from lines ~336–350).
- **Out-of-range time index unhandled:** in the utilization constraint (line ~638), $X_{s,t-a_{p,r},p}$ can index a period outside $\mathcal{T}$ (or outside $\mathcal{T}_s$, where $X$ is not declared) for early/late $t$. State the convention (terms with $t - a_{p,r} \notin \mathcal{T}_s$ are dropped/zero).
- **$\times$ vs $\cdot$ inconsistency within the same model:** objective uses $\times$ (lines ~502, ~713), Scheduling Problem II uses $\cdot$ (line ~726). Pick one ($\cdot$ preferred; $\times$ reads as cross product).
- **Missing calligraphic set markers:** $S_p$ (lines ~638, ~726) and $P_s$ (line ~713) should be $\mathcal{S}_p$ and $\mathcal{P}_s$.
- **$U_{rt}$ vs $U_{r,t}$** within the same lines (lines ~447, ~683): the definition says "$U_{r,t}$ ... with $0 \leq U_{rt} \leq 1$".
- **"minimize" vs "min":** line ~502 uses $\text{minimize}$, line ~713 $\text{min}$ — make consistent.
- **Symbol collision $x$ vs $X$** (line ~224): "Pilgrims departure from a camp at a time $x$" uses lowercase $x$ for a time, colliding visually with the decision variable $X_{s,t,p}$ introduced later. Use $t$.
- **Garbled parameter definition** (line ~362): "$\sigma_r$ - max. relative utilization deviation between $t$ for $r$" — say "maximum change in relative utilization of resource $r$ between consecutive periods".

## 3. Content & robustness

- **Fragile external dependency:** the title slide background is an Unsplash URL (line ~13); all other images are already on images.beyondsimulations.com — move this one too.
- **Empty slide:** "Literature II" (line ~833) is a header with no content and renders as a blank slide.
- **Copy-paste literature text** (line ~831): "to learn more about Julia" — this lecture contains no Julia at all; reword to point at crowd-management/scheduling literature, or at least at @haase2016improving.
- **Transliteration:** "Rhamy-Al-Jamarat" (lines ~46, ~51, ~60) — the standard transliteration is "Ramy al-Jamarat". At minimum drop the "h" in "Rhamy".
- **No code in a code-driven course:** the deck is pure modeling. The wrap-up (line ~815) hands off to the tutorial, which is fine, but the `activate_environment.qmd` include (line ~24) is then dead weight — harmless, but removable if no code chunk exists.

## 4. Pedagogy & polish

- **Grammar:** "We need keep the changes" → "We need to keep" (line ~279); "Constraint the relative utilization" → "Constrain the relative utilization" (line ~538); "Pilgrims departure from a camp" → "Pilgrims depart from a camp" (line ~224); "Path may contain one or more bottlenecks" → "A path may contain" (line ~218); "todays lecture" → "today's lecture" (line ~813).
- **Germanisms:** "Anybody an idea why?" → "Any idea why?" (line ~516); "Only **few million** people are annually allowed" → "only a few million people are allowed annually" (line ~32).
- **Factual nit** (line ~30): the Hajj obligation applies to Muslims who are physically *and financially* able ("istita'ah"); consider "Each Muslim who is able should perform Hajj once".
- **Accessibility:** images carry no alt text (the flow-type images at lines ~146–148 have only "1."/"2."/"3." captions); add short descriptions for the website render.
- **Nice touches worth keeping:** the "Let's pause!" checkpoint (line ~655), the explicit framing of variables 2 and 3 as "more a constraint" (lines ~400, ~428), and the linearity discussion of precomputed penalties (lines ~505–521) are all genuinely good.
