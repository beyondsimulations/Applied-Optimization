# Review: lecture-03-packages.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

The recap → tutorial-topics → literature structure is clear and the deck is honest about its role (a short kickoff before hands-on work). However, several recap statements are technically wrong or misplaced (the `while` description is inverted; `if`/`else`/`elseif` are listed under "Loops"), the recap covers a "Scope" tutorial that did not exist last week (the fifth tutorial was Dictionaries), and a deck titled "Packages and Data Management" contains no actual content on packages or data management.

## 1. High-impact teaching improvements

- **The recap does not match last week's tutorials.** The "Scope" slide (lines ~57–68) recaps a topic with no week-2 tutorial, while **Dictionaries** (`tutorial-02-05-dicts.qmd`) — which students actually worked through — is never recapped. Replace the Scope slide with a Dictionaries recap (`Dict("a" => 1)`, indexing, `keys`/`values`); dicts also matter downstream for indexing JuMP parameter data.
- **No content matches the lecture title.** "Packages and Data Management" never says what a package *is*, why Julia's ecosystem/environments matter, or shows a single DataFrame. Two slides would fix this: (1) motivation — "you could write CSV parsing yourself, or use `CSV.jl`: ecosystem, environments, `Pkg`"; (2) a 4-line live demo (`DataFrame(...)`, `describe(df)`) exploiting the fact that these decks execute Julia. Right now students meet packages for the first time alone in the tutorial.
- **Recap slides are pure bullet prose.** Every recap concept (typeof, push!, ==, for) fits in a one-line executable snippet; showing code on the slide rehearses reading Julia, which bullets do not. At minimum, do it for the two topics students struggle with (loops, scope/dicts).
- **Add a learning-objectives slide** — same gap as lectures 1 and 2.

## 2. Code issues

- **`while` description is inverted** (line ~53): "repeats code *until a condition is met*" — a `while` loop repeats *while* the condition is true, i.e., until it is *no longer* met. As written, students will predict the opposite behavior. Say "repeats code as long as a condition is true".
- **`if`/`else`/`elseif` are not loops** (lines ~54–56): they sit under the "Loops" heading. Retitle the slide "Loops and Conditionals" or move them to their own slide; conflating iteration with branching is a classic beginner confusion this slide currently reinforces.
- **`elseif` bullet is circular** (line ~55): "checks if a condition is true and executes if it is" is indistinguishable from the `if` bullet. Say "checks a further condition when the previous `if`/`elseif` was false".
- **Comparison list is asymmetric** (lines ~43–44): it defines `<` and `>=` but omits `<=` and `>`. Either list all four or say "and analogously `>`, `<=`".
- **`&&` / `||` described as comparing "values"** (lines ~45–46): they combine *conditions* (Booleans), and short-circuit — "checks if two values are true" is loose; "true if **both** conditions are true" / "true if **at least one** is true" is tighter.
- **`let` bullet duplicates `local`** (lines ~61–62): "defines a local variable" twice. `let` introduces a new scope *block*; phrase it that way to add information rather than repeating.

## 3. Content & robustness

- **"available on Friday"** (line ~72): fine as a live remark, but on the permanent website this is undated and goes stale — consider "at the end of each week" phrasing.
- The remaining four tutorial topics (line ~88–92) match the actual files (`functions`, `handling` = Package Management, `DataFrames`, `IO`, `Plotting`) — verified, no issue.
- No external image dependencies in this deck — good.

## 4. Pedagogy & polish

- **Typos:** "You can create a them" → "You can create them" (line ~29); "leeture" → "lecture" (line ~67); "this weeks tutorials" → "this week's tutorials" (line ~96).
- **Comma splice/Germanism** (line ~67): "much slower, if they are not defined as constants" — drop the comma.
- **"the problems of the third lecture"** (line ~104): ambiguous — the tutorials belong to *this* (third) lecture; "the problems of this lecture" or "this week's tutorials" is clearer.
- **"little cat icon"** (line ~74): charming, but say "the GitHub icon (Octocat) at the bottom right" so students searching the page know what to look for.
