# Review: lecture-04-jump.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

The recap of week 3 is accurate and matches the actual tutorials (functions, packages, DataFrames, IO, plots — verified against the tutorial files), and the deck cleanly hands over to the five JuMP tutorials. The striking gap: a lecture titled "Modelling with JuMP" — the payoff moment the course has been building toward since the lecture-1 transport model — contains not a single line of JuMP, no mention of a solver, and no optimization content at all. Plus a few typos, including "Constrains" on the topic slide itself.

## 1. High-impact teaching improvements

- **Show the transport model solved in JuMP.** This is the lecture where the lecture-1 promise ("you'll compute this yourself in ~10 lines") should be redeemed, yet the deck never shows JuMP. One slide with the complete pattern — `Model(HiGHS.Optimizer)`, `@variable`, `@objective`, `@constraint`, `optimize!`, `objective_value` — ideally on the lecture-1 solar-panel transport data, would (a) close the arc opened three weeks ago, (b) give students a mental map before the tutorials, and (c) demonstrate the math → code correspondence that is the whole point of the course. The deck executes Julia, so the result can even be computed live.
- **Name the solver.** HiGHS is the course's default solver and appears in the tutorials, but neither "solver" nor "HiGHS" appears in this deck. Students should hear the model/solver separation (JuMP = modeling language, HiGHS = solver) *before* they meet `Model(HiGHS.Optimizer)` in tutorial 04-01, otherwise the line is incantation.
- **Bridge the recap to JuMP.** The recap topics are exactly the prerequisites (packages → installing JuMP/HiGHS; DataFrames/CSV → reading model data; functions → building models), but the connection is never drawn. One sentence per recap slide ("you'll use this today to load the transport data") turns the recap from ritual into motivation.
- **Add a learning-objectives slide** — same gap as lectures 1–3.

## 2. Code issues

- **`CSV.read()` needs a sink argument** (line ~50): "Use `CSV.read()` to read a CSV file into a DataFrame" — the DataFrame is a *required second argument*: `CSV.read("file.csv", DataFrame)`. Students who type `CSV.read("file.csv")` get a MethodError; show the two-argument form on the slide.
- **`Pkg.add` only** (lines ~29–31): fine, but the REPL package mode (`] add JuMP`) is what most documentation and error messages reference — worth one bullet, since students will encounter it this week when installing JuMP and HiGHS.
- No optimization model is formulated in this deck, so there are no model/notation findings.

## 3. Content & robustness

- **Redundant `---` before the Literature section** (line ~102): horizontal rule directly before `# [Literature]` is a slide delimiter and can produce an empty slide — same pattern flagged in lecture 2; remove it.
- **"available on Friday"** (line ~67): undated on the permanent website; same staleness pattern as lecture 3.
- **Literature list is Julia-only** (lines ~108–110): for the lecture that introduces JuMP, add the JuMP documentation (jump.dev) and/or Kwon's "Julia Programming for Operations Research" — Think Julia says nothing about optimization.
- The five tutorial topics (lines ~83–87) match the actual files `tutorial-04-01-jump` … `tutorial-04-05-transport` — verified, no issue.

## 4. Pedagogy & polish

- **Typo on the topic slide:** "**Constrains**" → "**Constraints**" (line ~85).
- **Grammar** (line ~99): "we will start with different optimizations problems and topics, that we address together" → "different optimization problems and topics that we will address together" (plural noun misused as adjective; German-style comma before "that").
- **"this weeks tutorials"** → "this week's tutorials" (line ~91) — same typo as lecture 3.
- **Awkward tip** (line ~62): "Explore different plot types and in the long term even backends for various output formats and interactivity" — rephrase, e.g., "Explore different plot types; later, different backends offer other output formats and interactivity."
- **Term consistency** (line ~87): "**Transport Problem**: Learn how to solve a transportation problem" — pick "transport" or "transportation" and use it consistently (lecture 1 says "transportation").
