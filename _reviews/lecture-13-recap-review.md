# Review: lecture-13-recap.qmd

**Reviewed:** 2026-07-07
**Scope:** Pedagogy, model formulation, math notation, code, content robustness, writing polish

## Summary

A warm, well-paced closing deck: the congratulations → topic table → "what have we learned" → "how to continue" arc is the right shape for a final session, and the "Topics Covered" table is a genuinely nice consolidation device. The main weakness is that the recap stays at the level of *topics* and never recaps *techniques* — the modeling skills (variable domains, big-M, linearization, multi-period inventory, subtour elimination) that were the actual learning objectives of the course are not revisited. Several slides also give generic advice without concrete pointers, and both Giphy iframes are fragile external dependencies.

## 1. High-impact teaching improvements

- **Recap techniques, not just topics** (line ~23). The table maps each application to its underlying problem class — good — but a second column (or a follow-up slide) mapping each to the *modeling technique* it introduced would consolidate far more: e.g., Transport → LP basics; Beer Production → binary setup variables + inventory balance; Split Orders → linearizing quadratic terms; Library Routing → subtour elimination / heuristics; Districting → contiguity constraints; Hajj → time-indexed scheduling; Arena → 2D packing; Metro → queue dynamics over time. This is the last chance to surface the transferable skill set.
- **Turn the table into a quiz.** The course's interactive question–fragment rhythm (used well in lectures 1–12) is absent here. Instead of presenting the table fully populated, reveal the "Topic" column first and ask students to recall the underlying problem structure ("Which classic problem did we extend for the library routing?") before showing the answer column. This retrieval practice is the highest-value activity available in a recap session.
- **Make "Concrete Next Steps" actually concrete** (lines ~81–92). "Join online communities", "Follow key researchers", "Contribute to open-source projects" name nothing. Give the actual entry points: the Julia Discourse forum and the JuMP community (community.julialang.org, jump.dev), JuMP's "good first issue" label for contributions, and one or two names or blogs worth following. The callout tip (line ~90) largely restates the bullet it annotates ("start a small personal project… try to find a problem you are interested in") — replace it with 2–3 example project ideas at the right scale (e.g., optimize a sports-league schedule, a diet/meal plan, a shift roster).
- **Link the table rows to the lectures.** Each topic in the table (lines ~27–34) could hyperlink to its lecture page — on the website render this turns the recap into a navigation hub for exam revision at zero cost.

## 2. Model & notation issues

- **"Multiple-Quadratic-Knapsack Problem"** (line ~29) does not match the course's own naming: lecture 6 (lines ~439, ~842) consistently calls it the **Quadratic Multiple Knapsack Problem (QMKP)**. Use the same name here — students revising from this table will search for the wrong term.
- **"Split Delivery Minimization"** (line ~29): lecture 6 is titled "Minimizing Split Orders" and is about warehouse order splitting; "split delivery" is an established but *different* concept in routing (split-delivery VRP). Say "Split Order Minimization" to avoid collision with SDVRP terminology.
- **"P-Median Problem"** (line ~31): lecture 8 writes "p-Median" (lowercase p, lines ~674–712), which is also the literature convention. Align the capitalization.
- **"Network Flow Problem"** (line ~34) is a loose fit: lecture 12 formulates an inflow-control model with queue dynamics and never labels itself a network flow problem. If the label is a deliberate simplification, fine, but "Flow Control / Network Flow Problem" or "Dynamic Network Flow" would be more faithful to what was taught.
- **"2-D Knapsack"** (line ~33) vs lecture 11's "2D-Knapsack" (line ~675) — trivial, but pick one.

## 3. Content & robustness

- **Two Giphy iframes** (lines ~20, ~131) are fragile external dependencies — slow, blockable, and dead if offline in the lecture hall. The final slide (line ~128) is *only* the iframe on a black background, so a failed load ends the entire course on a blank screen. Self-host both (images.beyondsimulations.com, like other assets).
- **"On Friday, we will have a discussion session"** (line ~113) is semester-specific and meaningless on the public website (and already stale for any reader outside that week). Also, the deck's own title is "Recap **and Discussion**" while this slide defers the discussion to Friday — either the title or the slide overpromises. Say "In the final session…" and reconcile with the title.
- **Cursor recommendation is dating fast** (lines ~94–104). Naming a single commercial IDE and "Claude and ChatGPT integrated" is the kind of "current tools" claim that goes stale within a semester. Generalize: "use an AI-assisted IDE or coding agent (e.g., Cursor, GitHub Copilot, Claude Code)" and keep the durable advice (understand the code, be confident in the basics first) as the headline.
- **Footnote label typo** (lines ~25, ~36): `[^orginal]` — misspelled "original". It renders (the two references are consistently misspelled), but fix it before someone corrects only one of them and breaks the footnote.
- **"the last half-bonus point"** (line ~114): fine if the bonus scheme elsewhere (lecture 1 / syllabus) is phrased in half-points; worth a cross-check that the total advertised there matches what has been handed out through lecture 13.

## 4. Pedagogy & polish

- **"We are offering seminars and master thesis"** (line ~71): number agreement — "seminars and master theses" or better "seminar places and master thesis supervision".
- **"But note, that it is often worth it"** (line ~78): German-style comma — "But note that it is often worth it". Same sentence: "note, that it is often worth it and the tools we have used are all free" reads as a run-on; split after "worth it".
- **"Getting your supervisors on board is the hardest part!"** (line ~78): "supervisors" is ambiguous for students (thesis supervisor? employer?). The context ("apply programming in your work") suggests *managers/employers* — say so.
- **No learning-objectives equivalent:** for a recap, a one-slide "check yourself" list ("Can you: formulate sets/parameters/variables? choose variable domains? linearize a product of binaries? …") would give students a concrete self-assessment for exam prep, matching the checklist style of lecture 1's installation section.
- **"Any questions regarding the past lectures?"** (line ~40): fine, but it lands *before* "What have we learned?" — swapping the two lets the recap prompt the questions rather than asking cold.
