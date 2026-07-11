# Review: tutorial-09-safety.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A strong capstone-style tutorial: withholding the code draft is a deliberate and well-signposted step up in difficulty, the "simplify the lecture model" task is an excellent modelling exercise, and the instance data is genuinely well designed — preferences cluster exactly where the lecture's motivation says they do, so the capacity constraint actually binds. The main weaknesses are sloppy set notation in the challenge description, a broken callout that hides the most important hint, and a results section that never asks students to interpret what they plot.

## 1. High-impact teaching improvements

- **Surface the preference clustering — it's the whole point of the lecture.** Summing group sizes at each group's cheapest period gives preferred-period loads of t1: 11,000 (g4, g12, g15), t2: 16,000 (g1, g8, g10, g14), t3: 6,000, t4: 4,000, t5: 16,000 (g6, g7, g11, g13), t6: 0 — against a capacity of 10,000. This is precisely the "clustered time preferences → overcrowding" story from lecture 9, but the tutorial never points at it. Add a question in Task 1 or the analysis section: "Sum the group sizes by preferred period. Where do preferences cluster, and what would happen without the model?"
- **Make the plot interpretive** (line ~113–120). "Plot the utilization" has no payoff question. Add: "Does the capacity bind in any period? Where does the fluctuation limit σ = 0.3 become active? Which groups were pushed away from their preferred period?" Otherwise students plot a bar chart and move on.
- **Give a data-loading hint** (line ~70–75). Both CSVs have an unnamed first column holding the group labels (`g1`–`g15`), and `penalty.csv` is a group × period matrix. Since no draft code is provided and the audience is programming novices, one sentence ("the first column contains the group names — you may want to drop it or use it as row labels") would prevent the most common stumble without giving anything away.
- The "≈ 7" check hint (line ~108) is good practice and plausible: the unconstrained lower bound (each group at its cheapest period) is 3.37, and the binding capacities at t1/t2/t5 force displacement well above that. Consider stating the exact optimum once known, as "approximately 7" leaves students unsure whether 7.4 means success or a bug.

## 2. Model & notation issues

- **`∈` misused for set definition** (lines ~24–26): "$\mathcal{S} \in \{g1,g2,...,g15\}$", "$\mathcal{T} \in \{t1,...,t6\}$", "$\mathcal{C} \in \{A,B\}$", "$\mathcal{P} \in \{A-S-A,B-S-B\}$" — a set is not an element of its own listing. All four should use `=`, e.g. $\mathcal{S} = \{g_1,\dots,g_{15}\}$, or "groups $s \in \mathcal{S}$".
- **Set symbol used for a single element** (line ~26): "both paths have only one resource $\mathcal{R}$, the stoning of the devil" — $\mathcal{R}$ is the resource *set*; say "one resource $r \in \mathcal{R}$".
- **Parameter symbol for group size is missing** (lines ~30 and ~66): "the number of pilgrims per group $s$" reads as if $s$ *is* the number of pilgrims, but $s$ is the group index and the lecture calls this parameter $n_s$. Write "the number of pilgrims per group, $n_s$," in both places — students must map the CSV columns to lecture symbols themselves.
- **$\sigma$ vs $\sigma_r$** (line ~30): the lecture defines $\sigma_r$ per resource; here it appears bare. Fine given the single resource, but "(i.e. $\sigma_r$ from the lecture)" would make the simplification explicit rather than silent.
- **Path names unexplained** (line ~26): "A-S-A" and "B-S-B" are never decoded. One clause — "(camp A → stoning site → camp A)" — makes the notation self-explanatory.
- Instance sanity checks (verified): 15 groups and 6 periods match both CSVs; total 53,000 pilgrims vs 6 × 10,000 total capacity, so the instance is feasible, also under σ = 0.3 (e.g. loads 10-9-8-9-8-9 thousand satisfy all bounds). The penalty data is a clean linear penalty $f_{s,t} = |t - \tau_s|$ around a fractional preferred time, matching the lecture's "linear penalty function" option. No issues.

## 3. Content & robustness

- **Broken callout** (line ~42): `{.callout-attention}` is not a valid Quarto callout type (valid: note, tip, warning, caution, important). Verified in the rendered site: it produces a bare unstyled `<div>` — the key hint "the model can be simplified…" loses its visual emphasis entirely. Use `{.callout-important}` or `{.callout-warning}`.
- The `code-links` entry `tutorial-09-safety.jl` (line ~7) does not exist in the repo but is generated at build time by `convert_pypercent.py`, consistent with the other tutorials — no issue, noted for completeness.

## 4. Pedagogy & polish

- **Missing comma creates a garden-path sentence** (line ~30): "To constrain the fluctuation of the resource utilization $\sigma$ was set to 0.3" momentarily reads as "the utilization σ". Write "To constrain the fluctuation of the resource utilization, $\sigma$ was set to 0.3, while…".
- "Note, that the number of pilgrims…" (line ~66) → "Note that…" (no comma).
- "The capacity of the stoning is 10,000 pilgrims per period" (line ~28) → "the capacity of the stoning site/ritual".
- "to sketch the problem, and get a better understanding" (line ~51) → drop the comma, or "…to sketch the problem and build intuition."
- The two prose-in-comment-block cells (`#= =#`, lines ~55 and ~125) are a nice convention for reflection answers; consider one line of instruction ("write your answer inside the comment block") the first time it appears, since this is the first tutorial using it for free-text answers.
