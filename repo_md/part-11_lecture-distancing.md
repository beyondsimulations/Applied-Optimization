# Lecture XI - Arena Seat Planning under Distancing Rules
Dr. Tobias Vlćek

# <span class="flow">Introduction</span>

## <span class="invert-font">Covid-19 Pandemic</span>

<div class="footer">

</div>

## Challenges for Live Events

- Overall number of participants at events **was restricted**
- Certain **spacing between participants** had to be ensured  
- Larger events required **vaccination certificates** for all

. . .

<span class="question">Question:</span> **What are the main issues for
the organizers?**

## Main Difficulties

- Organization of larger events **is costly**
- Even without a pandemic a **financial risk**
- **Administrative Burden** for vaccination certificates
- Reduced capacity is a **loss of revenue**
- Implementing and enforcing **distancing rules**
- Managing **different priorities** of groups

## <span class="invert-font">Idea: Optimizing Seating Plans</span>

<div class="footer">

</div>

## Background

- **Applications:** sport arenas, concert halls, movie theaters, lecture
  halls, etc.
- People from the same group are **seated together**
- Venues have **specific seating**, season tickets, VIPs, etc.

. . .

> [!IMPORTANT]
>
> Optimizing seating plans can help to **maximize revenue** while
> ensuring distancing rules and other constraints are met.

------------------------------------------------------------------------

# <span class="flow">Problem Structure</span>

## Example: Two different plans

<div class="columns">

<div class="column" width="45%">

![Fixed double-seat
layout](https://images.byndsim.com/ao/ao_arena-layout_starr.png)

</div>

<div class="column" width="10%">

</div>

<div class="column" width="45%">

![Flexible group-value
layout](https://images.byndsim.com/ao/ao_arena-layout_flex.png)

</div>

</div>

------------------------------------------------------------------------

## Different Approaches Possible

1.  Operational
2.  Tactical
3.  Strategic

. . .

<span class="question">Question:</span> **What are these approaches in
general and how do they relate to arena seating?**

## Operational

- **Short-term**, day-to-day decisions
- Focused on <span class="highlight">immediate execution</span>

. . .

<span class="question">Question:</span> **What is an example for this
approach?**

. . .

- Given **tomorrow’s demand** of differently sized groups
- Score groups (importance, sponsors, VIP, season ticket,…)
- Assigning specific seats for **tomorrow’s event**

## Tactical

- **Medium-term** planning (weeks to months)
- Bridges operational and strategic levels

. . .

<span class="question">Question:</span> **What is an example for this
approach?**

. . .

- Given distribution of **expected demand** for groups
- Score groups (importance, sponsors, VIP, season ticket,…)
- Plan seating arrangements for an **upcoming season**

## Strategic

- Long-term planning (months to years)
- Focus on overall goals and policies

. . .

<span class="question">Question:</span> **What is an example for this
approach?**

. . .

- Designing flexible seating layouts that work for scenarios
- Maximize the overall **space utilization**
- Sell the resulting maximized seating pattern on **market**

------------------------------------------------------------------------

## <span class="invert-font">Main Question</span>

<span class="invert-font"><span class="task">Task:</span> **Fill the
seating area given distancing regulations and venue-specific
constraints.**</span>

<span class="fragment invert-font"><span class="question">Question:</span>
**Any ideas on how to approach this?**</span>

<div class="footer">

</div>

# <span class="flow">Knapsack</span>

## Knapsack Problem

![](https://images.byndsim.com/ao/ao_arena-knapsack.svg)

- <span class="highlight">Standard model in Operations Research</span>
- **Select items** from a pool under **capacity constraints**

## Knapsack Problem in 2D

![](https://images.byndsim.com/ao/ao_arena-knapsack_2d.svg)

- Now, Items block space in 2D, as illustrated here

## Adaption to Seating

- Horizontal dimension to place groups of participants
- Vertical dimension to ensure enough spacing between rows
- Maximize the “value” of the allocated groups
- Value can be the number of seats or a score

. . .

> [!NOTE]
>
> Idea behind the model was developed by [Dr. Matthes
> Koch](https://www.desior.net/).

------------------------------------------------------------------------

## Hands-on Exercise

<span class="task">Task:</span> **Allocate as many high-value groups as
possible.**

![](https://images.byndsim.com/ao/ao_arena-empty_exercise.svg)

## Available Groups

| Grouptype | Req. Seats | Score | Available | Allocated | Value |
|-----------|------------|-------|-----------|-----------|-------|
| a         | 1          | 1     | 3         |           |       |
| b         | 2          | 2     | 2         |           |       |
| c         | 2          | 4     | 3         |           |       |
| d         | 4          | 4     | 5         |           |       |
| e         | 4          | 5     | 2         |           |       |
| f         | 6          | 6     | 1         |           |       |
| g         | 6          | 12    | 1         |           |       |
| **Total** |            |       |           |           |       |

## Seating Constraints

- 1 empty seat **between** groups
- 1 empty seat **front-to-back**
- 1 empty seat **diagonally**
- Only **2 groups per row** are allowed
- Grey seats represent **obstacles**

. . .

You have 5 minutes to find a solution.

<span class="question">Question:</span> **What is your total score?**

------------------------------------------------------------------------

# <span class="flow">Model Formulation</span>

## Sets?

<span class="question">Question:</span> **What could be the sets?**

. . .

- $\mathcal{G}$ - Set of groups, indexed by $g$
- $\mathcal{R}$ - Set of rows, indexed by $r$
- $\mathcal{C}$ - Set of columns, indexed by $c$
- $\mathcal{C}_{g,r}$ - Available seats of row $r$ for group $g$,
  indexed by $c$

. . .

> [!NOTE]
>
> $\mathcal{C}_r$ ensures that we only consider unblocked seats in each
> row.

## Parameters?

<span class="question">Question:</span> **What could be possible
parameters?**

. . .

- $p_r$ - Maximal number of groups allowed in one row $r$
- $d_g$ - Required seats of a group $g$ in a row
- $h$ - Safety distance between groups sitting next to each other
- $b$ - Vertical safety distance between groups
- $v_g$ - Value of an allocation of the group $g$

------------------------------------------------------------------------

# <span class="flow">Variables and Objective</span>

## Decision Variable?

> [!IMPORTANT]
>
> ### Our goal is to:
>
> Maximize the group values by filling the seating area given distancing
> regulations between groups and venue-specific constraints.

> [!TIP]
>
> Each group is represented by **one binary variable**. We don’t need to
> block each seat explicitly with a binary variable!

## Decision Variable

> [!NOTE]
>
> ### We need the following sets:
>
> - All the groups, $g \in \mathcal{G}$
> - All the rows, $r \in \mathcal{R}$
> - All the columns, $c \in \mathcal{C}$

<span class="question">Question:</span> **What could be our decision
variable?**

. . .

- $X_{g,r,c}$ - 1, if **first left seat** of $g$ is assigned to $r$ in
  $c$, else 0

------------------------------------------------------------------------

## Objective Function?

> [!IMPORTANT]
>
> ### Our main objective is to:
>
> Maximize the group values by filling the seating area given distancing
> regulations between groups and venue-specific constraints.

. . .

<span class="question">Question:</span> **How again are groups
allocated?**

. . .

- By the allocation of the **first left seat** of a group to a row and
  column in the seating area

## Objective Function

> [!NOTE]
>
> ### We need the following parameters and variables:
>
> - $v_g$ - Value of an allocation of the group $g$
> - $X_{g,r,c}$ - 1, if **first left seat** of $g$ is assigned to $r$ in
>   $c$, else 0

. . .

<span class="question">Question:</span> **What could be our objective
function?**

. . .

$$
\text{maximize} \quad \sum_{g \in \mathcal{G}} \sum_{r \in \mathcal{R}} \sum_{c\in \mathcal{C}_{g,r}} v_g \times X_{g,r,c}
$$

------------------------------------------------------------------------

# <span class="flow">Constraints</span>

## Necessary Constraints

<span class="question">Question:</span> **What constraints do we need?**

. . .

- Assign **each group only once**
- Restrict the **number of groups in each row**
- Ensure the **horizontal social distance**
- Keep the **vertical social distance**

------------------------------------------------------------------------

## Assign Each Group Only Once?

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Ensure that each group is allocated only once in the entire seating
> area.

. . .

> [!NOTE]
>
> ### We need the following:
>
> - $X_{g,r,c}$ - 1, if first left seat of $g$ is assigned to $r$ in
>   $c$, else 0
> - $\mathcal{G}$ - Set of groups, indexed by $g$
> - $\mathcal{R}$ - Set of rows, indexed by $r$
> - $\mathcal{C}_{g,r}$ - Set of columns of row $r$ for group $g$,
>   indexed by $c$

## Assign Each Group Only Once

<span class="question">Question:</span> **What could be the
constraint?**

. . .

$$
\sum_{r \in \mathcal{R}} \sum_{c \in \mathcal{C}_{g,r}} X_{g,r,c} \leq 1 \quad \forall g \in \mathcal{G}
$$

. . .

> [!NOTE]
>
> This “set packing” constraint ensures that a group is only **assigned
> once**.

------------------------------------------------------------------------

## Restrict Groups Per Row?

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Ensure that the number of groups in each row does not exceed the
> maximum allowed number of groups.

. . .

> [!NOTE]
>
> ### We need the following:
>
> - $p_r$ - Maximal number of groups allowed in one row $r$
> - $X_{g,r,c}$ - 1, if first left seat of $g$ is assigned to $r$ in
>   $c$, else 0

## Restrict Groups Per Row

<span class="question">Question:</span> **What could be the
constraint?**

. . .

$$
\sum_{g\in \mathcal{G}}\sum_{c\in \mathcal{C}_{g,r}} X_{g,r,c} \leq p_{r} \quad r \in \mathcal{R}
$$

. . .

> [!NOTE]
>
> We want to place as **many highly scoring groups as possible**, but
> people need to move to buy drinks or use restroom. Depending on the
> venue, they should **not cross other groups** in the **same row**.

## 

<div class="r-fit-text">

The last two

constraints are

somewhat tricky!

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

# <span class="flow">Social Distance Implementation</span>

## Central Idea

![](https://images.beyondsimulations.com/ao/ao_arena-two_groups.png)

. . .

> [!TIP]
>
> Assume **one seat between groups must be kept empty**. If one group
> takes seat 8, it uses seats 8 and 9. We thus **cannot allocate**
> another group of size 2 to seats 6, 7 or 8.

## Horizontal Social Distance?

<span class="question">Question:</span> **Any ideas how to implement
this?**

. . .

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Ensure that the horizontal social distance is maintained between
> groups.

. . .

> [!NOTE]
>
> ### We need the following:
>
> - $X_{g,r,c}$ - 1, if first left seat of $g$ is assigned to $r$ in
>   $c$, else 0
> - $d_g$ - Required seats of group $g$ in a row
> - $h$ - Safety distance between groups sitting next to each other

------------------------------------------------------------------------

## Horizontal Social Distance

As the constraint is based on a rather complex set, you don’t have to
find it by yourself.

. . .

$$\sum_{g \in \mathcal{G}} \sum_{\tilde{c} \in \tilde{\mathcal{C}}_{c,g}} X_{g,r,\tilde{c}} \leq 1 \quad \forall r\in \mathcal{R}, c\in \mathcal{C}$$

. . .

> [!NOTE]
>
> At first glance, this constraint <span class="highlight">looks rather
> easy</span>, but it is not - it is based on the set
> $\mathcal{C}_{c,g}$ not defined yet in the lecture.

## The Social Distancing Set

$$\tilde{\mathcal{C}}_{c,g} = \{\tilde{c}\in \mathcal{C}| c - d_g + 1 - h \leq \tilde{c} \leq c \}$$

. . .

> [!NOTE]
>
> ### Remember:
>
> - $d_g$ - Required seats of group $g$ in a row
> - $h$ - Safety distance between groups sitting next to each other

. . .

<span class="question">Question:</span> **Can anybody explain the set?**

## Example: Two Groups

![](https://images.beyondsimulations.com/ao/ao_arena-two_groups.png)

$$\underbrace{X_{1,2,\textbf{6}}+X_{1,2,\textbf{7}}+X_{1,2,\textbf{8}}}_{g=1} + \underbrace{X_{2,2,\textbf{6}}+X_{2,2,\textbf{7}}+X_{2,2,\textbf{8}}}_{g=2} \leq 1 \quad (r=2,c=8)$$

## Example: Different Group Sizes

![](https://images.beyondsimulations.com/ao/ao_arena-two_groups_b.png)

$$\underbrace{X_{1,2,\textbf{6}}+X_{1,2,\textbf{7}}+X_{1,2,\textbf{8}}}_{g=1} + \underbrace{X_{2,2,\textbf{5}}+X_{2,2,\textbf{6}}+X_{2,2,\textbf{7}}+X_{2,2,\textbf{8}}}_{g=2} \leq 1 \quad (r=2,c=8)$$

## Example: Three Groups

![](https://images.beyondsimulations.com/ao/ao_arena-three_groups.png)

<div class="temp-math-size">

<style>
.temp-math-size .math.display .MathJax  {
  font-size: 85% !important;
}
</style>

$$
\underbrace{X_{1,2,\textbf{6}}+X_{1,2,\textbf{7}}+X_{1,2,\textbf{8}}}_{g=1} + \underbrace{X_{2,2,\textbf{6}}+X_{2,2,\textbf{7}}+X_{2,2,\textbf{8}}}_{g=2} + \underbrace{X_{3,2,\textbf{5}}+X_{3,2,\textbf{6}}+X_{3,2,\textbf{7}}+X_{3,2,\textbf{8}}}_{g=3} \leq 1 \quad (r=2,c=8)
$$

</div>

## 

<div class="r-fit-text">

Do you see

the pattern?

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

## Vertical Social Distance?

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Ensure that the vertical social distance is maintained between groups.

. . .

> [!NOTE]
>
> ### We need the following:
>
> - $b$ - Vertical safety distance between groups
> - $X_{g,r,c}$ - 1, if first left seat of $g$ is assigned to $r$ in
>   $c$, else 0

## Vertical Social Distance

<span class="question">Question:</span> **What could be the
constraint?**

. . .

> [!TIP]
>
> It is an extension of the horizontal social distance constraint we
> used before, but now we **block a rectangular area** instead of a
> single row.

. . .

$$
\sum_{g \in \mathcal{G}} \sum_{\tilde{r} \in \mathcal{R}_r} \sum_{\tilde{c} \in \tilde{\mathcal{C}}_{cg}} X_{g\tilde{r}\tilde{c}} \leq 1 \quad \forall r\in \mathcal{R}, c\in \mathcal{C}
$$

## Vertical Distance Set

<span class="question">Question:</span> **What could be the set?**

. . .

$$
\tilde{\mathcal{R}}_{r} = \{\tilde{r}\in \mathcal{R}| r-b \leq \tilde{r} \leq r \}
$$

. . .

> [!NOTE]
>
> Remember:
>
> - $b$ - Vertical safety distance between groups
> - $X_{g,r,c}$ - 1, if first left seat of $g$ is assigned to $r$ in
>   $c$, else 0

. . .

Let’s look at an <span class="highlight">example</span>.

## Example: Two Groups

![](https://images.beyondsimulations.com/ao/ao_arena-two_groups_vertical_b.png)

- Yellow seats are **blocked by the group** in row 3 and column 8
- Blue allocations are possible (if second group has **size 2**)

------------------------------------------------------------------------

## Arena Seating Problem

<div class="temp-math-size">

<style>
.temp-math-size .math.display .MathJax  {
  font-size: 85% !important;
}
</style>

$$
\text{maximize} \quad \sum_{g \in \mathcal{G}} \sum_{r \in \mathcal{R}} \sum_{c\in \mathcal{C}_r} v_g \times X_{g,r,c}
$$ subject to: $$
\begin{align*}
& \sum_{r \in \mathcal{R}}\sum_{c \in \mathcal{C}_r} X_{g,r,c} \leq 1 && \forall g \in \mathcal{G} \\
& \sum_{g \in \mathcal{G}}\sum_{c\in \mathcal{C}_r} X_{g,r,c} \leq p_r && \forall r \in \mathcal{R} \\
& \sum_{g \in \mathcal{G}} \sum_{\tilde{r} \in \tilde{\mathcal{R}}_{r}} \sum_{\tilde{c} \in \tilde{\mathcal{C}}_{c,g}} X_{g,\tilde{r},\tilde{c}} \leq 1 && \forall r\in \mathcal{R}, c\in \mathcal{C} \\
& X_{g,r,c} \in \{0,1\} && \forall g \in \mathcal{G}, \forall r\in \mathcal{R}, c\in \mathcal{C}_r
\end{align*}
$$

</div>

------------------------------------------------------------------------

# <span class="flow">Model Characteristics</span>

## Characteristics

<span class="question">Questions:</span> **On model characteristics**

<div class="incremental">

- Is the model formulation linear/ non-linear?
- What kind of variable domains do we have?

</div>

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

<div class="incremental">

- What assumptions have we made?
- Is our approach strategic or tactical/operational?
- Have we considered all social distancing constraints?
- What about aisle seats?
- Can you think of any other real-world constraints?

</div>

------------------------------------------------------------------------

# <span class="flow">Implementation and Impact</span>

## <span class="invert-font">Arena Seating Optimization</span>

<div class="footer">

</div>

## Case study VfL Osnabrück

- Relegation Return Match in 2021
- 241 additional seats allocated (+12 percent)
- Compliance with all distancing requirements
- Approval from authorities

. . .

> [!IMPORTANT]
>
> Estimated additional revenue of **8,435 EUR** for one match.

## Seating Plan

![](https://images.beyondsimulations.com/ao/ao_arena-vfl_rechnung.png)

## Related Work

<span class="highlight">Similar studies</span> have been conducted
globally:

- US College-level venues, e.g. Football, Basketball, Hockey
- Music Hall Eindhoven
- Safe Seating Solutions platform
- General 2D-Knapsack applications

------------------------------------------------------------------------

# <span class="flow">Conclusion</span>

## Optimization Benefits

- Optimization enables **rapid generation and evaluation**
- We can easily adapt to **various distancing requirements**:
  - Horizontal and vertical spacing between groups
  - Groups per row limits
  - Aisle seat restrictions
  - Group size constraints
  - Multi-row group allocation

## Wrap Up

- <span class="highlight">Revenue optimization</span> through applied
  optimization
- **Increased participant capacity** vs basic approaches
- Flexible adaptation to **various distancing requirements**
- Can be adapted easily to **any seating requirements**

. . .

> [!NOTE]
>
> ### And that’s it for todays lecture!
>
> We now have covered the arena seating problem based on a real-world
> application and are ready to start solving the corresponding tasks in
> the upcoming tutorial.

## 

<div class="r-fit-text">

Questions?

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

# <span class="flow">Literature</span>

## Literature I

For more interesting literature to learn more about Julia, take a look
at the [literature list](../general/literature.qmd) of this course.
