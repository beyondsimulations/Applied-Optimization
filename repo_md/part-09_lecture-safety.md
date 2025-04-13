# Lecture IX - Safety Planning for the Islamic Pilgrimage
Dr. Tobias Vlćek

## 

<img src="../general/QRCode_P5X3Q.png" data-fig-align="center" />

Please take a moment at the start of the lecture to fill out the
<span class="highlight">lecture evaluation survey</span>. Thanks!

# <span class="flow">Introduction</span>

## <span class="invert-font">Islamic Pilgrimage</span>

<div class="fragment invert-font">

<span class="question">Question:</span> **Have you ever heard of the
Hajj?**

</div>

<div class="footer">

</div>

## The Hajj

- **The great Islamic pilgrimage towards Mecca**
- The holy city is the **religious center** of the Islamic religion
- Located in the **Kingdom of Saudi Arabia**
- Each physically able Muslim should **perform Hajj once**
- <span class="highlight">Confined spaces</span> around the holy sites
- Only **few million** people are annually allowed

## Mina Tent City

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-mecca01.png"
data-fig-align="center" />

## Mina Tent City

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-mecca03.png"
data-fig-align="center" />

## The scope of the Hajj

- Pilgrimage is actually a <span class="highlight">multi-day
  journey</span>
- Involves a number of **different rituals at several ritual sites**
- Our efforts focused on the **Rhamy-Al-Jamarat ritual**

. . .

> [!CAUTION]
>
> ### Rhamy-Al-Jamarat ritual
>
> Pilgrims throw pebbles against three pillars, which symbolize the
> temptations of the devil. They repeat this ritual with small
> variations on four consecutive days.

## <span class="invert-font">Mina Tent City</span>

<div class="fragment invert-font">

- 1.5–2 million people reside in the tent city
- Pilgrims repeatedly access the holy site
- Perform the Rhamy-Al-Jamarat ritual
- Walk through a network of streets and pathways
- Later proceed to the Kaaba or return to the camp

</div>

<div class="footer">

</div>

## Time Preferences

- <span class="highlight">When to perform the ritual on each of the four
  days?</span>
- Pilgrims have different **time preferences**
  - Constrained by **arrival and departure** shuttle times
  - Extremely **hot at midday** quickly leading to exhaustion
  - Traditions play an **important role** in time preferences

. . .

<span class="question">Question:</span> **What could become a problem?**

## Risk: Overcrowding at Mina

- In aggregation, the time preferences are **clustered**
- **Popular peak times** dating back to the Prophet Mohammad
- Equates to a <span class="highlight">city-scale crowd of millions of
  people</span>
- Accessing **one central place** within only a few hours

. . .

> [!CAUTION]
>
> **Uncoordinated** access within confined area can **escalate into
> crowd disasters**!

## Crowd Accidents

- **Historical incidents** of crowd disasters
- Resulted in **casualties and injuries**
- **High-density bottlenecks** on the way to the rituals
- Several <span class="highlight">critical points of congestion</span>
- Waiting times can lead to **hazardous conditions**

. . .

<span class="question">Question:</span> **What could we do to prevent
this?**

# <span class="flow">Pedestrian Traffic</span>

## 

<div class="r-fit-text">

How is Hajj pedestrian

traffic different from the

regular urban pedestrian

traffic in cities?

</div>

<div class="footer">

</div>

## Pedestrian Traffic

<div class="columns">

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-pedtraf-1.png"
style="width:100.0%" />

- Individuals and groups
- Multitude of destinations
- Mixing and formation
- Distractions

</div>

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-pedtraf-2.jpg"
style="width:100.0%" />

- Homogeneous groups
- Shared destination
- Higher densities
- Predictable

</div>

</div>

## Types of Pedestrian Flow

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-unidirectional_flow.png"
style="width:30.0%" alt="1." /> <img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-bidirectional_crossing_flow.png"
style="width:30.0%" alt="2." /> <img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-multidirectional_crossing_flow.png"
style="width:30.0%" alt="3." />

. . .

<span class="question">Question:</span> **What is the most dangerous
type here?**

. . .

> [!CAUTION]
>
> **Multi-directional and intersecting flows** are the most dangerous
> type!

## Pilgrim Flows

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-jamarat_flow.png"
data-fig-align="center" />

> [!NOTE]
>
> ### General idea
>
> Adhere to **one-way flow systems** and define path options for each
> camp under consideration of a unidirectional flow system.

# <span class="flow">Problem Structure</span>

## Objective?

<span class="question">Question:</span> **What could be the objective?**

<div class="incremental">

- Minimize <span class="highlight">risk of overcrowding and
  accidents</span>
- **Enable ritual participation** of all pilgrims
- **Satisfy time preferences** of pilgrims
- **Easy plans to execute** under pressure

</div>

. . .

<span class="question">Question:</span> **How can we try to model
this?**

## Objective

- Satisfy <span class="highlight">time preferences as much as
  possible</span>
- Consideration of **infrastructure bottleneck flow capacities**
- **Maximize safety** for all pilgrims
- **Simple plans** to make the execution as simple as possible
- This can **prevent critical errors** later on!

. . .

<span class="question">Question:</span> **Where is the goal conflict?**

## Goal Conflict

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-goalconflict.png"
data-fig-align="center" />

## Basic Structure

- We follow the structure of a **simple scheduling problem**
- The aim is to “assign” something to **different time periods**
- We assign <span class="highlight">time slots to groups using different
  paths</span>
- Plans are kept simpler by assigning **paths to camps**
- Assignments are **fixed over the entire time horizon**

## Pilgrim Routes

Each camp has a set of feasible one-way paths that include the stoning
ritual.

![](https://images.beyondsimulations.com/ao/ao_pilgrim-m_a.svg)

## Pilgrim Routes

Path may contain one or more bottlenecks, regarded as resources subject
to a capacity.

![](https://images.beyondsimulations.com/ao/ao_pilgrim-m_b.svg)

## Pilgrim Routes

Pilgrims departure from a camp at a time $x$ and pass through the
bottleneck later.

![](https://images.beyondsimulations.com/ao/ao_pilgrim-m_c.svg)

## Pilgrim Routes

Our model should assign one of the feasible paths to a camp on all four
ritual days.

![](https://images.beyondsimulations.com/ao/ao_pilgrim-m_d.svg)

## Pilgrim Routes

These bottlenecks should not be overcrowded at any time during the Hajj.

![](https://images.beyondsimulations.com/ao/ao_pilgrim-m_e.svg)

## 

<div class="r-fit-text">

How can we model

time preferences?

</div>

<div class="footer">

</div>

## Time Preferences

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-solap-1.png"
data-fig-align="center" />

## Time preference satisfaction

- Assign **one departure time slot**
- Assigned per ritual day to each pilgrim group
- <span class="highlight">Minimize difference between assigned and
  preferred time</span>
- Different **penalty functions** are possible

. . .

> [!NOTE]
>
> ### Group time preferences
>
> May be computed, i.e., down-sampled given a distribution of pilgrims
> over time.

## Penalty Functions

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-satisfaction.svg"
data-fig-align="center" />

## Fluctuations

<span class="question">Question:</span> **What could become a problem?**

. . .

- If allowed demand between periods **varies strongly**, accidents are
  **more likely to happen!**
- We need keep the <span class="highlight">changes between periods
  within bounds</span>

. . .

<span class="question">Question:</span> **Any idea how we can do that
later?**

. . .

- Restrict the change of the utilization **between periods**

## Goals Summarized

<div class="incremental">

1.  Satisfy **time preferences of the pilgrims** as much as possible
    under the consideration of **infrastructure bottleneck flow
    capacities** by assigning “something” to a time slot.
2.  For the sake of **simplicity and safety**, pilgrims coming from one
    camp will always have to be assigned **the same path**.
3.  We need to keep track of the **relative utilization** of each
    resource **to restrict the fluctuations** between periods to ensure
    a safer event.

</div>

# <span class="flow">Model Formulation</span>

## Sets?

<span class="question">Question:</span> **What could be the sets here?**

![](https://images.beyondsimulations.com/ao/ao_pilgrim-m_e.svg)

## Sets

- $\mathcal{T}$ - Stoning periods in ascending order, indexed by $t$
- $\mathcal{R}$ - Infrastructure resources, indexed by $r$
- $\mathcal{C}$ - Pilgrim camps, indexed by $c$
- $\mathcal{P}$ - Paths that include the stoning, indexed by $p$
- $\mathcal{S}$ - Scheduling groups, indexed by $s$

. . .

<span class="task">But we further need subsets!</span>

## Subsets

- $\mathcal{S}_c$ - Scheduling groups in camp $c$
- $\mathcal{S}_p$ - Scheduling groups that can use path $p$
- $\mathcal{P}_c$ - Feasible paths for camp $c$
- $\mathcal{P}_s$ - Feasible paths for group $s$
- $\mathcal{P}_r$ - Paths that contain the resource $r$
- $\mathcal{T}_s$ - Available stoning periods for scheduling group $s$

## 

<div class="r-fit-text">

That looks

complicated…

</div>

<div class="footer">

</div>

## On Subsets

<span class="question">Question:</span> **Why use subsets?**

. . .

- It may seem **like a lot**
- But it also <span class="highlight">really helps a lot!</span>
- We **reduce the problem size**

. . .

> [!TIP]
>
> A smaller problem size **reduces the solution space** and **helps the
> solver** in finding the optimal solution faster!

## Parameters?

<span class="question">Question:</span> **What could be possible
parameters?**

. . .

- $n_s$ - Number of pilgrims in scheduling group $s$
- $f_{s,t}$ - Penalty value of assigning period $t$ to group $s$
- $a_{p,r}$ - Offset between stoning and utilization period of $r$ on
  $p$
- $b_{r,t}$ - Capacity of resource $r$ in period $t$
- $\sigma_r$ - max. relative utilization deviation between $t$ for $r$

## First Decision Variable?

> [!IMPORTANT]
>
> ### Our first goal is to:
>
> Satisfy time preferences of the pilgrims as much as possible under the
> consideration of infrastructure bottleneck flow capacities by
> assigning “something” to a time slot.

. . .

> [!NOTE]
>
> ### We need the following sets:
>
> - Scheduling groups, $s \in \mathcal{S}$
> - Stoning periods in ascending order, $t \in \mathcal{T}$
> - Paths that include the stoning of the devil, $p \in \mathcal{P}$

## First Decision Variable

<span class="question">Question:</span> **What could be our decision
variable?**

. . .

- $X_{s,t,p}$ - 1, if scheduling group $s$ is scheduled to perform
  stoning in period $t$ and to use path $p$, 0 otherwise.

. . .

<span class="question">Question:</span> **Do you get the idea here?**

. . .

It’s a **binary assignment** of a group to a time slot and a path.

## Second Decision Variable?

> [!IMPORTANT]
>
> ### Our second goal (more a constraint):
>
> For the sake of **simplicity and safety**, pilgrims coming from one
> camp will always have to be assigned the same path.

. . .

> [!NOTE]
>
> ### We need the following sets:
>
> - Pilgrim camps from which groups can depart, $c \in \mathcal{C}$
> - Paths that include the stoning of the devil, $p \in \mathcal{P}$

. . .

<span class="question">Question:</span> **What could be our second
variable?**

## Second Decision Variable

- $Y_{c,p}$ - 1, if camp $c$ is assigned to use path $p$, 0 otherwise

. . .

<span class="question">Question:</span> **Does anyone remember the third
part?**

## Third Decision Variable?

> [!IMPORTANT]
>
> ### Our third goal (again, more a constraint):
>
> We need to keep track of the relative utilization of each resource to
> restrict the fluctuations between periods to ensure a safer event.

. . .

> [!NOTE]
>
> ### We need the following sets:
>
> - Infrastructure resources, $r \in \mathcal{R}$
> - Stoning periods in ascending order, $t \in \mathcal{T}$

. . .

<span class="question">Question:</span> **What could be our third
variable?**

## Third Decision Variable

- $U_{r,t}$ - Relative utilization of $r$ in $t$ with
  $0 \leq U_{rt} \leq 1$

. . .

<span class="question">Question:</span> **What does relative utilization
mean?**

. . .

- It’s a **percentage** of the capacity usage of the resource
- **Normalizes** the capacities between different resources

## 

<div class="r-fit-text">

Let’s start with our

objective function!

</div>

<div class="footer">

</div>

## Objective Function?

> [!IMPORTANT]
>
> ### Our main objective is to:
>
> Satisfy time preferences of the pilgrims as much as possible under the
> consideration of infrastructure bottleneck flow capacities by
> assigning “something” to a time slot. **Hint:** We thus could aim to
> minimize the total dissatisfaction with the timetable.

. . .

<span class="question">Question:</span> **How could we minimize the
total dissatisfaction?**

<div class="incremental">

- **Penalize** difference between assigned and preferred time
- Different penalty functions, e.g., linear, quadratic, etc.

</div>

## Objective Function

> [!NOTE]
>
> ### We need the following parameters and variables:
>
> - $f_{s,t}$ - Penalty value of assigning period $t$ to group $s$
> - $X_{s,t,p}$ - 1 if group $s$ is scheduled to perform stoning in $t$
>   and to use $p$, 0 otherwise

. . .

<span class="question">Question:</span> **What could be our objective
function?**

. . .

$$
\text{minimize} \quad \sum_{s \in \mathcal{S}}\sum_{t \in \mathcal{T}}\sum_{p \in \mathcal{P}} f_{s,t} \times X_{s,t,p}
$$

## Objective Function Characteristics

<span class="question">Question:</span> **Is our objective function
linear?**

. . .

- We can use **non-linear penalty functions**
- But still, it will always be **linear**

. . .

<span class="question">Question:</span> **Anybody an idea why?**

. . .

- We can compute the **penalties in advance**
- Do **not** depend on the decision variables

# <span class="flow">Constraints</span>

## Constraints needed?

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-model_flow.svg"
data-fig-align="center" />

## Key Constraints

<span class="question">Question:</span> **Which constraints do we
need?**

<div class="incremental">

1.  Each group must have <span class="highlight">one path
    assigned</span>
2.  Each camp must have <span class="highlight">one path assigned</span>
3.  Each group must have <span class="highlight">one time slot
    assigned</span>
4.  Each resource must have <span class="highlight">a capacity
    limit</span>
5.  Constraint the <span class="highlight">relative utilization between
    periods</span>

</div>

## Assign Paths to Camps

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Assign **one path to each camp** over the entire time horizon.

. . .

> [!NOTE]
>
> ### We need the following variables:
>
> - $Y_{c,p}$ - 1 if camp $c$ is assigned to use path $p$, 0 otherwise

. . .

<span class="question">Question:</span> **What could be the
constraint?**

$$
\sum_{p \in \mathcal{P}_c} Y_{c,p} = 1 \quad \forall c \in \mathcal{C}
$$

## Assign Time Slots to Groups?

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Assign **one time slot to each group** over the entire time horizon
> **using the same path** we have assigned to the camp in the previous
> constraint.

. . .

> [!NOTE]
>
> ### We need the following variables:
>
> - $X_{s,t,p}$ - 1 if group $s$ is scheduled to perform stoning in $t$
>   and to use $p$, 0 otherwise
> - $Y_{c,p}$ - 1 if camp $c$ is assigned to use path $p$, 0 otherwise

. . .

<span class="question">Question:</span> **What could be the
constraint?**

## Assign Time Slots to Groups

$$
\sum_{t \in \mathcal{T}_s} X_{s,t,p}  = Y_{c,p} \quad  \forall c \in \mathcal{C}, p \in \mathcal{P}_c, s \in \mathcal{S}_c
$$

. . .

> [!NOTE]
>
> ### We use the following sets:
>
> - $\mathcal{C}$ - Pilgrim camps
> - $\mathcal{S}_c$ - Scheduling groups in camp $c$
> - $\mathcal{T}_s$ - Available stoning periods for scheduling group $s$
> - $\mathcal{P}_c$ - Feasible paths for camp $c$

## Relative Utilization and Capacities

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Compute the relative utilization of each resource while also ensuring
> that the utilization does not exceed the capacity limit.
> <span class="highlight">This one is very tricky!</span>

. . .

<span class="highlight">Difficulties:</span>

- Includes the time-shift between stoning and utilization
- Used as parameter to shift periods in variable $X_{s,t,p}$

## Compute Relative Utilization?

> [!NOTE]
>
> ### We need the following:
>
> - $n_s$ - Number of pilgrims in scheduling group $s$
> - $a_{p,r}$ - Period offset between stoning period and utilization
>   period of $r$ on $p$
> - $b_{r,t}$ - Capacity of resource $r$ in period $t$ in number of
>   pilgrims
> - $X_{s,t,p}$ - 1, if $s$ is scheduled to perform stoning in $t$ and
>   to use $p$, 0 else
> - $U_{r,t}$ - Relative utilization of resource $r$ in period $t$ with
>   $0 \leq U_{r,t} \leq 1$

. . .

<span class="question">Question:</span> **What could be the
constraint?**

## Compute Relative Utilization

$$
\sum_{p \in \mathcal{P}_r}\sum_{s \in S_p} n_s \times X_{s,t-a_{p,r},p}  = b_{r,t}\times U_{r,t} \quad \forall r \in \mathcal{R}, t \in \mathcal{T}
$$

. . .

> [!NOTE]
>
> ### We use the following:
>
> - $n_s$ - Number of pilgrims in scheduling group $s$
> - $a_{p,r}$ - Period offset between stoning period and utilization
>   period of $r$ on $p$
> - $b_{r,t}$ - Capacity of resource $r$ in period $t$ in number of
>   pilgrims
> - $X_{s,t,p}$ - 1, if $s$ is scheduled to perform stoning in $t$ and
>   to use $p$, 0 else
> - $U_{r,t}$ - Relative utilization of resource $r$ in period $t$ with
>   $0 \leq U_{r,t} \leq 1$

## 

<div class="r-fit-text">

Let’s pause!

Have you understood

this part?

</div>

<div class="footer">

</div>

## How does the shift work?

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-model_flow.svg"
data-fig-align="center" />

## Keep Fluctuations within Bounds?

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Keep the relative utilization of each resource within bounds to ensure
> a safer event.

. . .

> [!NOTE]
>
> ### We need the following:
>
> - $\sigma_r$ - max. relative utilization deviation between $t$ for $r$
> - $U_{r,t}$ - Relative utilization of resource $r$ in period $t$ with
>   $0 \leq U_{rt} \leq 1$

. . .

<span class="question">Question:</span> **What could be the
constraint?**

## Keep Fluctuations within Bounds

$$
U_{r,t} - U_{r,t-1} \leq \sigma_r \quad \forall (r,t) \in \left| \mathcal{R}\times \mathcal{T}\right|
$$

$$
U_{r,t-1} - U_{r,t} \leq \sigma_r \quad \forall (r,t) \in \left| \mathcal{R}\times \mathcal{T}\right|
$$

. . .

<span class="question">Question:</span> **Can somebody explain why this
works?**

- Each constraint limits the **change**
- The first one limits the **increase**
- The second one limits the **decrease**

## Scheduling Problem I

subject to:

## Scheduling Problem II

> [!NOTE]
>
> Restricting the **relative utilization** of each resource to a certain
> bound.

## Scheduling Problem III

> [!NOTE]
>
> All variables, except for $U_{r,t}$, are binary.

# <span class="flow">Model Characteristics</span>

## Characteristics

<span class="question">Questions:</span> **On model characteristics**

<div class="incremental">

- Is the model formulation linear/ non-linear?
- What kind of variable domains do we have?
- Have we specified the length of a period?

</div>

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

<div class="incremental">

- What assumptions have we made?
- What are likely issues that can arise if applied?
- How can we measure flow capacities?
- Are all pilgrims equally fast?

</div>

## Capacity Buffers

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-capacitybuffers.png"
data-fig-align="center" />

# <span class="flow">Implementation and Impact</span>

## 

<div class="r-fit-text">

Can this be

applied?

</div>

<div class="footer">

</div>

## 

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-solap-1.png"
data-fig-align="center" />

## 

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-solap-5.png"
data-fig-align="center" />

## Implementation

- Optimization **part of a bigger picture**
- Many projects with several disciplines involved
- E.g. Simulations, infrastructure projects, real-time monitoring,
  contingency plans, awareness campaigns, …

. . .

> [!NOTE]
>
> Optimization was part of a project by Knut Haase and his team (Haase
> et al. 2016).

## 

<img
src="https://images.beyondsimulations.com/ao/ao_pilgrim-media_coverage.png"
data-fig-align="center" />

## Wrap Up

> [!NOTE]
>
> ### And that’s it for todays lecture!
>
> We now have covered a scheduling problem based on a real-world
> application and are ready to start solving some new tasks in the
> upcoming tutorial.

## 

<div class="r-fit-text">

Questions?

</div>

<div class="footer">

</div>

# <span class="flow">Literature</span>

## Literature I

For more interesting literature to learn more about Julia, take a look
at the [literature list](../general/literature.qmd) of this course.

## Literature II

<div id="refs" class="references csl-bib-body hanging-indent"
entry-spacing="0">

<div id="ref-haase2016improving" class="csl-entry">

Haase, Knut, Habib Zain Al Abideen, Salim Al-Bosta, Mathias Kasper,
Matthes Koch, Sven Müller, and Dirk Helbing. 2016. “Improving Pilgrim
Safety During the Hajj: An Analytical and Operational Research
Approach.” *Interfaces* 46 (1): 74–90.

</div>

</div>
