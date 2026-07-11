---
title: Lecture XIII - Recap and Discussion
subtitle: Applied Optimization with Julia
author: Dr. Tobias Vlćek
format:
  revealjs:
    footer: ' {{< meta title >}} | {{< meta author >}} | [Home](lecture-13-recap.qmd)'
    output-file: lecture-13-presentation.html
---


# <span class="flow">Introduction</span>

## Congratulations!

You've finished the course and learned how mathematical models can be used to solve real-world problems!

. . .

<center>
<iframe src="https://giphy.com/embed/xT9C25UNTwfZuk85WP" width="480" height="346" style frameBorder="0" class="giphy-embed" allowFullScreen>
</iframe>
</center>

## Topics Covered

<span class="question">Question:</span> **Can you recall the problem structure behind each topic?**

. . .

- Solar Panel Transport
- Beer Production
- Split Order Minimization
- Library Routing
- Police Service Districting
- Safety Planning for the Hajj Pilgrimage
- Arena Seating
- Passenger Flow Control

## Underlying Problem Structures

| Topic | Original Problem[^1] |
|-------------------------------------------|-----------------------------|
| [Solar Panel Transport](lecture-04-jump.qmd) | Classic Transport Problem |
| [Beer Production](lecture-05-production.qmd) | Capacitated Lot-Sizing Problem (CLSP) |
| [Split Order Minimization](lecture-06-ordersplit.qmd) | Quadratic Multiple Knapsack Problem (QMKP) |
| [Library Routing](lecture-07-routing.qmd) | Capacitated Vehicle Routing Problem (CVRP) |
| [Police Service Districting](lecture-08-districting.qmd) | p-Median Problem |
| [Safety Planning for the Hajj Pilgrimage](lecture-09-safety.qmd) | Scheduling Problem |
| [Arena Seating](lecture-11-distancing.qmd) | 2D-Knapsack Problem |
| [Passenger Flow Control](lecture-12-rail.qmd) | Dynamic Network Flow Problem |

## Modeling Techniques

<span class="question">Question:</span> **And do you remember the key modeling ideas?**

. . .

| Topic                    | Key Modeling Idea                            |
|--------------------------|----------------------------------------------|
| Solar Panel Transport    | Sets, parameters and continuous variables    |
| Beer Production          | Binary setup variables and Big-M constraints |
| Split Order Minimization | Quadratic objective with binary variables    |
| Library Routing          | Subtour elimination and heuristics           |

## Modeling Techniques II

| Topic | Key Modeling Idea |
|-------------------------------------------|-----------------------------|
| Police Service Districting | Contiguity and compactness constraints |
| Safety Planning for the Hajj Pilgrimage | Time-indexed scheduling with penalties |
| Arena Seating | One binary variable per seating group |
| Passenger Flow Control | Queue dynamics over time periods |

## What have we learned?

- How to **identify and abstract** real-world problems
- How to **start programming** in Julia
- How to **model and solve** optimization problems
- How to **question** model assumptions

. . .

> **Tip**
>
> That's a lot and a great foundation for a seminar or a master thesis!

## Check Yourself

Before the exam, you should be able to answer the following:

- Can you **define sets, parameters, and variables** for a new problem?
- Can you **choose the right variable domain** (continuous, integer, binary)?
- Can you **formulate objective functions and constraints** in JuMP?
- Do you know **when a model needs Big-M constraints**?
- Can you **explain what subtours are** and how to prevent them?
- Do you know the **difference between LP, MIP, and NLP**?

. . .

> **Tip**
>
> If some points feel shaky, revisit the linked lectures and take a look at the cheatsheets on the course website.

## 

Any questions

regarding the

past lectures?

------------------------------------------------------------------------

# <span class="flow">How to continue?</span>

## How to continue after the lecture?

- The best way is to <span class="highlight">keep programming and modeling</span>
- We offer **seminar places and master thesis supervision**
- Try to find a way to **apply programming in your work**
- There are **many interesting topics** to explore!

. . .

> **Tip**
>
> Getting your managers on board is the hardest part! But note that it is often worth it. The tools we have used are all free and open-source.

## Concrete Next Steps

- Ask questions on the [Julia Discourse forum](https://discourse.julialang.org)
- Explore the **JuMP community** at [jump.dev](https://jump.dev)
- Contribute to open-source, e.g. **"good first issues"** of JuMP
- Start a **small personal project** using the tools learned

. . .

> **Tip**
>
> Project ideas at the right scale: a schedule for your sports league, a weekly meal plan on a budget, or a shift roster for a student job.

## Start Pair Programming with AI

- First, try to <span class="highlight">be confident with the basics</span> of a language
- Always try to <span class="highlight">understand the code you use</span>
- Then, try an **AI-assisted IDE or coding agent**

. . .

> **Tip**
>
> The tools change fast; popular options are, for example, Cursor, GitHub Copilot, and Claude Code. They make work much easier compared to copying and pasting code between a chat and your editor.

------------------------------------------------------------------------

# <span class="flow">Final Words</span>

## That's it for the Lecture Series!

- I hope you **enjoyed** the lecture and found it **helpful**
- In the last tutorial, we will have a final <span class="highlight">discussion session</span>
- There, you can earn the **last half-bonus point** for the exam
- I wish you **all the best for your studies and your career!**

. . .

> **Note**
>
> If you have any questions on optimization in the future, feel free to contact me!

## 

Questions?

## Thank You!

<center>
<iframe src="https://giphy.com/embed/YVg3fCdaBpLEc" width="480" height="355" style frameBorder="0" class="giphy-embed" allowFullScreen>
</iframe>
</center>

Thank you for participating in the course --- good luck with the exam!

[^1]: Original problem structure we <span class="highlight">used/extended/exploited</span> to address the topic.
