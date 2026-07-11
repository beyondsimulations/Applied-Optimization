# Review: lecture-11-distancing.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A strong lecture: the hands-on seating exercise before the formalization, the worked underbrace examples of the distancing constraint, and the real VfL Osnabrück payoff (241 seats, 8,435 EUR — the numbers check out: exactly 35 EUR/seat) make this one of the most tangible decks in the course. The distancing-set window itself is mathematically correct and matches all three worked examples. The main weaknesses are a cluster of notation inconsistencies around the column sets ($\mathcal{C}_r$ vs $\mathcal{C}_{g,r}$ vs $\tilde{\mathcal{C}}_{c,g}$, missing tildes and commas), a hands-on exercise whose payoff (optimal score) is never revealed, and the silent disappearance of the horizontal constraint from the full model.

## 1. High-impact teaching improvements

- **Reveal the exercise's optimal solution.** Students spend 5 minutes allocating groups (line ~173) and are asked "What is your total score?" (line ~204), but the lecture never shows the optimal score or an optimal seating plan. A payoff slide — even just "the model finds X points; the best manual solutions usually reach Y" — would close the loop and directly motivate the model that follows. Ideally reuse the same instance when the model is solved in the tutorial.
- **Surface the value-density insight hidden in the group table** (line ~181): groups c and g yield 2.0 points/seat, e yields 1.25, and all others exactly 1.0. Most students will discover greedy-by-density during the exercise; naming it afterwards ("Why did you all grab the c's and g first? And when does greedy fail?") is a cheap, memorable bridge to why we need integer programming at all. Totals worth having ready: 67 points and 53 seats if every group were placed.
- **Explain why the horizontal constraint vanishes from the full model.** The "Necessary Constraints" slide (line ~316) lists four constraints, but the assembled model (line ~602) contains only three. This is actually correct — the vertical constraint with $\tilde{r} \in [r-b, r]$ contains the horizontal one as the special case $\tilde{r} = r$ — but that subsumption is never stated. As written it looks like an accidental omission; one callout ("the vertical constraint includes $\tilde{r}=r$, so it subsumes the horizontal one") turns a confusion into an insight.
- **Explain why $\mathcal{C}_{g,r}$ depends on $g$.** The set is introduced as "Available seats of row $r$ for group $g$" (line ~219), but it is really the set of *feasible starting positions*: seat $c$ qualifies only if $d_g$ contiguous unblocked seats exist from $c$ onward (group must fit within the row and avoid obstacles). This is why one binary per group suffices — the cleverest idea in the lecture (callout line ~250) — yet the $g$-dependence is never justified.
- **Add a learning-objectives slide** at the start, as in other lectures ("After today you will be able to: model 2D packing with position-indexed binaries, formulate spacing via covering constraints, …").

## 2. Model & notation issues

- **$\mathcal{C}_r$ vs $\mathcal{C}_{g,r}$ inconsistency, and $\mathcal{C}_r$ is never defined.** The sets slide defines $\mathcal{C}_{g,r}$ (line ~219), but the very next callout refers to "$\mathcal{C}_r$" (line ~223), and the full model (lines ~603–611) uses $\mathcal{C}_r$ throughout (objective, both packing constraints, variable domain) while the earlier objective slide (line ~306) and the per-row constraint (line ~386) use $\mathcal{C}_{g,r}$. Pick one symbol; $\mathcal{C}_{g,r}$ is the one that carries the fit-and-obstacle semantics.
- **Missing tilde** (line ~459): the callout says the constraint "is based on the set $\mathcal{C}_{c,g}$ not defined yet" — the constraint above it (line ~454) uses $\tilde{\mathcal{C}}_{c,g}$. Without the tilde this collides with the (differently ordered) $\mathcal{C}_{g,r}$.
- **Missing tilde in the vertical constraint** (line ~554): it sums over $\tilde{r} \in \mathcal{R}_r$, but the set defined two slides later (line ~564) is $\tilde{\mathcal{R}}_r$. Also on line ~554: $\tilde{\mathcal{C}}_{cg}$ drops the comma used everywhere else ($\tilde{\mathcal{C}}_{c,g}$), and $X_{g\tilde{r}\tilde{c}}$ drops both commas of the $X_{g,r,c}$ convention. The final model (line ~610) gets all of this right — align the derivation slides with it.
- **Missing $\forall$** (line ~386): the per-row constraint is quantified "$\quad r \in \mathcal{R}$" without the $\forall$ used in every other constraint.
- **Distancing sums range over undefined variables.** $\tilde{\mathcal{C}}_{c,g}$ is defined over all of $\mathcal{C}$ (line ~464), but $X_{g,r,c}$ is only declared for $c \in \mathcal{C}_r$ (line ~611). The third constraint therefore references variables that don't exist for blocked/unfittable positions. Standard fix: intersect, i.e. $\tilde{\mathcal{C}}_{c,g} = \{\tilde{c} \in \mathcal{C}_{g,r} \mid c - d_g + 1 - h \leq \tilde{c} \leq c\}$, or state that infeasible $X$ are fixed to 0.
- **Subscript-order inconsistency:** the column sets are indexed $\mathcal{C}_{g,r}$ (group first) but the distancing set $\tilde{\mathcal{C}}_{c,g}$ (column first). Harmless individually, confusing together.
- **What is correct (worth saying explicitly):** I verified the window $c - d_g + 1 - h \leq \tilde{c} \leq c$ against all three worked examples — for $d_g=2$, $h=1$, $c=8$ it yields seats 6–8 and for $d_g=3$ seats 5–8, exactly as the underbraces show (lines ~484, ~490, ~506). The rectangle logic also correctly enforces the exercise's diagonal rule for $h=b=1$ in both left- and right-diagonal cases.
- **Model characteristics questions never answered** (lines ~623–628): "Is the model linear? What variable domains?" have no fragment reveal, unlike every other question in the deck. Add the answers (linear; pure binary).

## 3. Content & robustness

- **Three Unsplash background URLs** (lines ~13, ~39, ~134) — same fragility flagged in lecture 1; move to the course image host.
- **Two different image domains:** `images.byndsim.com` (lines ~64, ~71, ~147, ~154) vs `images.beyondsimulations.com` (lines ~414, ~482, ~583, ~646, ~666). If one domain is being retired, half these images will break; standardize.
- **Dead Julia environment include** (line ~20): `activate_environment.qmd` runs a `{julia}` cell (`Pkg.activate`), but this lecture contains no Julia code at all. It forces a Julia kernel dependency and cache churn for nothing — remove it here.
- **"Related Work" slide has no references** (lines ~670–676): "Similar studies have been conducted globally" names venues but cites nothing, and the Literature slide (line ~721) only points to the general Julia list. Add the underlying publication (the model is credited to Dr. Matthes Koch, line ~168 — the actual paper for this VfL Osnabrück case belongs here) and links for the named studies.
- **Case-study numbers are internally consistent** (lines ~651–662): 8,435 EUR / 241 seats = exactly 35 EUR per seat, and +12% implies a baseline of roughly 2,000 distanced seats — plausible; no issue, just verified.

## 4. Pedagogy & polish

- **Wrong span class** (line ~138): `[Question:]{.task}` should be `{.question}` — it renders with the task styling, inconsistent with every other question in the deck.
- **Garbled bullet** (line ~130): "Sell the resulting maximized seating pattern on **market**" — presumably "sell the resulting seating patterns on the market"; the whole strategic example (lines ~128–130) reads roughly and deserves a rewrite ("Design one fixed layout that performs well across demand scenarios, then sell it as a standard product").
- **"work for scenarios"** (line ~128): missing word — "for different/various scenarios".
- **"Adaption" → "Adaptation"** (line ~158 heading).
- **Mid-sentence capital** (line ~156): "Now, Items block space in 2D" → "items".
- **"What is an example for this approach?"** (lines ~94, ~109, ~124): Germanism — "an example of this approach".
- **"you don't have to find it by yourself"** (line ~450) → "on your own"; same sentence, "$\mathcal{C}_{c,g}$ not defined yet in the lecture" → "a set not yet defined in the lecture".
- **"use restroom"** (line ~392) → "use the restroom".
- **"todays lecture"** (line ~701) → "today's lecture" (same typo as lecture 1).
- **Accessibility:** the exercise figure (line ~177), knapsack figures (lines ~147, ~154), and all example screenshots (lines ~414, ~482, ~488, ~494, ~583, ~666) have no alt text; only the two layout images (lines ~64, ~71) have captions.
