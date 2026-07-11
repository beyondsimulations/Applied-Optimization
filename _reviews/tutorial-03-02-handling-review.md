# Review: tutorial-03-02-handling.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A short, well-motivated introduction to Pkg: the toolbox analogy, the `import` vs `using` callout, and the explicit explanation of `Project.toml`/`Manifest.toml` are exactly right for novices. The main problems are technical: the Exercise 1.1 "test" runs `Pkg.update()` (a slow, network-dependent, Manifest-mutating side effect), the `callout-example` div is not a Quarto callout and will render unstyled, and the environment path in the prose (`applied-optimization`) does not match the include that actually activates it (`../applied-optimization`).

## 1. High-impact teaching improvements

- **Replace `Pkg.update()` as the import test** (lines ~47–53). To check that `Pkg` was imported, the test updates *every package in the course environment* — this needs network access, can take minutes on lab machines, and rewrites `Manifest.toml`, potentially desynchronizing students from the pinned course environment mid-course. Test with a side-effect-free call instead: `@assert @isdefined(Pkg)` or `Pkg.status()`. Also, the `catch` message "The Pkg module was not imported yet!" is wrong when the real failure is a network error during the update.
- **Add a tiny exercise to Section 3** (lines ~107–118). Update/remove is told, never practiced, and the tutorial ends two paragraphs later. Even a no-execution comprehension question ("Which command removes `DataFrames` but keeps it available to other environments? Why does `Pkg.rm` not delete the package from disk?") would let the section pull its weight — the depot-vs-environment distinction is the single most confusing Pkg concept for beginners and is never mentioned.
- **Reconcile the environment path with reality** (lines ~64, ~72). The `activate_environment.qmd` include actually runs `Pkg.activate("../applied-optimization")`, but the prose twice tells students "We activated `Pkg.activate(\"applied-optimization\")`". A student who runs the prose version from the tutorials folder silently *creates a brand-new empty environment* at `tutorials/applied-optimization` — `Pkg.activate` does not warn — and every subsequent `Pkg.add` lands in the wrong place. Either show the path exactly as the include uses it, or (better) lean on the tip already present at line ~80 and recommend plain `Pkg.activate()` from the project folder.

## 2. Code issues

- **Exercise 2.1 student block is missing `#| eval: false`** (lines ~89–92). Every other exercise block in this tutorial series has it. The block is empty so it currently renders harmlessly, but if an answer (`Pkg.add("DataFrames")`) is ever filled in, `quarto render` will execute a package installation as part of the build. Add the option for consistency and safety.
- **Exercise 1.1 accepts nothing and passes anyway if run twice** (lines ~47–53): once any earlier cell (or the environment include) has brought `Pkg` into scope, the test passes even if the student wrote nothing. Combined with the point above, switching to `@assert @isdefined(Pkg)` doesn't fix this (same issue) — a comment acknowledging "this test passes once Pkg is loaded from any cell" or asking the student to restart the kernel first would be honest.

## 3. Content & robustness

- **`::: {.callout-example}` is not a Quarto callout** (lines ~115–118). Quarto's built-in callout types are note/tip/warning/caution/important; no extension or SCSS in this repo defines `callout-example` (this is its only occurrence in the project). It renders as an unstyled div — the "Example" box students see elsewhere will be missing here. Change to `.callout-note` with `title="Example"`.
- **"When you create a new environment, Julia generates two important files"** (lines ~59–62): slightly wrong — `Pkg.activate("new_environment")` alone creates nothing; `Project.toml`/`Manifest.toml` appear only on the first `Pkg.add`. Since the very next sentence tells students the files "should be version controlled", a student who activates and looks for the files will be confused. Say "once you add the first package, Julia generates…".

## 4. Pedagogy & polish

- **Heading level inconsistency** (line ~120): "## Conclusion" is level 2 here but "# Conclusion" (level 1) in tutorials 03-01, 03-03, 03-04, and 03-05 — this changes the rendered section structure/TOC. Promote to `#`.
- **"Adding packages in Julia is afterwards straightforward"** (line ~83): word order — "Afterwards, adding packages is straightforward" (or drop "afterwards").
- **Redundant repetition** (lines ~64–72): "Remember what we did at the start of the lecture?" and "Remember how we did this at the start?" appear eight lines apart; also, this is a tutorial, not a lecture. Merge into one reminder and say "at the start of the tutorial".
- The tutorial has no exercise that students can get *wrong* — 1.1 and 2.1 both pass under almost any input (see Section 2). Acceptable for a setup tutorial, but worth knowing.
