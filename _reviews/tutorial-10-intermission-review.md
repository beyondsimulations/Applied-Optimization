# Review: tutorial-10-intermission.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A solid mock exam that mirrors the real exam's three-part structure and complements lecture 10 well (the ice-cream story even continues from the lecture's transportation task — a nice touch). The lot-sizing model in Part I is essentially correct, and Part III's self-executing solution blocks (3.e especially) are a robust pattern. The main weaknesses: the 9-point extension task 1.e has a genuine mismatch between problem text ("each worked hour" is paid) and the sample solution (full shift `s×q` is always paid), and the 1.a problem statement promises "cost of production" that the objective never contains. Several solution write-ups miss small teaching moments the exam setting makes valuable.

## 1. High-impact teaching improvements

- **State the total points and time budget up front** (line ~12). The tasks sum to 60 points (Part I: 30, Part II: 15, Part III: 15), and lecture 10 tells students "each point ≈ 1 minute of work." Add one sentence: "The mock exam has 60 points ≈ 60 minutes" — this lets students rehearse time management, which the lecture itself lists as the top takeaway.
- **Explain the 3.e output, don't just print it** (lines ~514–537). The solution shows only the rendered output. Add a 3–4 line trace: why i=3,4 print "Hello"/"World" again (index shift `i-2`), why i=5,6 fall to `else` before i=7,8 hit the `i > 6 && i <= 8` branch, and — the best distractor in the whole task — why the `i == 9` `break` branch is dead code (the range is `1:8`). Students who got it wrong learn nothing from the bare output.
- **Surface the constant-term insight in 1.e** (line ~179). In the solution objective, `Σₜ s×q = |T|·s·q` is a constant that cannot influence the optimal solution. Saying this explicitly ("we include it for cost completeness, but it doesn't change the optimum") is exactly the kind of understanding the exam wants to test — and it preempts the confusion caused by the ambiguity flagged below.
- **Note the big-M choice in 1.c** (line ~107). The linking constraint uses `M = Σ_τ d_{i,τ}`. One sentence — "any valid upper bound on production works; a tighter one is `min(q/pᵢ, Σ_τ d_{i,τ})`, and tighter is better for solvers" — connects this mock exam directly to the Big-M discussion students are expected to reproduce (compare lecture 10, question 2.e).

## 2. Model & notation issues

- **1.e: problem text and solution disagree on how regular hours are paid** (lines ~156 vs ~179). The text says "each worked hour in a period has a fixed cost per shift hour," implying labor cost proportional to hours actually worked: `s × Σᵢ pᵢ×X_{i,t}` (+ 50% premium on overtime). The solution instead charges the full shift `s×q` in every period regardless of utilization. Both are defensible models, but under the text's literal reading a student writing `Σₜ (s×Σᵢ pᵢX_{i,t} + 0.5×s×Zₜ)` with `Zₜ ≥ Σᵢ pᵢX_{i,t} − q` would be *more* faithful and could be marked wrong. Either reword the problem ("workers are paid for the full shift regardless of how much is produced; overtime hours cost 50% more") or change the solution. Nine points ride on this task.
- **1.a: "cost of production" never appears in the objective** (lines ~30 vs ~75). The problem states the objective is "to minimize the total cost of production and storage," but no per-unit production cost is given, and the solution objective contains only setup (`f×Y`) and storage (`cᵢ×W`) costs. Reword to "minimize the total cost of setups and storage" (or add "production costs consist only of setup costs").
- **1.d: "the solution is not a nonlinear problem"** (line ~144) — should be "the model." Also worth one extra clause naming the class: linear objective and constraints with continuous `X, W` and binary `Y` makes it a mixed-integer *linear* program, so "no" on both counts of the question.
- **Terminology drift "flavor" vs "sort" in 1.a solution** (lines ~42–52): the set is "flavors of ice cream" but `pᵢ` and `cᵢ` are defined for "sort i" and `X` "per sort and period." The problem statement only ever says "flavor" — use it throughout.
- **Underspecified variable/parameter descriptions in 1.a** (lines ~47–52): `d_{i,t}` "ice cream demand per period" omits the flavor index; `W_{i,t}` "quantity stored at end of period" and `Y_{i,t}` "1, if product is set up in period" omit both indices. Since the task explicitly grades notation, the sample solution should model the standard it expects, e.g. "`d_{i,t}`: demand for flavor i in period t (Parameter)."
- **2.b: the listed heuristic advantage describes decomposition, not heuristics in general** (lines ~274–276). "Breaks down the large problem into manageable problems" fits cluster-first-route-second but not, say, nearest-neighbor or savings. Replace with "constructs good solutions quickly without exploring the entire solution space," which holds for all heuristics.
- **Part III math-to-code correspondence checks out.** 3.a's `@variable(model, 0 <= Production[t in 1:T, p in 1:P] <= capacity[t, p])` matches the spec (continuous by default, both bounds); 3.b's code is an exact transcription of `Σ_{f∈F} Y_{f,z} ≤ 1 ∀z ∈ Z`; 3.c's diagnosis (missing `model` argument) is correct; the 3.e output shown is computed at render time and matches a manual trace. No issues found here.

## 3. Content & robustness

- **3.c: the two "fixed" code blocks never execute** (lines ~444–447, ~453–456). With document-level `eval: false`, only blocks carrying `#| eval: true` run — these two don't, so the corrected constraints are never actually verified at render time, while the hidden setup block (lines ~434–439) that defines `X` for them *does* run and is therefore pointless. Add `#| eval: true` to at least one fixed block (they'd both add to the same model harmlessly) so the solution is self-checking like 3.e.
- **Hidden cross-section state dependency in Part III** (lines ~400–405, ~434–439): 3.c's hidden block reuses the `model` created in 3.b's hidden block. This works top-down at render time but breaks if sections are reordered or if a student runs the generated notebook out of order. Creating a fresh `model` in 3.c's setup block costs one line and removes the coupling.
- **Missing `\newpage` after the 3.e solution** (line ~537): every other solution block ends with `\newpage`; harmless as the last task, but inconsistent if tasks are ever appended.
- The cross-reference "your transportation plan from the lecture" (line ~24) correctly matches the ice-cream transportation task in `lectures/lecture-10-intermission.qmd` Part I. No broken references, no external dependencies, no placeholders.

## 4. Pedagogy & polish

- **Garbled sentences in 1.e** (line ~156): "each worked hour in a period has a fixed cost per shift hour" is circular — say "each hour worked costs a fixed wage `s`, identical for all periods." And "more than an additional time of a half a shift length is not allowed" should read "overtime of more than half a shift length per period is not allowed."
- **"Due to the success of the companies"** (line ~156): only one company is involved — "Due to the company's success."
- **Typo "adress"** (line ~264) → "address."
- **"with a 1-3 sentences"** (line ~204) → "in 1–3 sentences."
- **"Note, that ..."** (lines ~35, ~161): drop the German-style comma — "Note that ...". (Same slip exists in the companion lecture.)
- **Inconsistent capitalization "1.f (4 points)"** (line ~200) vs "(6 Points)" etc. everywhere else.
- **"please ask them"** (line ~12): slightly off — "please raise them" or "feel free to ask."
- **"75 %"** (line ~12): pick one spacing convention; the rest of the course writes "75%" (English style, no space).
