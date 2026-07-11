# Review: lecture-07-routing.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A strong deck: the two-stage discovery of the decision variable (three-index first, then the two-index simplification with its precondition), the step-by-step MTZ walkthrough with pictures, and the honest "our exact model fails on the real instance, here is why, here is what practitioners do instead" arc are excellent teaching. The main weaknesses are an index error in the MTZ explanation slides ($d_i$ where it must be $d_j$, contradicting the correct formula two slides earlier), a phantom set $\mathcal{I}$ used five times but never defined, and a time-limit formulation that silently ignores the travel time on the depot legs of each tour.

## 1. High-impact teaching improvements

- **Close the loop on the 4-node code example** (line ~301). The JuMP snippet builds only the objective and is never solved, so students see syntax but no payoff. Add the degree and depot constraints for $|\mathcal{K}|=1$ and show the result: the optimal tour is depot → A → C → B → depot (or its reverse) with cost 10 + 8 + 5 + 15 = 38, versus 47 for depot → A → B → C → depot and 55 for depot → B → A → C → depot. One extra slide turns the syntax demo into a first solved VRP.
- **Make the subtour-infeasibility walkthrough airtight** (lines ~604–654). The narration starts the subtour at $H$ but then sets $U_C = 1$, which already requires $U_H \leq 0 < d_H$ — the chosen numbers violate the constraints before the punchline. The clean argument: sum the MTZ constraints around the cycle $H \to C \to I \to H$; the $U$ terms cancel and you get $0 \geq 3$, a contradiction, so *no* assignment of $U$ values can exist. This is stronger than showing one failing assignment and takes the same number of slides.
- **Add a learning-objectives slide** at the start ("After today you can: model a CVRP as a MIP, explain MTZ subtour elimination, explain why heuristics are needed…"), matching the checklist style used elsewhere in the course.
- **Say why exactly $|\mathcal{K}|$ tours, not at most** (line ~427). The depot constraints force all vehicles to be used, so with generous capacity the model can be forced into more (and worse) tours than necessary. A one-line fragment question ("What happens if 3 vehicles would suffice but we own 5?") turns a hidden modeling choice into a discussion point and motivates the $\leq$ variant.

## 2. Model & notation issues

- **Wrong index in the MTZ explanation** (lines ~574–575 and ~583): "Binding as $U_j$ has to be at least as large as $d_i + U_i$" — it must be $d_j + U_i$ (the demand of the node being *entered*), as the slide at line ~562 correctly states ($U_j \geq d_j + U_i$). The error appears twice on the "Connection in more detail" slide and directly contradicts the earlier slide; likewise "fullfiled if the demand of $i$ is added" should be the demand of $j$.
- **Undefined set $\mathcal{I}$** (lines ~465, ~483, ~526, ~680, ~689): $U_i$ and $T_i$ are declared "with $i \in \mathcal{I}$", but the node set is $\mathcal{V}$ and $\mathcal{I}$ is never defined. Should be $i \in \mathcal{V} \setminus \{0\}$ everywhere (the variables exist only for customers, matching their domain constraints).
- **Time limit excludes the depot legs** (lines ~698, ~704): the time-MTZ constraint holds only for $i,j \in \mathcal{V} \setminus \{0\}$, and the domain is $0 \leq T_i \leq t$, so travel from the depot to the first customer and from the last customer back to the depot is never counted — a tour can exceed the 8-hour limit by up to $c_{0,first} + c_{last,0}$. The standard fix (in the cited @KARA2004793 line of work) is to tighten the domain to $c_{0,i} \leq T_i \leq t - c_{i,0}$. At minimum, state the simplification explicitly; for the Schleswig-Holstein case study with legally capped 8-hour tours this is not a cosmetic detail.
- **Misleading quantifier** (lines ~388, ~392, ~737, ~741): in $\sum_{i \in \mathcal{V}} X_{i,j} = 1 \;\; \forall j \in \mathcal{V} \setminus \{0\}, i \neq j$, the condition $i \neq j$ sits in the $\forall$ clause although $i$ is the summation index. Write $\sum_{i \in \mathcal{V}, i \neq j} X_{i,j} = 1$ (or sum over $(i,j) \in \mathcal{A}$).
- **Variable-domain slide includes self-loops** (line ~805): $X_{i,j} \in \{0,1\} \; \forall i,j \in \mathcal{V}$ declares $X_{i,i}$, which does not exist ($\mathcal{A}$ excludes them, as does the code). Use $\forall (i,j) \in \mathcal{A}$.
- **$U_i$ and $T_i$ continuity never stated:** the deck stresses that $X$ is binary (line ~216) but never says the MTZ variables are continuous — worth one sentence, since the "Model Characteristics" slide (line ~828) asks about variable domains.
- **Attribution nuance** (lines ~461–462): "Miller-Tucker-Zemlin (MTZ) Constraints — Formulation by @KARA2004793" reads as if Kara et al. invented MTZ. MTZ is from 1960 (for the TSP); Kara/Laporte/Bektaş (2004) adapted/lifted it for the CVRP. One clause fixes it: "MTZ constraints (1960), here in the CVRP form of @KARA2004793".
- **Gap definition vs. solver convention** (line ~991): the slide defines gap as (Best − LB)/LB, while HiGHS and most MIP solvers report (Best − LB)/Best. The stated "40% worse than optimal" interpretation is consistent with the slide's own definition, but students comparing against solver logs will see different numbers — a one-line footnote would prevent confusion.

## 3. Content & robustness

- **Empty slide:** "Literature II" (line ~1161) is a header with no content — renders as a blank slide.
- **Stray `---` slide break** (line ~893) between "Real-World Complications" and "Extensions of the CVRP" can produce an empty untitled slide in revealjs; the following `##` header already starts a new slide, so the rule is redundant.
- **External dependencies:** two Unsplash background URLs (lines ~13, ~910) are slow and can break offline in the lecture hall; the content images are already self-hosted on images.beyondsimulations.com — move these two as well.
- **Broken bold** (line ~661): `**Only depot as "reset" **` — the space before the closing `**` prevents bold rendering in Pandoc.
- **Inconsistent div fences:** `::: {.columns}` opened with three colons is closed with `::::` (lines ~865/885), while another block opens with `::::` (line ~1104). Pandoc tolerates it, but pick one convention.
- **Unverifiable case-study numbers** (lines ~1090–1092): "~20% distance reduction", "12–15 tonnes CO₂/year" — fine if these come from the actual project, but consider adding a citation or "in our project" attribution. The factorial table (lines ~975–980) checks out: 10! = 3.63M, 15! ≈ 1.31 × 10¹², 20! ≈ 2.43 × 10¹⁸, 50! ≈ 3.04 × 10⁶⁴.
- Citations `@KARA2004793` and `@Vidal_2022` both exist in `AppliedBib.bib`, and the `activate_environment.qmd` include resolves — no broken references found.

## 4. Pedagogy & polish

- **Germanisms:** "Anybody an idea what a central library is?" (line ~17) and "Anybody an idea?" (line ~674) → "Does anyone have an idea…"; "For delivery, central has several employees and cars" (line ~35) → "the central library has".
- **Word-order/grammar:** "Why this might make the problem difficult?" (line ~222) → "Why might this make the problem difficult?"; "Connection in the other direction wouldn't work as well" (line ~660) → "wouldn't work either" ("as well" says the opposite); "We have already seen that a problem can be NP-hard" (line ~961) is vague → "We have already encountered NP-hard problems" or name which lecture.
- **Typos:** "fullfiled" → "fulfilled" (line ~575); "todays lecture" → "today's lecture" (line ~1140); "Depot Entry/ Exit" and "Capacity/ subtour" have a stray space after the slash (lines ~403, ~425, ~768).
- **Mixed indexing style in code callout** (line ~317): `c[i,j]` next to `X[(i,j)]` in the same expression works (Dict multi-index sugar) but looks inconsistent to beginners; either `c[(i,j)]` or a brief note on why both forms work.
- **Notation nit:** $X_{ij}$ (lines ~540, ~558, ~583) vs. $X_{i,j}$ (everywhere else) — standardize on the comma form; `\times` is used consistently, though `\cdot` would avoid cross-product connotations.
- **Accessibility:** all nine images lack alt text — add short descriptions for the website render.
