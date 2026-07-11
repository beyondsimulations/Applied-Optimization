# Review: tutorial-03-04-IO.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A compact, practically motivated I/O tutorial; teaching `@__DIR__` early is a genuinely good call (path confusion is the #1 beginner I/O failure), and the write-then-read structure of both sections gives each exercise a clear payoff. However, it has the most correctness problems in the series: the setup block crashes on any second run (`mkdir` on an existing folder), the Exercise 2.1 test uses a relative path and thus can fail even when the student did everything right, and the "DelimitedFiles needs no installation" tip has been false since Julia 1.9.

## 1. High-impact teaching improvements

- **`mkdir` crashes on re-run** (line ~40). `mkdir("$(@__DIR__)/ExampleData")` throws `IOError: mkdir(...): file already exists` the second time a student runs the setup block — and re-running cells is exactly what beginners do. Use `mkpath(...)` (idempotent) or guard with `if !isdir(...)`. One sentence explaining the choice would also turn a crash into a lesson about idempotent setup code.
- **Give a delimiter hint in Exercise 1.1** (lines ~54–70). The file was written with `writedlm(io, new_data, ',')`, but `readdlm(path)` defaults to whitespace delimiting — a student who calls the natural `readdlm(path)` gets a matrix of strings like "10,12,6" and a bare `AssertionError` from `@assert read_matrix == new_data` (line ~75) with no message. Either extend the hint ("you must tell `readdlm` the delimiter we used when writing") or add a message to the assert explaining what probably went wrong. This is the single most likely failure point in the tutorial.
- **Practice what tutorial 03-02 just preached** (lines ~85–88). `import Pkg; Pkg.add("CSV")` is shown without activating the course environment, immediately after the previous tutorial emphasized "Before installing new packages, we should always activate this environment again." Add `Pkg.activate(...)` (matching the include's path) or a callout saying the kernel already runs in the environment — as written, the two tutorials contradict each other.

## 2. Code issues

- **Exercise 2.1 test path is inconsistent with the instructions** (line ~106). The test is `@assert isfile("ExampleData/table_out.csv")` — a *relative* path — while the exercise itself builds `csv_file_path` with `@__DIR__` (line ~98) and the tutorial repeatedly insists on `@__DIR__` precisely because the working directory may differ. If the cwd is not the tutorials folder, the student writes the file correctly and the test still fails ("Sorry, the file could not be found"). Use `@assert isfile("$(@__DIR__)/ExampleData/table_out.csv")` (the Plotting tutorial's test, tutorial-03-05 line ~216, already does this correctly).
- **Wrong filename in success message** (line ~108): prints "CSV file 'data.csv' written successfully!" but the file is `table_out.csv`.
- **Exercise 1.1 test depends on a non-evaluated block** (lines ~35, ~75): the block defining `new_data` is `#| eval: false`, so `@assert read_matrix == new_data` throws `UndefVarError: new_data` for anyone who runs the exercise without having run the setup block first. Add "run the block in Section 1 first" to the exercise text, or re-define the expected matrix inside the test.

## 3. Content & robustness

- **Stale claim: DelimitedFiles is no longer batteries-included** (lines ~24–26). "The DelimitedFiles package is part of Julia's Standard Library, which means you can use it without installing anything extra!" — since Julia 1.9, DelimitedFiles was moved out of the sysimage and must be installed like any package; the course runs Julia 1.12, and indeed `applied-optimization/Project.toml` explicitly lists `DelimitedFiles` as a dependency. Inside the course environment the code works, but a student trying `using DelimitedFiles` in a fresh environment (as tutorial 03-02 encourages them to create) gets an error the tip says cannot happen. Reword: "DelimitedFiles ships with the course environment; in your own projects, add it with `Pkg.add(\"DelimitedFiles\")`."
- **Leftover artifacts in the repo**: the tutorial writes `ExampleData/` next to the source files (line ~40 onward). Check that `tutorials/ExampleData/` is gitignored; otherwise every student render dirties the working tree.

## 4. Pedagogy & polish

- **"If you solely followed the course so far"** (line ~83): → "If you have only been following along with the course so far".
- **"ask the inbuild help"** (line ~92): → "the built-in help".
- **Redundant sentence** (line ~51): "The reason is, that the `@__DIR__` macro returns the directory of the file in which the macro is called, not the directory of the script you are running" — comma before "that" is ungrammatical, and "file in which the macro is called" vs "script you are running" reads as the same thing to a beginner. Suggest: "…returns the directory of the file containing the macro, not your current working directory."
- **"Read a CSV File in"** (line ~111): dangling particle in a heading — "Read in a CSV File" or just "Read a CSV File".
- The two sections make the DelimitedFiles-vs-CSV.jl choice implicit. One closing sentence ("use DelimitedFiles for quick numeric matrices, CSV.jl + DataFrames for real tabular data — in this course we mostly use the latter") would give students a decision rule.
