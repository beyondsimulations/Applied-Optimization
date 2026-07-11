# Review: lecture-08-districting.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, content robustness, writing polish

## Summary

A strong applied lecture: the stakeholder motivation → territory design framework → step-by-step p-median build-up → contiguity/compactness extension is a coherent arc, the "Connection to Facility Location" slide places the model in the wider literature nicely, and the case-study result maps give the model a real payoff. The main weakness is a genuine model error: the slides repeatedly promise an *incident-weighted* objective, but no incident parameter is ever defined and the objective sums unweighted driving times. Several explanation callouts for the contiguity constraints also state the assignment direction backwards.

## 1. High-impact teaching improvements

- **Explain the `X_{i,i}` self-assignment trick before using it.** The department-count constraint `Σ X_{i,i} = p` (line ~632) suddenly uses the diagonal variable with no explanation that "department `i` is open ⟺ `X_{i,i} = 1`", i.e. an open department always serves its own BA. This is the key modeling idea that lets the p-median avoid a separate `Y_i` open/close variable, and it deserves its own fragment or callout ("Question: what does `X_{i,i}` mean?"). Without it, students see an unmotivated double index. Also worth surfacing: many textbook p-median formulations *do* use a separate `Y_i` — one sentence comparing the two would immunize students against confusion when they read the literature.
- **Answer the "Model Characteristics" questions** (lines ~887–896). Four good questions (linear? variable domains? solvable quickly? isolated districts prevented?) are posed and never resolved — the incremental list *is* the questions. Every other question slide in the deck reveals its answer in fragments; do the same here (linear constraints + binary variables → MIP; `|I|·|J|` binaries; the plain p-median does *not* prevent isolated districts, which is exactly why the contiguity section follows).
- **Close the loop on workload balance.** Stakeholders' "manageable workloads" (line ~61) and "Equal workload distribution" (line ~270) motivate the problem, and the results slide claims "Better workload distribution" (line ~996) — yet nothing in the model touches workload. Either add a slide noting the full model in the paper contains balancing constraints, or pose it as an extension question ("How would you add a workload constraint to this model?"). As written, the results claim looks unsupported by the model just built.
- **Add a learning-objectives slide** at the start ("After today you can: model districting as a p-median problem, explain contiguity vs. compactness, …"), matching the pattern suggested for the other lectures.
- **Walk through Examples A/B** (lines ~809–823): the four auto-animated images carry the entire intuition for `N_{i,j}` but have no accompanying text at all. One caption line per slide ("BA j, its neighbors A_j, and the closer subset N_{i,j} highlighted…") would make the slides self-contained for students reviewing at home.

## 2. Model & notation issues

- **Objective is not incident-weighted, contradicting the slides** (lines ~514–540). "Key Model Components" lists "Forecasted incident data" (line ~372), the objective build-up says "Consider frequency of incidents in each BA" (line ~516), and the callout claims "Weighted by **incident frequency**" (line ~537) — but the parameters slide (line ~447) defines only `p` and `t_{i,j}`, and the objective is `min Σ Σ t_{i,j} × X_{i,j}` with no weight. Fix: define a parameter (e.g., `a_j` = forecasted number of incidents in BA `j`) and write `min Σ Σ a_j · t_{i,j} · X_{i,j}`, propagating to the full p-median slide (line ~677). Alternatively, redefine `t_{i,j}` as "incident-weighted expected driving time" — but then the "weighted by" bullets must say the weighting is baked into the parameter.
- **Contiguity callouts state the assignment direction backwards.** Line ~838: "At least **one department** has to be assigned to a BA that is adjacent to BA j and closer to department i" — departments are not assigned to BAs. The constraint says: if `j` is assigned to `i`, at least one BA in `N_{i,j}` must *also* be assigned to `i`. Same inversion at line ~857 ("one department has to be assigned to two BAs"); should read "at least **two BAs** adjacent to j and closer to i must also be assigned to department i".
- **Strict inequality in `N_{i,j}` creates a tie edge case** (line ~798). On a hexagonal grid, `e_{i,v} < e_{i,j}` can leave `N_{i,j}` empty for symmetric positions where all closer-or-equal neighbors are exactly equidistant; then `X_{i,j} ≤ 0` silently *forbids* the assignment rather than enforcing contiguity. Worth a one-line footnote on tie-breaking (or `≤` with `v ≠ j`), since students implementing this in the tutorial will hit it.
- **`t_{i,j}` described inconsistently:** "Driving times between basic areas" (line ~371) vs. the parameter definition "between `i` and `j`" (line ~448), i.e. between *department locations* and BAs. Align the wording.
- **`p` mislabeled:** the "We need the following sets and variables" callout (lines ~615–623) lists the parameter `p` (and doesn't say "parameters"); the same callout lists `𝒥` although the constraint `Σ X_{i,i} = p` doesn't use `j`. Retitle "sets, parameters and variables" and drop `𝒥`.
- **"Don't include fixed costs (handled by constraints)"** (line ~517) is misleading — fixed costs are not handled anywhere; rather, the *number* of departments is fixed by the `p` constraint, which makes opening costs irrelevant to the comparison. Reword.
- **Small notation nits:** "Sets of BAs adjacent to BA j" → "Set of BAs…" (line ~793); "euclidian" → "Euclidean" and lowercase "euclidean" vs. capitalized usage at lines ~767/792 (line ~805); "district centres" (line ~447) is the lone British spelling in an otherwise American-English deck — use "centers" (or just "departments", the term used everywhere else).

## 3. Content & robustness

- **Empty slide:** "Literature II" (line ~1061) is a header with no content — renders as a blank slide.
- **Undefined acronym:** "CFS" (line ~167) is never expanded. Say "calls for service (CFS)" on first use.
- **External dependencies:** the title slide background uses a fragile Unsplash `download?...&force=true` URL (line ~13), and four more Unsplash hotlinks appear at lines ~37, ~81, ~927, ~952. Move to images.beyondsimulations.com like the other assets, so the deck works offline in the lecture hall.
- **Dangling sentence:** "Reallocate **only part** of the police department's" (line ~324) — the noun is missing ("…department's *resources*" or "*personnel*").
- **"1.8 mio incidents"** (line ~933): "mio" is a German abbreviation; use "1.8 million".

## 4. Pedagogy & polish

- **"Compactness: 'Round'"** (line ~280) is too terse to be a bullet on its own; expand to "'Round', undistorted shapes" (the Kalcsics quote used later, line ~752).
- **Comparison slide captions vs. claim** (lines ~861–873): the three figures are captioned "One/Two/Up to three departments" but the slide's point is contiguity ("always a path back"); a sentence connecting the pictures to the constraint (which figure violates what?) would make the payoff explicit.
- **Typo:** "todays lecture" → "today's lecture" (line ~1040).
- **Accessibility:** none of the ~15 images have alt text — add short descriptions for the website render.
