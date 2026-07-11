# Review: tutorial-03-05-Plotting.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

Pedagogically the intro is the best in the series — it is the only tutorial that states explicit learning objectives up front, and the line-by-line breakdown of the first `plot()` call is exemplary. But the file carries copy-paste damage: the front-matter title is that of the DataFrames tutorial, there are two "Section 3"s and three "Exercise 3.1"s, and the save-plot exercise silently depends on a folder created (unreliably) in the previous tutorial.

## 1. High-impact teaching improvements

- **Fix the ExampleData dependency in the save exercise** (lines ~202–217). `savefig` into `"$(@__DIR__)/ExampleData/..."` throws a `SystemError` if the folder does not exist — and it only exists if the student ran the `#| eval: false` setup block of tutorial 03-04 (which itself crashes on second run, see that review). Anyone doing this tutorial standalone hits an opaque error. Add `mkpath("$(@__DIR__)/ExampleData")` to the exercise scaffold, echoing the folder-creation lesson from 03-04.
- **Tests only check `@isdefined`** (lines ~88, ~130, ~183–186, ~216). Understandable for plots, but at minimum verify the object type so a student who writes `scatter_plot = 5` doesn't "pass": `@assert scatter_plot isa Plots.Plot "scatter_plot should be a plot object"`. The savefig test (line ~216) is the good exception — it checks the actual file.
- **Say why the legend matters when it appears** (lines ~157–167). Section 3 is the payoff of `legend=false` from Section 1 ("we'll use this later"), and the callout does mention `label`. Close the loop explicitly: "in Section 1 we switched the legend off; with multiple series, labels + legend is how the reader tells them apart." Small change, but it converts a forward reference into a completed arc.

## 2. Code issues

- **Unseeded randomness** (lines ~52, ~101, ~147–148, ~246, ~261): every render of the page produces different figures, and students' plots will never match the rendered ones. For a plotting tutorial that is arguably fine, but a one-line `using Random; Random.seed!(42)` (or a callout "your plot will look different — that's expected") would prevent "did I do it wrong?" questions.
- **`display()` calls are redundant in Quarto/Jupyter** (lines ~64, ~113, ~162, ~238, ~252, ~267): the last expression of a cell is displayed automatically; teaching `display(line_plot)` as the standard pattern adds noise students will cargo-cult. Either drop them or add one sentence explaining when `display` is actually needed (inside loops/functions — which is exactly where students will need it later when plotting per-iteration results).
- **StatsPlots is loaded but unused until the very end** (lines ~31–39, ~255–268): only `boxplot` needs it. A parenthetical "(StatsPlots adds statistical recipes like `boxplot` — see Section 4)" would justify the extra dependency instead of leaving it mysterious.

## 3. Content & robustness

- **Wrong title in the front matter** (line ~2): `title: "Tutorial III.III - DataFrames in Julia"` — this is Tutorial III.V on plotting. The wrong title appears in the browser tab, the site navigation/listing, and the rendered page header. Should be "Tutorial III.V - Plotting in Julia". This is the single most visible defect in the whole tutorial series.
- **Duplicate section and exercise numbering**: two "Section 3" headings ("Adding Multiple Series", line ~140; "Saving Plots to Files", line ~192) followed by "Section 4" (line ~222), and consequently two different "Exercise 3.1"s (lines ~169, ~202) — plus Section 2's exercise is "2.1" while Section 1's is "1.1", so the saving section should be Section 4 with Exercise 4.1, and "Advanced Plotting Techniques" Section 5.
- **Package-install block bypasses the environment-path problem** (lines ~26–32): `Pkg.activate("applied-optimization")` has the same relative-path pitfall flagged in the 03-02 review — run from the tutorials folder, it creates a fresh empty environment instead of activating the course one, and then `Pkg.add(["Plots","StatsPlots"])` installs into the wrong place. Match the include's `../applied-optimization` or recommend `Pkg.activate()` from the project folder.

## 4. Pedagogy & polish

- **"NYour turn!"** (line ~171): typo — "Your turn!".
- **Garbled savefig explanation** (lines ~194): "the second argument is the `path/filename` format as string. Replace `path` with the path, the `filename` with the actual name and `format` with the file format" — "format" is described as a third placeholder but appears only as the file extension. Suggest: "the second argument is the file path as a string; the extension (`.png`, `.pdf`, `.svg`) determines the format."
- **"the code might come in handy later on during the course as recipe"** (line ~224): → "as a recipe", or better "as recipes you can copy".
- **Exercise 3.1 (multi-series) requirements vs test mismatch** (lines ~171, ~183–186): the text demands "a different color and label" for each series, but the test only checks that `y1`, `y2`, `y3`, and `multi_series_plot` exist. Either soften the text or note that colors are auto-cycled by Plots.jl anyway (which is itself worth teaching).
- The intro's numbered objectives (lines ~16–20) promise four skills and the tutorial delivers all four — good; consider adopting this objectives pattern in tutorials 03-01 through 03-04, none of which state objectives.
