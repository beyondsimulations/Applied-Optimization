# Review: tutorial-02-03-comparisons.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

The everyday-decision framing (coffee, money, umbrella) is well chosen and the operator table is a useful reference. Two structural gaps stand out: the intro promises "teaching a computer to make decisions" but `if` statements never appear (they are first used, unexplained, in the *loops* tutorial), and the short-circuit tip is dropped between exercises without any demonstration. Several exercise texts also format string literals without quotes, which will send beginners into `UndefVarError` territory.

## 1. High-impact teaching improvements

- **Close the decision-making loop with `if`.** The introduction (line ~14) frames the tutorial as teaching computers to make decisions, but the file stops at producing booleans — no `if/else` anywhere. The next tutorial (tutorial-02-04-loops.qmd, line ~41) then casually uses `if`/`elseif`/`else` inside loops as if known. Add a short Section 3 introducing `if cond ... else ... end` with one exercise (e.g., classify `temperature` into "coat"/"no coat"), or explicitly hand it off ("in the next tutorial you'll use these booleans inside `if` statements").
- **Demonstrate short-circuit evaluation instead of just naming it.** The tip (line ~204) states that `&&`/`||` short-circuit but shows nothing. A two-line demo makes it memorable and previews idiomatic Julia: `x = 0; (x != 0) && (1/x > 1)` returning `false` without dividing — and note that students will meet `condition && error("...")` in real code.
- **Surface the coffee example's answer.** With `coffee_temp = 75` and `temperature_safe = (coffee_temp <= 70)` (line ~38), the result is `false` — i.e., the coffee is *not* safe. Add a `println("Is the coffee safe to drink? $temperature_safe")` and one sentence of interpretation; as written, the most relatable example never shows its payoff.

## 2. Code issues

- **Unquoted string literals in exercise texts** (lines ~171, ~188): Exercise 2.1 asks to check if "`hello` is equal to `hello`" — with `hello` typeset as code, not as the string `"hello"`. A beginner typing `hello == hello` gets `UndefVarError: hello not defined`. Write `"hello"` with quotes in both 2.1 and 2.2 (Exercise 1.2 does this correctly with `"Hello"`/`"world"`).
- **Missing space in output** (line ~222): `println("logic3 is ", logic3," and logic4 is", logic4)` prints "logic4 isfalse" — add the space: `" and logic4 is "`.
- **Exclusive-bound exercise can't detect the intended answer** (line ~259): Exercise 2.4 asks for `1` and `10` *exclusive*, but with `x = 5` the assert `chained_comparison == true` is also satisfied by `1 <= x <= 10`. Either pick an `x` on the boundary story (e.g., test with a second assert after rebinding `x = 10` should give `false`) or drop "exclusive" — currently the test cannot distinguish `<` from `<=`, defeating the exercise's point.
- **Redundant boolean comparison in asserts** (lines ~93, ~112 etc.): `@assert comparison1 == true` is fine for beginners, but since the tutorial teaches booleans, `@assert comparison1` with a message would model idiomatic use; low priority.

## 3. Content & robustness

- No stale dates, placeholders, external links, or broken references found.

## 4. Pedagogy & polish

- **Exercise 2.4 is half lesson, half exercise** (lines ~225–247): chained comparisons are new *content* introduced under an exercise heading, breaking the pattern of every other section (explain, then exercise). Promote the explanation to its own "Section 3 - Chaining Comparisons" and keep 3.1 as the exercise.
- **Odd table example** (line ~60): "Can this ride fit in my garage?" for `<=` — "ride" is slang and the fit question involves two dimensions; "Is my car short enough for the garage?" or "Is my luggage within the weight limit?" is cleaner for non-native speakers.
- **Capitalization inconsistency in the conclusion** (line ~267): "Comparisons and logical operators" — either both capitalized or neither.
