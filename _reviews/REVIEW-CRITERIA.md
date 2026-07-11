# Review Criteria for Applied Optimization Course Material

Context: "Applied Optimization" is a University of Hamburg course taught with Quarto (`.qmd`): lectures render as revealjs slides, tutorials as documents/notebooks. Computation uses Julia + JuMP with the HiGHS solver. Students are business/economics students, mostly German, often new to programming. Today's date for staleness checks: 2026-07-07.

Review each assigned file for:

1. **Pedagogy & structure** — flow and motivation; missed teaching moments (insights implicit in the examples that are never surfaced — compute them and check!); missing learning objectives; whether examples show their payoff/solution; pacing; quality of interactive questions.
2. **Model formulation** (where applicable) — objective matches the stated goal; variable domains (continuous / integer / binary) explicitly declared and consistent with the story; constraints complete and necessary; feasibility and boundedness of the example data; big-M / linearization correctness; economic reasoning errors in problem descriptions (e.g., sunk costs).
3. **Math notation** — symbols defined before use; no symbol collisions or reuse with different meanings; consistent index conventions (e.g., `X_{i,j}` vs `X_{ij}`); consistent set notation; consistent capitalization of Minimize/Maximize; `\times` vs `\cdot` consistency; circular or empty definitions.
4. **Julia/JuMP code** (where applicable) — correctness (static review only, do NOT execute code); idiomatic style per the course conventions (JuMP, HiGHS, DataFrames.jl, Plots.jl); whether code matches the math formulation; naming consistency between math symbols and code variables; instructive quality of comments and scaffolding.
5. **Content & robustness** — empty slides/sections; stale dates or "current research" claims; fragile external dependencies (Unsplash `download?...` background URLs, Giphy iframes, hotlinked images); placeholder text (`????`, TODO); factual errors; broken cross-references.
6. **Writing polish** — typos, grammar, garbled sentences, ambiguous statements (e.g., German grading-scale ambiguity: "mark at least 4.0" should read "passed / 4.0 or better"); missing image alt text.

## Required output format

Write one review file per reviewed source file, using exactly this structure:

```markdown
# Review: <filename>

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

(2–4 sentences; note what is genuinely good as well as the main weaknesses.)

## 1. High-impact teaching improvements

## 2. Model & notation issues

(For pure programming tutorials with no optimization model, title this section "Code issues".)

## 3. Content & robustness

## 4. Pedagogy & polish
```

Rules:
- Reference locations as `(line ~NNN)`.
- If a section has no findings, write "No issues found."
- Be specific and actionable; no generic advice ("add more examples") without saying exactly what and where.
- Verify every numeric claim you make by computing it.
- Do NOT modify the reviewed source files.
