# Review: tutorial-02-01-variables.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A friendly, well-scaffolded first tutorial: the "labeled containers" analogy, the small exercise → `@assert` → encouraging `println` rhythm, and the consistent structure are exactly right for programming novices. The main weaknesses are in the VS Code setup instructions (broken list numbering and a callout that contradicts the command it explains) and in weak assertions that pass even when the student misses the point of the exercise (wrong type, missing `!` in the string).

## 1. High-impact teaching improvements

- **Type exercises don't actually test types.** Exercise 2.1 (line ~140) checks only `answerUniverse == 42` — but `42.0 == 42` is `true` in Julia, so a Float answer passes an "Create an Integer variable" exercise. Same for 2.2 (`money == 1.35` never checks `Float64`) and 2.3, where `isStudent = 1` passes because `1 == true`. Since the whole section is about types, assert the type too: `@assert answerUniverse == 42 && answerUniverse isa Int`. This also previews `isa`/`typeof` usage naturally.
- **Motivate type annotations.** Section 3 (line ~180) shows *how* to annotate but never *why* a student of this course should care. One sentence connecting to what's ahead ("JuMP will later insist on the right kinds of numbers, and typed variables make Julia fast") turns an abstract feature into a payoff.
- **Setup callout contradicts the setup command.** Step 3 (line ~24) says `julia --project=applied-optimization`, but the callout-note (line ~49) explains "The `--project=.` flag tells Julia to use the `Project.toml` file in the current directory" — a flag that appears nowhere in the instructions. Beginners will look for `--project=.` and not find it. Rewrite the note to explain the actual command (it creates/uses an environment in the `applied-optimization` subfolder).
- **`Pkg.instantiate()` on a fresh environment does nothing.** Step 4 (line ~31) comments it with "Initialize the project", but if the student just created an empty `applied-optimization` environment there is no manifest to instantiate; the environment is only populated by the subsequent `Pkg.add("IJulia")`. Either have students download the course `Project.toml` first (then `instantiate` makes sense) or drop/reword the comment — as written it teaches a wrong mental model of `instantiate`.

## 2. Code issues

- **`count::Int64 = 100`** (line ~189): `count` is an exported `Base` function; assigning to it at top level works only if `count` hasn't been referenced yet in the session and shadows a useful builtin. Use a neutral name like `n_items` — especially in a tutorial that students copy verbatim.
- **Misleading assert message in Exercise 1.2** (line ~100): the failure message renders the target as `"Hello, Optimization"!` — the required trailing `!` inside the string is displaced outside the quotes, so a student who typed `"Hello, Optimization"` is told to type exactly what they typed. Escape it as `\"Hello, Optimization!\"`.
- **Hidden exercise dependency:** Exercise 4.1 (line ~249) asserts `message == "y is 5"`, which silently depends on `y` from Exercise 3.1. Fine in linear notebook flow, but a one-line reminder ("uses the `y` you created above") would prevent confusing `UndefVarError`s for students who restart the kernel.
- **Inconsistent `#| eval: true` directives:** some demonstration cells carry the directive (lines ~59, ~118) and some don't (lines ~123, ~188). Harmless if the default is eval, but pick one convention.

## 3. Content & robustness

- **Broken list numbering in the setup** (lines ~39–42): the sequence runs 6, 8, 8, 9 — step 7 is missing and step 8 is duplicated. Also "open the`.ipynb` file" is missing a space.
- **Course-context mismatch risk:** the kernel is installed as "Applied Optimization" (line ~36) while the project CLAUDE.md refers to kernel `julia-ao-1.12`; if the rendered site's notebooks expect a specific kernel name, say so here to avoid a kernel-picker dead end.
- No stale dates, placeholders, or fragile external links found.

## 4. Pedagogy & polish

- **Typo "the you"** (line ~158): "Perfect, the you have stored $money…" → "Perfect, you have stored $money…".
- **Typo "excercise"** (line ~228) → "exercise".
- **Awkward apology callout** (line ~45): "Sorry, that this start is rather complicated. But in following this, we have a clean environment…" → "Sorry that the start is rather complicated. But by following these steps, you get a clean environment and basically cannot break anything by installing packages."
- **Fahrenheit example** (line ~186): `temperature::Float64 = 98.6` is body temperature in °F — meaningless to a German audience. Use `37.0` (°C).
- **Vague instruction** (line ~40): "You can do so by clicking on Jupyter on the course website" — say exactly where the Jupyter link sits (e.g., "the 'Jupyter' link at the top of each tutorial page").
