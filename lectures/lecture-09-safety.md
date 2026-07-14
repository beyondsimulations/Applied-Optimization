---
title: Lecture IX - Safety Planning for the Islamic Pilgrimage
subtitle: Applied Optimization with Julia
author: Dr. Tobias Vlćek
format:
  revealjs:
    footer: ' {{< meta title >}} | {{< meta author >}} | [Home](lecture-09-safety.qmd)'
    output-file: lecture-09-presentation.html
---


# <span class="flow">Introduction</span>

## <span class="invert-font">Islamic Pilgrimage</span>

<span class="highlight">Question:</span> **Have you ever heard of the Hajj?**

## The Hajj

- **The great Islamic pilgrimage towards Mecca**
- The holy city is the **religious center** of the Islamic religion
- Located in the **Kingdom of Saudi Arabia**
- Each Muslim who is able should **perform Hajj once**
- <span class="highlight">Confined spaces</span> around the holy sites
- Only **a few million** people are allowed annually

## Learning Goals

After this lecture, you will be able to:

- Structure a real-world **scheduling problem**
- Use **subsets** to keep large models small
- Model time preferences with <span class="highlight">precomputed penalties</span>
- Limit **fluctuations** between consecutive periods

## Mina Tent City

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-mecca01.png" data-fig-alt="Aerial view of the Mina tent city near Mecca with thousands of white tents" />

## Mina Tent City

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-mecca03.png" data-fig-alt="Aerial close-up of white tents arranged in dense blocks in Mina" />

## The scope of the Hajj

- Pilgrimage is actually a <span class="highlight">multi-day journey</span>
- Involves a number of **different rituals at several ritual sites**
- Our efforts focused on the **Ramy al-Jamarat ritual**

. . .

> **Ramy al-Jamarat ritual**
>
> Pilgrims throw pebbles against three pillars, which symbolize the temptations of the devil. They repeat this ritual with small variations on four consecutive days.

## <span class="invert-font">Mina Tent City</span>

- 1.5--2 million people reside in the tent city
- Pilgrims repeatedly access the holy site
- Perform the Ramy al-Jamarat ritual
- Walk through a network of streets and pathways
- Later proceed to the Kaaba or return to the camp

## Time Preferences

- <span class="highlight">When to perform the ritual on each of the four days?</span>
- Pilgrims have different **time preferences**
  - Constrained by **arrival and departure** shuttle times
  - Extremely **hot at midday** quickly leading to exhaustion
  - Traditions play an **important role** in time preferences

. . .

<span class="question">Question:</span> **What could become a problem?**

## Risk: Overcrowding at Mina

- In aggregation, the time preferences are **clustered**
- **Popular peak times** dating back to the Prophet Mohammad
- Equates to a <span class="highlight">city-scale crowd of millions of people</span>
- Accessing **one central place** within only a few hours

. . .

> **Caution**
>
> **Uncoordinated** access within confined area can **escalate into crowd disasters**!

## Crowd Accidents

- **Historical incidents** of crowd disasters
- Resulted in **casualties and injuries**
- **High-density bottlenecks** on the way to the rituals
- Several <span class="highlight">critical points of congestion</span>
- Waiting times can lead to **hazardous conditions**

. . .

<span class="question">Question:</span> **What could we do to prevent this?**

# <span class="flow">Pedestrian Traffic</span>

## 

How is Hajj pedestrian

traffic different from the

regular urban pedestrian

traffic in cities?

## Pedestrian Traffic

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-pedtraf-1.png" style="width:100.0%" data-fig-alt="Urban street with individual pedestrians walking in many different directions" />

- Individuals and groups
- Multitude of destinations
- Mixing and formation
- Distractions

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-pedtraf-2.jpg" style="width:100.0%" data-fig-alt="Dense crowd of pilgrims moving together in the same direction" />

- Homogeneous groups
- Shared destination
- Higher densities
- Predictable

## Types of Pedestrian Flow

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-unidirectional_flow.png" style="width:30.0%" data-fig-alt="Diagram of a unidirectional pedestrian flow, everyone moving one way" />
<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-bidirectional_crossing_flow.png" style="width:30.0%" data-fig-alt="Diagram of two pedestrian flows crossing in opposite directions" />
<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-multidirectional_crossing_flow.png" style="width:30.0%" data-fig-alt="Diagram of multiple pedestrian flows crossing in several directions" />

. . .

<span class="question">Question:</span> **What is the most dangerous type here?**

. . .

> **Caution**
>
> **Multi-directional and intersecting flows** are the most dangerous type!

## Pilgrim Flows

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-jamarat_flow.png" data-fig-alt="Map of one-way pilgrim flows around the Jamarat bridge" />

> **General idea**
>
> Adhere to **one-way flow systems** and define path options for each camp under consideration of a unidirectional flow system.

# <span class="flow">Problem Structure</span>

## Objective?

<span class="question">Question:</span> **What could be the objective?**

- Minimize <span class="highlight">risk of overcrowding and accidents</span>
- **Enable ritual participation** of all pilgrims
- **Satisfy time preferences** of pilgrims
- **Easy plans to execute** under pressure

. . .

<span class="question">Question:</span> **How can we try to model this?**

## Objective

- Satisfy <span class="highlight">time preferences as much as possible</span>
- Consideration of **infrastructure bottleneck flow capacities**
- **Maximize safety** for all pilgrims
- **Simple plans** to make the execution as simple as possible
- This can **prevent critical errors** later on!

. . .

<span class="question">Question:</span> **Where is the goal conflict?**

## Goal Conflict

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-goalconflict.png" data-fig-alt="Diagram of the goal conflict between time preferences, safety, and simple plans" />

## Basic Structure

- We follow the structure of a **simple scheduling problem**
- The aim is to "assign" something to **different time periods**
- We assign <span class="highlight">time slots to groups using different paths</span>
- Plans are kept simpler by assigning **paths to camps**
- Assignments are **fixed over the entire time horizon**

## Pilgrim Routes

Each camp has a set of feasible one-way paths that include the stoning ritual.

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-m_a.svg" data-fig-alt="Schematic of a camp with several feasible one-way paths towards the stoning site" />

## Pilgrim Routes

A path may contain one or more bottlenecks, regarded as resources subject to a capacity.

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-m_b.svg" data-fig-alt="Schematic of the paths with bottleneck resources marked along the way" />

## Pilgrim Routes

Pilgrims depart from a camp at a time $t$ and pass through the bottleneck later.

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-m_c.svg" data-fig-alt="Schematic of a group departing the camp and reaching a bottleneck in a later period" />

## Pilgrim Routes

Our model should assign one of the feasible paths to a camp on all four ritual days.

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-m_d.svg" data-fig-alt="Schematic of one feasible path being assigned to a camp" />

## Pilgrim Routes

These bottlenecks should not be overcrowded at any time during the Hajj.

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-m_e.svg" data-fig-alt="Schematic combining camps, assigned paths, bottlenecks, and time periods" />

## 

How can we model

time preferences?

## Time Preferences

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-solap-1.png" data-fig-alt="Histogram of clustered pilgrim time preferences over the course of a day" />

## Time preference satisfaction

- Assign **one departure time slot**
- Assigned per ritual day to each pilgrim group
- <span class="highlight">Minimize difference between assigned and preferred time</span>
- Different **penalty functions** are possible

. . .

> **Group time preferences**
>
> May be computed, i.e., down-sampled given a distribution of pilgrims over time.

## Penalty Functions

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-satisfaction.svg" data-fig-alt="Different penalty functions around the preferred time, for example linear and quadratic" />

## Fluctuations

<span class="question">Question:</span> **What could become a problem?**

. . .

- If allowed demand between periods **varies strongly**, accidents are **more likely to happen!**
- We need to keep the <span class="highlight">changes between periods within bounds</span>

. . .

<span class="question">Question:</span> **Any idea how we can do that later?**

. . .

- Restrict the change of the utilization **between periods**

## Goals Summarized

1.  Satisfy **time preferences of the pilgrims** as much as possible under the consideration of **infrastructure bottleneck flow capacities** by assigning "something" to a time slot.
2.  For the sake of **simplicity and safety**, pilgrims coming from one camp will always have to be assigned **the same path**.
3.  We need to keep track of the **relative utilization** of each resource **to restrict the fluctuations** between periods to ensure a safer event.

# <span class="flow">Model Formulation</span>

## Sets?

<span class="question">Question:</span> **What could be the sets here?**

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-m_e.svg" data-fig-alt="Schematic combining camps, assigned paths, bottlenecks, and time periods" />

## Sets

- $\mathcal{T}$ - Stoning periods in ascending order, indexed by $t$
- $\mathcal{R}$ - Infrastructure resources, indexed by $r$
- $\mathcal{C}$ - Pilgrim camps, indexed by $c$
- $\mathcal{P}$ - Paths that include the stoning, indexed by $p$
- $\mathcal{S}$ - Scheduling groups, indexed by $s$

. . .

> **Note**
>
> A **scheduling group** is a group of pilgrims from one camp on **one specific ritual day**. One model thus covers all four days at once.

. . .

<span class="task">But we further need subsets!</span>

## Subsets

- $\mathcal{S}_c$ - Scheduling groups in camp $c$
- $\mathcal{S}_p$ - Scheduling groups that can use path $p$
- $\mathcal{P}_c$ - Feasible paths for camp $c$
- $\mathcal{P}_s$ - Feasible paths for group $s$
- $\mathcal{P}_r$ - Paths that contain the resource $r$
- $\mathcal{T}_s$ - Available stoning periods for group $s$ on its ritual day

## 

That looks

complicated...

## On Subsets

<span class="question">Question:</span> **Why use subsets?**

. . .

- It may seem **like a lot**
- But it also <span class="highlight">really helps a lot!</span>
- We **reduce the problem size**

. . .

> **Tip**
>
> A smaller problem size **reduces the solution space** and **helps the solver** in finding the optimal solution faster!

## Parameters?

<span class="question">Question:</span> **What could be possible parameters?**

. . .

- $n_s$ - Number of pilgrims in scheduling group $s$
- $f_{s,t}$ - Penalty value of assigning period $t$ to group $s$
- $a_{p,r}$ - Offset between stoning and utilization period of $r$ on $p$
- $b_{r,t}$ - Capacity of resource $r$ in period $t$
- $\sigma_r$ - max. change in relative utilization of $r$ between periods

## First Decision Variable?

> **Our first goal is to:**
>
> Satisfy time preferences of the pilgrims as much as possible under the consideration of infrastructure bottleneck flow capacities by assigning "something" to a time slot.

. . .

> **We need the following sets:**
>
> - Scheduling groups, $s \in \mathcal{S}$
> - Stoning periods in ascending order, $t \in \mathcal{T}$
> - Paths that include the stoning of the devil, $p \in \mathcal{P}$

## First Decision Variable

<span class="question">Question:</span> **What could be our decision variable?**

. . .

- $X_{s,t,p}$ - 1, if scheduling group $s$ is scheduled to perform stoning in period $t$ and to use path $p$, 0 otherwise.

. . .

<span class="question">Question:</span> **Do you get the idea here?**

. . .

It's a **binary assignment** of a group to a time slot and a path.

## Second Decision Variable?

> **Our second goal (more a constraint):**
>
> For the sake of **simplicity and safety**, pilgrims coming from one camp will always have to be assigned the same path.

. . .

> **We need the following sets:**
>
> - Pilgrim camps from which groups can depart, $c \in \mathcal{C}$
> - Paths that include the stoning of the devil, $p \in \mathcal{P}$

. . .

<span class="question">Question:</span> **What could be our second variable?**

## Second Decision Variable

- $Y_{c,p}$ - 1, if camp $c$ is assigned to use path $p$, 0 otherwise

. . .

<span class="question">Question:</span> **Does anyone remember the third part?**

## Third Decision Variable?

> **Our third goal (again, more a constraint):**
>
> We need to keep track of the relative utilization of each resource to restrict the fluctuations between periods to ensure a safer event.

. . .

> **We need the following sets:**
>
> - Infrastructure resources, $r \in \mathcal{R}$
> - Stoning periods in ascending order, $t \in \mathcal{T}$

. . .

<span class="question">Question:</span> **What could be our third variable?**

## Third Decision Variable

- $U_{r,t}$ - Relative utilization of $r$ in $t$ with $0 \leq U_{r,t} \leq 1$

. . .

<span class="question">Question:</span> **What does relative utilization mean?**

. . .

- It's a **percentage** of the capacity usage of the resource
- **Normalizes** the capacities between different resources

## 

Let's start with our

objective function!

## Objective Function?

> **Our main objective is to:**
>
> Satisfy time preferences of the pilgrims as much as possible under the consideration of infrastructure bottleneck flow capacities by assigning "something" to a time slot. **Hint:** We thus could aim to minimize the total dissatisfaction with the timetable.

. . .

<span class="question">Question:</span> **How could we minimize the total dissatisfaction?**

- **Penalize** difference between assigned and preferred time
- Different penalty functions, e.g., linear, quadratic, etc.

## Objective Function

> **We need the following parameters and variables:**
>
> - $f_{s,t}$ - Penalty value of assigning period $t$ to group $s$
> - $X_{s,t,p}$ - 1 if group $s$ is scheduled to perform stoning in $t$ and to use $p$, 0 otherwise

. . .

<span class="question">Question:</span> **What could be our objective function?**

. . .

$$\text{Minimize} \quad \sum_{s \in \mathcal{S}}\sum_{t \in \mathcal{T}_s}\sum_{p \in \mathcal{P}_s} f_{s,t} \times X_{s,t,p}$$

. . .

Note how we use the subsets $\mathcal{T}_s$ and $\mathcal{P}_s$ <span class="highlight">to keep the model small</span>.

## Objective Function Characteristics

<span class="question">Question:</span> **Is our objective function linear?**

. . .

- We can use **non-linear penalty functions**
- But still, it will always be **linear**

. . .

<span class="question">Question:</span> **Any idea why?**

. . .

- We can compute the **penalties in advance**
- Do **not** depend on the decision variables

# <span class="flow">Constraints</span>

## Constraints needed?

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-model_flow.svg" data-fig-alt="Diagram of groups, paths, and bottlenecks with the time shift between stoning and utilization" />

## Key Constraints

<span class="question">Question:</span> **Which constraints do we need?**

1.  Each group must have <span class="highlight">one path assigned</span>
2.  Each camp must have <span class="highlight">one path assigned</span>
3.  Each group must have <span class="highlight">one time slot assigned</span>
4.  Each resource must have <span class="highlight">a capacity limit</span>
5.  Constrain the <span class="highlight">relative utilization between periods</span>

## Assign Paths to Camps

> **The goal of this constraint is to:**
>
> Assign **one path to each camp** over the entire time horizon.

. . .

> **We need the following variables:**
>
> - $Y_{c,p}$ - 1 if camp $c$ is assigned to use path $p$, 0 otherwise

. . .

<span class="question">Question:</span> **What could be the constraint?**

$$\sum_{p \in \mathcal{P}_c} Y_{c,p} = 1 \quad \forall c \in \mathcal{C}$$

## Assign Time Slots to Groups?

> **The goal of this constraint is to:**
>
> Assign **one time slot to each group** over the entire time horizon **using the same path** we have assigned to the camp in the previous constraint.

. . .

> **We need the following variables:**
>
> - $X_{s,t,p}$ - 1 if group $s$ is scheduled to perform stoning in $t$ and to use $p$, 0 otherwise
> - $Y_{c,p}$ - 1 if camp $c$ is assigned to use path $p$, 0 otherwise

. . .

<span class="question">Question:</span> **What could be the constraint?**

## Assign Time Slots to Groups

$$\sum_{t \in \mathcal{T}_s} X_{s,t,p}  = Y_{c,p} \quad  \forall c \in \mathcal{C}, p \in \mathcal{P}_c, s \in \mathcal{S}_c$$

. . .

> **We use the following sets:**
>
> - $\mathcal{C}$ - Pilgrim camps
> - $\mathcal{S}_c$ - Scheduling groups in camp $c$
> - $\mathcal{T}_s$ - Available stoning periods for scheduling group $s$
> - $\mathcal{P}_c$ - Feasible paths for camp $c$
>
> Each group can use all feasible paths of its camp: $\mathcal{P}_s = \mathcal{P}_c$ for all $s \in \mathcal{S}_c$.

## One Path and Slot per Group?

<span class="question">Question:</span> **We wanted one path and one time slot per group. Where are these two constraints?**

. . .

Sum the last constraint over all paths of a camp:

$$\sum_{p \in \mathcal{P}_c} \sum_{t \in \mathcal{T}_s} X_{s,t,p} = \sum_{p \in \mathcal{P}_c} Y_{c,p} = 1 \quad \forall c \in \mathcal{C}, s \in \mathcal{S}_c$$

. . .

- Each group thus gets exactly <span class="highlight">one period and one path</span>
- Some constraints can **imply** other constraints!

## Relative Utilization and Capacities

> **The goal of this constraint is to:**
>
> Compute the relative utilization of each resource while also ensuring that the utilization does not exceed the capacity limit. <span class="highlight">This one is very tricky!</span>

. . .

<span class="highlight">Difficulties:</span>

- Includes the time-shift between stoning and utilization
- Used as parameter to shift periods in variable $X_{s,t,p}$

## Compute Relative Utilization?

> **We need the following:**
>
> - $n_s$ - Number of pilgrims in scheduling group $s$
> - $a_{p,r}$ - Period offset between stoning period and utilization period of $r$ on $p$
> - $b_{r,t}$ - Capacity of resource $r$ in period $t$ in number of pilgrims
> - $X_{s,t,p}$ - 1, if $s$ is scheduled to perform stoning in $t$ and to use $p$, 0 else
> - $U_{r,t}$ - Relative utilization of resource $r$ in period $t$ with $0 \leq U_{r,t} \leq 1$

. . .

<span class="question">Question:</span> **What could be the constraint?**

## Compute Relative Utilization

$$\sum_{p \in \mathcal{P}_r}\sum_{s \in \mathcal{S}_p} n_s \times X_{s,t-a_{p,r},p}  = b_{r,t}\times U_{r,t} \quad \forall r \in \mathcal{R}, t \in \mathcal{T}$$

. . .

> **Convention**
>
> Terms where the shifted period $t - a_{p,r}$ lies outside of $\mathcal{T}_s$ are simply dropped, as no group can be scheduled for stoning there.

## Where is the Capacity Limit?

<span class="question">Question:</span> **We promised a capacity limit, but there is no "$\leq$ capacity" constraint. Why does it still hold?**

. . .

- It is <span class="highlight">hidden in the variable bound</span> $U_{r,t} \leq 1$
- The equality forces the flow to equal $b_{r,t} \times U_{r,t}$
- Hence, the flow on $r$ can never exceed the capacity $b_{r,t}$

. . .

> **Tip**
>
> A variable domain and a constraint can **combine** into a constraint that is never written down explicitly.

## 

Let's pause!

Have you understood

this part?

## How does the shift work?

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-model_flow.svg" data-fig-alt="Diagram of groups, paths, and bottlenecks with the time shift between stoning and utilization" />

## Fluctuation Bounds?

> **The goal of this constraint is to:**
>
> Keep the relative utilization of each resource within bounds to ensure a safer event.

. . .

> **We need the following:**
>
> - $\sigma_r$ - max. change in relative utilization of $r$ between periods
> - $U_{r,t}$ - Relative utilization of resource $r$ in period $t$ with $0 \leq U_{r,t} \leq 1$

. . .

<span class="question">Question:</span> **What could be the constraint?**

## Fluctuation Bounds

$$U_{r,t} - U_{r,t-1} \leq \sigma_r \quad \forall r \in \mathcal{R}, t \in \mathcal{T}: t > 1$$

$$U_{r,t-1} - U_{r,t} \leq \sigma_r \quad \forall r \in \mathcal{R}, t \in \mathcal{T}: t > 1$$

. . .

## Why Does This Work?

<span class="question">Question:</span> **Can somebody explain why this works?**

. . .

- Each constraint limits the **change**
- The first one limits the **increase**
- The second one limits the **decrease**
- We start at $t > 1$, as no period exists before the first one

## Scheduling Problem I

subject to:

## Scheduling Problem II

> **Note**
>
> Restricting the **relative utilization** of each resource to a certain bound.

## Scheduling Problem III

> **Note**
>
> All variables, except for $U_{r,t}$, are binary.

# <span class="flow">Model Characteristics</span>

## Characteristics

<span class="question">Questions:</span> **On model characteristics**

- Is the model formulation linear/ non-linear?
- What kind of variable domains do we have?
- Have we specified the length of a period?

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

- What assumptions have we made?
- What are likely issues that can arise if applied?
- How can we measure flow capacities?
- Are all pilgrims equally fast?

. . .

> **Important**
>
> Capacities are **hard limits**: if demand exceeds them, the model becomes <span class="highlight">infeasible</span> and refuses to produce an unsafe plan. This is a feature, not a bug!

## Capacity Buffers

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-capacitybuffers.png" data-fig-alt="Chart of capacity buffers kept between planned utilization and the full capacity" />

# <span class="flow">Implementation and Impact</span>

## 

Can this be

applied?

## 

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-solap-1.png" data-fig-alt="Histogram of clustered pilgrim time preferences over the course of a day" />

## 

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-solap-5.png" data-fig-alt="Comparison of preferred and scheduled departure times after optimization, with peaks flattened" />

## Implementation

- Optimization **part of a bigger picture**
- Many projects with several disciplines involved
- E.g. Simulations, infrastructure projects, real-time monitoring, contingency plans, awareness campaigns, ...

. . .

> **Note**
>
> Optimization was part of a project by Knut Haase and his team (Haase et al. 2016).

## 

<img src="https://images.beyondsimulations.com/ao/ao_pilgrim-media_coverage.png" data-fig-alt="Collage of newspaper articles covering the Hajj scheduling project" />

## Wrap Up

> **And that's it for today's lecture!**
>
> We now have covered a scheduling problem based on a real-world application and are ready to start solving some new tasks in the upcoming tutorial.

## 

Questions?

# <span class="flow">Literature</span>

## Literature I

To learn more about the project and crowd management during the Hajj, take a look at Haase et al. (2016) and the [literature list](../general/literature.qmd) of this course.

Haase, Knut, Habib Zain Al Abideen, Salim Al-Bosta, et al. 2016. "Improving Pilgrim Safety During the Hajj: An Analytical and Operational Research Approach." *Interfaces* 46 (1): 74--90.
