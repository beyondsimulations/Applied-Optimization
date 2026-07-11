# Review: lecture-06-ordersplit.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A strong lecture with a clear dramatic arc: exact model → "3100 seconds for 10 SKUs" → heuristic reformulation → QMKP → solver limits → CHI heuristic → real case study. The question–fragment rhythm and the "Model Characteristics" discussion slide are good teaching. Main weaknesses: the worked Julia example never shows or interprets its optimal solution beyond printing raw output, the transactional-data example from the slides is abandoned when the code switches to an unrelated 3×3 Q matrix, and the summation notation repeatedly uses the set symbol $\mathcal{I}$ where the cardinality $|\mathcal{I}|$ is meant.

## 1. High-impact teaching improvements

- **Reuse the running example in the code.** The slides carefully build a 4-SKU transactional example (line ~164) and compute its Q via `T' * T` (line ~269) — then the model code (line ~451) silently switches to an unrelated 3×3 matrix `Q = [2 1 2; 1 2 1; 2 1 2]` for Smartphone/Socks/Charger. Students lose the thread. Either carry the A–D example through (its Q off-diagonals are AB=3, AC=2, AD=4, BC=2, BD=0, CD=1), or explicitly say "new, smaller example" and connect the two.
- **Interpret the optimal solution.** The solve slide (line ~599) prints `objective_value` and `value.(X)` and asks "What does this value tell us?" but never answers. Compute it on the slide: total capacity (2+1) equals the number of SKUs, so every SKU is placed exactly once, and the only choice is which pair shares Hamburg — Smartphone+Charger with q=2 wins, objective 2. That makes the follow-up characteristics question ("Do we know the split-orders based on the objective value?") much more concrete: the objective counts co-located pair weights, not avoided splits.
- **Surface the duplicate-allocation subtlety.** The single-allocation constraint is `≥ 1` (line ~508), and the objective counts a pair once *per warehouse* it shares. With slack capacity the model will therefore duplicate SKUs to double-count pairs, inflating the objective without necessarily reflecting fewer splits. The assumptions slide (line ~664) asks "Problem with allocating SKUs to multiple warehouses?" — this is exactly the answer; state it (or make the toy example have slack capacity so students can discover it).
- **Show (a sketch of) the Version-1 model.** Version 1 defines $X_{i,k}$ and $Y_{m,i,k}$ (lines ~205–206) but the integer model itself is never shown before being dismissed as too slow (line ~218). Even one slide with the objective ("minimize number of warehouses touched per order") would let students see *why* the $|\mathcal{M}| \times |\mathcal{I}| \times |\mathcal{K}|$ variable count explodes and appreciate the Version-2 trick.
- **Add a learning-objectives slide** at the start, as in other lectures.

## 2. Model & notation issues

- **Set symbol used as a number** in the objective's summation limits: $\sum_{i=2}^{\mathcal{I}}$ (lines ~433, ~584) should be $\sum_{i=2}^{|\mathcal{I}|}$; same in the index sets of Q, $i \in \{1,\dots,\mathcal{I}\}$ (lines ~293, ~344) should use $|\mathcal{I}|$. The sets slides (lines ~143–145) get this right with $|\mathcal{I}|$ — make the rest consistent.
- **MIQCP vs. MIQP:** the model has a quadratic *objective* and only linear constraints, so it is a (binary) MIQP, not an MIQCP (no quadratic constraints). The code comment "SCIP is a non-commercial MIQCP solver" (line ~395) is fine as a solver description, but listing the problem class among "LP, MIP, NLP, QCP, MIQCP" (line ~627) invites students to misclassify it. Say "MIQP/BQP" or note that MIQCP subsumes it.
- **Subscript comma inconsistency:** $X_{i,k}$ in variable definitions (lines ~205, ~378) vs. $X_{ik}$ in the objective and constraints (lines ~433, ~508, ~560, ~584–593); likewise $q_{i,j}$ (line ~369) vs. $q_{ij}$ (line ~293 ff.), and $t_{m,i}$ (line ~155) vs. $q_{ij}$. Pick one convention.
- **Symbol collision on T:** $\boldsymbol{T}^T$ (line ~293) uses T both as the matrix name and the transpose superscript. Use $\boldsymbol{T}^\top$ or rename the matrix.
- **`\times` vs `\cdot` mixed:** the Q definition uses $\cdot$ (line ~293) while the objective uses $\times$ (lines ~433, ~584).
- **Solver comparison table is confusing** (line ~644): at 1,000 SKUs SCIP shows "1,011s (18%)" vs. Gurobi "~200s (2%)" — per the footnote the percentage is the share of instances solved within an hour, which would mean the open-source solver solves *nine times more* instances than Gurobi. If the numbers are correct they need a comment; if the percentages mean something else (e.g., optimality gap), fix the footnote. Also the 100-SKU row has times but no percentage, and Gurobi (~400s) being slower than SCIP (118s) at 100 SKUs deserves a remark.
- **Capacity units unstated:** $c_k$ is "storage space" (line ~154) but the constraint counts SKUs, i.e., capacity in *number of SKUs* under a uniform-size assumption. The limitations slide admits this later (line ~675); one clause at the definition would prevent confusion.

## 3. Content & robustness

- **`Pkg.add("SCIP")` inside the lecture code** (line ~394): installing a package at render time is slow and fragile, and it bypasses `Project.toml`. Add SCIP to the project environment and keep only `using JuMP, SCIP` on the slide.
- **External dependencies:** three Unsplash background/inline images (lines ~13, ~45, ~60) and a hotlinked allaboutlean.com figure (line ~640) can break or stall offline; move to images.beyondsimulations.com like the other assets.
- **Cross-docking mis-defined** (line ~113): "Ship directly from supplier to customer" describes drop-shipping. Cross-docking is transferring goods from inbound to outbound transport at a dock with little or no storage.
- **"2026: 220–262 billion parcels (forecast)"** (line ~37): it is now mid-2026; consider citing a more recent actual figure or rephrasing ("was forecast at").
- **"vs. retailer: 6.95% split ratio"** (line ~828): the three lines above report percentage *reductions*, this one a split *ratio* — the mixed metrics read as a fourth reduction figure. Clarify (e.g., "retailer's status quo: 6.95% of orders split; CHI reduces these splits by 82.25%").
- **Literature section is thin** (line ~857): only a pointer to the general Julia literature list, though the lecture leans on @Catalan2012, @Zhu2021, @Hiley2006, @vlcek_optimizing_2024 — a short "references for this lecture" list would help students find the papers.

## 4. Pedagogy & polish

- **Typos/grammar:** "loose customers" → "lose customers" (~29); "shifting **" has a stray space inside the bold marker and may render literal asterisks (~28); "Anybody an idea what this could mean?" → "Does anyone have an idea…" (~216); "Computation times scales exponentially" → "Computation time scales" (~223); "Number of customer orders necessary for 'stable' results have to be higher in the order of" is garbled — e.g., "the number of customer orders needed for stable results is one order of magnitude higher: 100,000–10,000,000" (~212); "more robust as open source solvers" → "than open-source solvers" (~635); "todays lecture" → "today's lecture" (~840).
- **English variant inconsistency:** "Optimisation" twice in the conclusion (~834–835) vs. "Optimization"/"Minimization" everywhere else (title, ~189).
- **Term inconsistency:** "co-appearance" (~115) vs. "coappearance" (everywhere from ~262 on); also footnote label typo `[^graps]` for GRASP (~309) — harmless but worth fixing.
- **Cryptic bullet** (~302): "How often each SKU appeared over all orders **(binary!)**" — spell out what "(binary!)" means: because $t_{m,i}$ is 0/1, the diagonal counts orders containing the SKU, not units sold.
- **Rolling-horizon slide reads as generic advice** (~782) but describes the specific case-study setup ("5-week training window", "weekly updates"); attribute it ("In the case study, we…") so students know these are empirical choices, not universal rules.
- **Accessibility:** none of the images have alt text.
