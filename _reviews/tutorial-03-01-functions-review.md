# Review: tutorial-03-01-functions.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A friendly, well-paced first tutorial on functions: the recipe/robot analogies land for programming novices, the implicit-vs-explicit `return` distinction is taught before it is tested, and Exercise 3.1's "fix the assertions" format is a clever low-stakes way to check understanding of multiple dispatch. The main gaps are missed teaching moments (the scope exercise never explains *why* the broken version returns 20) and the absence of any exercise where students write their own dispatch method.

## 1. High-impact teaching improvements

- **Surface why `scope_test()` currently returns 20** (lines ~116–129). As given, the function implicitly returns its last expression, `local_variable_two = 20`, so the test fails with "The value exported is 20." That is the implicit-return rule from Section 1 in action — but the text never connects the two. Add one sentence: "Before fixing it, run the test. Why does the function return 20 and not nothing? (Hint: Section 1, implicit return.)" This turns a mechanical edit into reinforcement.
- **Let students write a dispatch method, not just relabel assertions.** Section 3's only exercise (line ~179) asks students to reorder variable names in assertions — pure reading comprehension. Add a small follow-up: "Define `operation(a::Bool, b::Bool) = a && b` and test it" (or similar), so students experience *adding* a method to an existing generic function, which is the actual skill they will need when JuMP methods appear later.
- **State the intended answers' payoff in Exercise 3.1** (lines ~181–184). The assertion *messages* are also swapped relative to the variables ("result1 should be the sum…" is attached to `result2 == 30`). After students swap the variable names, the messages happen to become correct — but nothing tells them the messages are part of the puzzle. Either say "swap the variable names so both the checks and their messages are right," or clean the messages so only one thing is being fixed.

## 2. Code issues

- **Inconsistent indentation and spacing** (lines ~44–47, ~53–59): `multiply(a,b)` and `do_something(a,b)` use 3-space indentation and no space after the comma, while `say_hello` uses 4 spaces and the course's usual style. Minor, but this is students' very first exposure to Julia style — make the examples uniform (4 spaces, `multiply(a, b)`).
- **`multiply` example lacks a printed result label** (line ~47): `multiply(10, 5)` relies on cell echo. Fine in a notebook, but a `println("multiply(10, 5) = $(multiply(10, 5))")` would match the pattern used in the `do_something` example and render identically in HTML and the `.jl` export.
- **Exercise 3.1 has no closing marker** (line ~181): other exercises delimit the student area with `# YOUR CODE BELOW`; here `# YOUR CHANGES BELOW` opens the block but nothing closes it (compare Exercise 2.1, which has both `# YOUR CHANGES BELOW` and `# YOUR CHANGES ABOVE`). Add the closing marker for consistency.

## 3. Content & robustness

- No external images, dates, or fragile links — the file is robust. No issues found beyond the following nit: the `code-links` entry (line ~4) points to `tutorial-03-01-functions.jl`, which depends on the post-render `convert_pypercent.py` step; fine under `quarto render`, but note it will 404 under `quarto preview` (applies to all five tutorials in this series).

## 4. Pedagogy & polish

- **"Try to execute the following block of code"** (line ~114): the block executes without error — it is the *test* that fails. Reword to "Run the block and then the test below it. The test fails — your task is to change the function so it returns `local_variable_one`."
- **"You can do this by passing `return` in front of the variable"** (line ~110): "passing" is the wrong verb — "by writing `return` in front of the variable" or "by placing `return` before it".
- **"The value exported is …"** (lines ~128–129): functions *return* values, they don't export them (export has a specific meaning in Julia modules, which students meet in the very next tutorial). Say "The value returned is…".
- **Run-on sentence** (line ~50): "If you explicitly use the `return` keyword in the function, it will return the value immediately once the function encounters the keyword and stops the further execution of the function." Split: "…returns the value immediately when it is encountered. Execution of the rest of the function stops."
- **"the code inside are the steps"** (line ~69): subject–verb disagreement; "the code inside describes the steps" or "the lines inside are the steps".
