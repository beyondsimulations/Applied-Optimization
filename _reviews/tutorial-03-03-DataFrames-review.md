# Review: tutorial-03-03-DataFrames.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

The strongest tutorial of the series: a single `employees` example threads through creation, access, mutation, filtering, sorting, row iteration, and row-wise construction, and Exercise 5.1 (age-dependent bonus) is a genuinely good synthesis task whose test values are all correct (5% of 59,000 = 2,950; 5% of 62,000 = 3,100; 10% of 90,000 = 9,000). The weak spots are two factual errors in the Section 5 prose (`eachrow` does not yield `NamedTuple`s, and `push!` is *not* how the shown code creates a column) and a hidden dependency of Exercise 5.1 on Exercise 2.2 that produces a baffling failure for students who skipped ahead.

## 1. High-impact teaching improvements

- **Make the Exercise 2.2 → 5.1 dependency explicit** (lines ~111–127, ~213–239). The bonus test expects John's bonus to be 2,950 = 5% × 59,000 — i.e., it assumes the student completed Exercise 2.2 (salary update to 59,000). A student who skipped 2.2 computes 5% × 50,000 = 2,500 and gets "John should have a bonus of 2950" with no clue why. Add one line to Exercise 5.1: "This exercise assumes you updated John's salary to 59000 in Exercise 2.2."
- **Section 4 promises grouping and joining but shows only `sort`** (lines ~166–172). "…including sorting, grouping, and joining DataFrames" — neither `groupby`/`combine` nor any join appears anywhere in the tutorial. Either add a two-line `combine(groupby(...))` example (these students will need grouped aggregation constantly when preparing optimization data) or trim the sentence to "such as sorting".
- **Section 6 teaches the most transferable pattern with no exercise** (lines ~243–268). Building a results DataFrame row-by-row with `push!` is exactly what students will do to collect optimization results in later lectures — say so ("you will use this pattern to store solver results"), and add a small exercise (e.g., build an `Overtime` DataFrame from `employees`) so the pattern is practiced, not just read.

## 2. Code issues

- **Factual error: `eachrow` does not yield `NamedTuple`s** (line ~206). "the `row` holds all the values of the row as a `NamedTuple`" — `eachrow` yields `DataFrameRow` views. The distinction matters here because the tutorial *relies* on it: Exercise 5.1 only works if writing to `row.Bonus` mutates the parent DataFrame, which is true for a `DataFrameRow` view and would be false for a `NamedTuple` copy. Correct the term (a parenthetical "a view into the DataFrame, so changes write through" would actively help students).
- **Wrong function named for column creation** (line ~206): "To create a new column, we can use the `push!` function" — the code that follows creates the column by assignment (`employees.VacationDays = ...` / `.= 0`), not `push!`; `push!` adds *rows* and is introduced for that purpose in Section 6. As written, this sentence pre-teaches a wrong mental model that Section 6 then has to undo. Replace with "To create a new column, assign a vector (or broadcast a value) to a new column name."
- **Unidiomatic column initialization** (line ~209): `[0 for row in eachrow(employees)]` — a comprehension over `eachrow` just to count rows. Idiomatic and clearer for beginners: `zeros(Int, nrow(employees))` or `fill(0, nrow(employees))`, and `nrow` is worth teaching anyway (it appears untaught in the Exercise 3.1 test, line ~159).
- **Exercise 1.1 equality test is order-sensitive** (lines ~54–58): `employees == DataFrame(...)` fails if a student orders columns as, say, `Name, Salary, Age` even though the data is right. Acceptable, but the assert has no explanatory message — add one ("check column names, order, and values") so the failure is diagnosable.

## 3. Content & robustness

- **Hidden state reset can mask student errors** (lines ~73–82): the `echo: false` block silently re-creates `employees` with the original salary of 50,000 between Sections 1 and 2. In the rendered page this is invisible and correct; but in the exported `.jl`/notebook version, if this block is carried over, it *undoes* Exercise 2.2 before Section 3 runs, making the 5.1 test unpassable. Verify how `convert_pypercent.py` treats `echo: false` cells; if they survive into the student notebook, this block needs an explanatory comment or removal there.
- **Vague JSON tip** (lines ~188–190): "take a look at JSON files which can be used to work with all kind of differently structured data sets" — no package named (JSON3.jl), no pointer, and it interrupts the DataFrame flow between two exercises. Either name the package and a use case, or cut it.

## 4. Pedagogy & polish

- **"to include only employees names \"Frank\""** (line ~133): → "employees named \"Frank\"".
- **"all kind of differently structured data sets"** (line ~189): → "all kinds of differently structured data".
- **Comma splice in Exercise 1.1** (line ~43): "John is `28` years old and earns `50000`, Mike is `23`…" — use periods or a small markdown table (a table would also make the target DataFrame visually obvious).
- **`Age = [18, 25,29]`** (line ~37): missing space after the comma in the very first example students see.
- **Column-name casing** (line ~71): "To access the column 'name'" — the column is `Name`; since the same paragraph teaches that access is by exact name, the lowercase mention undercuts the point.
- **camelCase vs snake_case** (lines ~136, ~143): `allFranks` clashes with the snake_case used everywhere else in the series (`high_earners`, `sorted_df`). Rename to `all_franks`.
