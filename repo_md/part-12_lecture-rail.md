# Lecture XII - Passenger Flow Control in Urban Rail
Dr. Tobias Vlćek

# <span class="flow">Introduction</span>

## <span class="invert-font">FIFA World Cup 2022 in Qatar</span>

<div class="footer">

</div>

## Public transport

# Solutions

You will likely find solutions to most exercises online. However, I
strongly encourage you to work on these exercises independently without
searching explicitly for the exact answers to the exercises.
Understanding someone else’s solution is very different from developing
your own. Use the lecture notes and try to solve the exercises on your
own. This approach will significantly enhance your learning and
problem-solving skills.

Remember, the goal is not just to complete the exercises, but to
understand the concepts and improve your programming abilities. If you
encounter difficulties, review the lecture materials, experiment with
different approaches, and don’t hesitate to ask for clarification during
class discussions.

Later, you will find the solutions to these exercises online in the
associated GitHub repository, but we will also quickly go over them in
next week’s tutorial. To access the solutions, click on the Github
button on the lower right and search for the folder with today’s lecture
and tutorial. Alternatively, you can ask ChatGPT or Claude to explain
them to you. But please remember, the goal is not just to complete the
exercises, but to understand the concepts and improve your programming
abilities.

- FIFA Worldcup 2022 took place in a <span class="highlight">small
  region</span>
- The capacity of the metro system was **finite**
- More than <span class="highlight">1 million tourists</span> where
  expected
- Metro usage was **free for all ticket holders**
- Transport methods were expected to be **overloaded**

. . .

<span class="question">Question:</span> **What could become an issue?**

## <span class="invert-font">Crowd Disasters</span>

<div class="footer">

</div>

## Potential locations

<span class="question">Question:</span> **Where could crowd disasters
happen?**

. . .

- At event venues and in waiting areas
- At intersections of multiple pedestrian flows
- In narrow passages and entrances
- On crowded metro platforms and transfer stations
- At ticket/turnstile bottlenecks and emergency exits

------------------------------------------------------------------------

## Metrosystem of Doha

<img src="https://images.byndsim.com/ao/ao_metro-metro.svg"
data-fig-align="center" />

## Main Bottleneck

<span class="question">Question:</span> **What could be a potential
bottleneck?**

. . .

- Red Line has twice the capacity of the Green and Gold Line
- People use the metro to get to the event venues

. . .

<span class="question">Question:</span> **What could be the issue?**

- Imagine a match at a stadium along the Gold line
- People from Red and Green line will try to get there
- This will cause a <span class="highlight">massive crowd at transfer
  stations</span>

## Visualization

<img src="https://images.byndsim.com/ao/ao_metro-metro_overcrowded.svg"
data-fig-align="center" />

- 10 people want to start per minute at **each station**
- Everybody wants to get to **station D**

## Closer look at the Metro System

<img src="https://images.byndsim.com/ao/ao_metro-metro_zoom.svg"
data-fig-align="center" />

## Capacities inside the stations

- Capacities **inside the stations** are limited as well
- These include the escalators, stairs, and elevators
- But also the platforms and the ticket gates

. . .

> [!WARNING]
>
> This can lead to <span class="highlight">overcrowding and potential
> crowd disasters!</span>

------------------------------------------------------------------------

## General Issues

<span class="question">Question:</span> **What could also be an issue?**

. . .

- Often unknown **how many people** exactly will participate
- Gathering data is <span class="highlight">extremely importand and
  difficult</span>
- Crowd behavior can be <span class="highlight">unpredictable and
  dynamic</span>
- Weather conditions may affect **transportation preferences**
- Cultural factors influence **crowd movement patterns**
- Emergency situations require **flexible contingency plans**

## 

<div class="r-fit-text">

Let’s take a

closer look at the

problem structure!

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

# <span class="flow">Problem Structure</span>

## Objective

<span class="question">Question:</span> **What could be the objectives
of the authorities?**

. . .

- A <span class="highlight">safe and successful event</span> as host
  country
- Good <span class="highlight">publicity and a positive
  recognition</span> worldwide  
- <span class="highlight">Satisfied visitors</span> that enjoyed their
  time

. . .

> [!NOTE]
>
> ### Note: We can model none of the above directly!
>
> But we can assist in the estimation of transport demands and the
> design of operational plans to ensure public **safety** and a **smooth
> transportation** through the city.

## Underlying Problem

<span class="question">Question:</span> **Can we just start modeling?**

. . .

- First, we need to understand the **movement patterns**
- Event is **unprecedented**, movement patterns are unknown
- Multiple <span class="highlight">concurrent events</span> affect flow
  patterns

. . .

> [!TIP]
>
> ### Tip: We need to estimate the data first!
>
> This is a **huge challenge**, but we can use **simulation** to
> estimate the data.

------------------------------------------------------------------------

## Simulation

- Based on <span class="highlight">publicly available data</span> from
  the area
- Simulates **all individuals** participating at the event
- Includes **all transportation infrastructure**
- <span class="highlight">Individual mode choice</span> based on a
  choice model

. . .

> [!TIP]
>
> ### Tip: Julia is a great tool for this!
>
> Simulations was build in Julia. With 1,000,000 individuals
> walking,using cars, busses, and the metro, a day took **less than 5
> minutes**.

## Results of the Simulation

<div class="column" width="50%">

<img src="https://images.byndsim.com/ao/ao_metro-train_section.png"
style="width:85.0%" />

</div>

<div class="column" width="50%">

- Detailed movement patterns throughout the region
- Potential sections at risk in the transport infrastructure
- Potential capacity overloads at event locations  

</div>

## 

<div class="r-fit-text">

But it is still

based on a lot

of assumptions!

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

## <span class="invert-font">Main risk: Metro</span>

<div class="footer">

</div>

## Idea

<span class="question">Question:</span> **What can we do to prevent
crowd disasters?**

. . .

- Regulate the **inflow** at each individual station
- Ensure utilized capacity is <span class="highlight">always within
  bounds</span>

. . .

<span class="question">Question:</span> **What could we try to model?**

. . .

- <span class="highlight">Minimize the queues</span> outside of the
  metro stations
- Based on the **allowed inflow** and origin-destination data
- Adhering to the **capacity constraints**

## Difficulty

<img
src="https://images.byndsim.com/ao/ao_metro-metro_inflow_impact.svg"
data-fig-align="center" />

. . .

- Movement patterns have different origin-destination pairs
- Regulating the inflow does not affect the destination

------------------------------------------------------------------------

# <span class="flow">Model Formulation</span>

## Graph Sets?

<span class="question">Question:</span> **What could be the sets for the
graph?**

<img src="https://images.byndsim.com/ao/ao_metro-metro_overcrowded.svg"
data-fig-align="center" />

## Graph Sets?

- $\mathcal{G}$ - Connected digraph of the metro network
  $\mathcal{G}=(\mathcal{O},\mathcal{E})$
- $\mathcal{O}$ - Set of metro stations, indexed by $o$
- $\mathcal{E}$ - Set of directed arcs between connected stations

. . .

> [!NOTE]
>
> ### Note: These are the easier sets.
>
> These simply help us to represent the entire metro system as a graph
> with different nodes $\mathcal{O}$ and arcs $\mathcal{E}$ between
> connected stations.

## Time Sets?

<span class="question">Question:</span> **What could be the time sets?**

<div class="incremental">

- $\mathcal{T}$ - Set of minutes in the time horizon, indexed by $t$
- $\mathcal{P}$ - Set of periods in the observed time horizon, where
  $p \in \{1, 2, \dots,n\}$

</div>

. . .

> [!NOTE]
>
> ### Note: Number of periods
>
> We further define $n$ as the **number of periods in observed time
> horizon.**

## Periods

<span class="question">Question:</span> **Why do we add periods here?**

. . .

- Staff needs **clear**, consistent instructions
- Frequent changes in flow <span class="highlight">increase risk of
  errors</span>
- **Easier** to manage and communicate for planners

. . .

> [!NOTE]
>
> ### Note: Period Length
>
> We define the period length as the length of the period in minutes
> measured as $m$ minutes, which is the **same for all periods**.

## Mapping Minutes to Periods

- We can define an **additional set** with their relation
- It specifies the relation of <span class="highlight">periods $p$ to
  minutes $t$.</span>

$$
    I_p =\{t \in \mathcal{T}|(p-1) \times m + 1 \leq t \leq p \times m\} \quad \forall p \in \mathcal{P}
$$

. . .

<span class="question">Question:</span> **Can anybody explain it?**

. . .

- $I_p$ is the set of minutes $t$ that belong to period $p$
- Minutes are **not overlapping**, but they are **continuous**

------------------------------------------------------------------------

## Parameters?

<span class="question">Question:</span> **What could be possible
parameters?**

. . .

- $q_{o,d,p}$ - Demand from station $o$ to $d$ with
  $o,d \in \mathcal{O}$ in $p$
- $d_{e}$ - Travel time (min) of the arcs $e \in \mathcal{E}$
- $c_e$ - Max. allowed arc entry rate $e$ per minute with
  $e \in \mathcal{E}$
- $c_{o}^{min}$ - Min. station entry rate $o$ per minute with
  $o \in \mathcal{O}$
- $c_{o}^{max}$ - Max. station entry rate $o$ per minute with
  $o \in \mathcal{O}$
- $\alpha$ - Maximal allowed arc utilization ($0 < \alpha < 1$)

------------------------------------------------------------------------

## Metro Movement

<span class="question">Question:</span> **How do people move inside the
metro?**

. . .

- Simple network: assume people use the **shortest path**
- Use <span class="highlight">Djikstra’s algorithm</span> to compute it
- From each station to all other stations

. . .

> [!TIP]
>
> ### Tip: We can save the results in a new set $\mathcal{C}_{o,d}$
>
> This will help us to model the movement inside the metro.

## Shortest Paths (SP)

- $\mathcal{C}_{o,d}$ - Set of arcs $e \in \mathcal{E}$ on the SP from
  $o,d \in \mathcal{O}$

. . .

> [!NOTE]
>
> Now we compute the **travel time on the shortest paths.** One
> parameter for the SP from **station to station** and one for the SP
> from **station to arc**.

. . .

- $d_{o,d}$ - travel time (min) on SP from $o \in \mathcal{O}$ to
  $d \in \mathcal{O}$
- $d_{o,e}$ - travel time (min) on SP from $o \in \mathcal{O}$ to
  $e \in \mathcal{E}$

## People Spreading

<span class="question">Question:</span> **How do people spread?**

<img
src="https://images.byndsim.com/ao/ao_metro-metro_inflow_impact.svg"
data-fig-align="center" />

## Ratio of Origin-Destination

- We **cannot control** the destination of the passengers
- Thus we assume that people spread <span class="highlight">based on
  destination</span>

. . .

$$\frac{q_{o,d,p}}{\sum_{d \in \mathcal{O}} q_{o,d,p}} \quad \forall o,d \in \mathcal{O}, p\in \mathcal{P}$$

. . .

> [!NOTE]
>
> Based on the ratio of the different destinations $d$ to the total
> queue for each station $o \in \mathcal{O}$ in each period
> $p \in \mathcal{P}$.

------------------------------------------------------------------------

# <span class="flow">Variables and Objective</span>

## Decision Variable?

> [!IMPORTANT]
>
> ### Our goal is to:
>
> Regulate the **inflow** at **each individual station** to **minimize
> the queues** outside the metro stations based on the allowed inflow
> while **adhering to the capacity constraints.**

> [!TIP]
>
> There is **one queue for all passenger flow directions**, as managing
> multiple queues would be too complex for the planners!

## Decision Variable

> [!NOTE]
>
> ### We need the following sets:
>
> - All the metro stations, $o \in \mathcal{O}$
> - All periods under observation, $p \in \mathcal{P}$

<span class="question">Question:</span> **What could be our decision
variable?**

. . .

- $X_{o,p}$ - Allowed inflow (per minute) at station $o$ in period $p$

------------------------------------------------------------------------

## Objective Function?

> [!IMPORTANT]
>
> ### Our main objective is to:
>
> Regulate the **inflow** at **each individual station** to **minimize
> the queues** outside the metro stations based on the allowed inflow
> while **adhering to the capacity constraints.**

. . .

<span class="question">Question:</span> **How again are queues
minimized?**

. . .

- By the allowed inflow $X_{o,p}$ subtracted from the queue

## Objective Function

> [!NOTE]
>
> ### We need the following parameters and variables:
>
> - $q_{o,d,p}$ - People queued to travel from station $o$ to $d$ with
>   $o,d \in \mathcal{O}$ in period $p$
> - $X_{o,p}$ - Allowed inflow (per minute) at station $o$ in period $p$

. . .

<span class="question">Question:</span> **What could be our objective
function?**

. . .

$$
\text{minimize} \quad \sum_{o \in \mathcal{O}} \sum_{p \in \mathcal{P}} (\sum_{d \in \mathcal{O}} q_{o,d,p} - m \times X_{o,p})
$$

------------------------------------------------------------------------

# <span class="flow">Constraints</span>

## Necessary Constraints

<span class="question">Question:</span> **What constraints do we need?**

<img src="https://images.byndsim.com/ao/ao_metro-metro_overcrowded.svg"
style="width:80.0%" data-fig-align="center" />

. . .

- The capacity of each arc is **not exceeded**
- Do not dispatch more people than are queued
- Do not dispatch less than the minimum allowed inflow

## 

<div class="r-fit-text">

Things are going to

get a little

complicated now!

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

## Central Question

<span class="question">Question:</span> **When do people flowing into
the metro system change the arcs?**

. . .

- People enter metro station at $o$ with destination $d$
- They will lead to a usage of an arc $e$ on their SP
- This usage depends on their path and the travel times

. . .

> [!TIP]
>
> ### Tip: You’ll likely know what we need now!
>
> We can add a new set $\mathcal{R}_{e,t}$ to help us with this.

## Set of Time-Delays

$$
\mathcal{R}_{e,t} = \{(o,d,p) \mid 
    \begin{array}{l}
    (o,d) | o,d \in \mathcal{O}, \\
    q_{o,d,p} > 0, \\
    e \in \mathcal{C}_{o,d}, \\
    t-d_{o,e} \in I_p, \\
    p \in \mathcal{P}\}
    \end{array}
    \quad \forall e \in \mathcal{E}, t \in \mathcal{T}
$$

. . .

<span class="question">Question:</span> **Who can explain this set?**

. . .

The set $\mathcal{R}_{e,t}$ contains **all combinations** $(o,d,p)$
which trigger a **capacity utilization** of arc $e$ in period $t$.

## Small Example

<img src="https://images.byndsim.com/ao/ao_metro-metro_set_r.svg"
data-fig-align="center" />

. . .

> [!TIP]
>
> The set contains all possible o-d pairs and periods, that result in
> passengers starting at arc $(C,D)$ at minute $22$. For m=2, it would
> be:
>
> $\{((A,D),3),((B,D),5),((C,D),11),((E,D),9)\}$.

## 

<div class="r-fit-text">

Essentially, we can use this

set to compute the utilization

of an arc at each minute based

on the inflow level at the

different stations and periods.

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

## Ensure Capacity Utilization?

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Ensure that the capacity of each arc is not exceeded at any minute.

. . .

> [!NOTE]
>
> ### We need the following variable, parameter and set:
>
> - $q_{o,d,p}$ - people waiting to travel from station
>   $o \in \mathcal{O}$ to station $d \in \mathcal{O}$ in $p$
> - $c_e$ - people max. allowed to enter arc $e$ per minute with
>   $e \in \mathcal{E}$
> - $\mathcal{R}_{e,t}$ - mapping of station entries to arc $e$ in time
>   $t$ with $e \in \mathcal{E}$ and $t \in \mathcal{T}$
> - $\alpha$ - maximal allowed arc utilization ($0 < \alpha < 1$)
> - $X_{o,p}$ - the allowed inflow per minute at metro station $o$ in
>   the period $p$

## Ensure Capacity Utilization

<span class="question">Question:</span> **What could be the
constraint?**

. . .

$$
\sum_{(o,d,p) \in \mathcal{R}_{e,t}} X_{o,p} \times \frac{q_{o,d,p}}{\sum_{f \in \mathcal{O}} q_{o,f,p}} \leq \alpha \times c_{e} \quad \forall e \in \mathcal{E}, t \in \mathcal{T} 
$$

. . .

> [!NOTE]
>
> Here, we combine the inflow at each station based on the o-d
> proportion and let the people spread through the network, checking
> that no arc is over-utilized at any minute.

------------------------------------------------------------------------

## Dispatch Only Available People?

> [!IMPORTANT]
>
> ### The goal of this constraint is to:
>
> Ensure that we do not dispatch more people than are queued and less
> than the minimum allowed inflow, preventing over- and
> under-dispatching.

. . .

> [!NOTE]
>
> ### We need the following variables and parameters:
>
> - $X_{o,p}$ - Allowed inflow (per minute) at station $o$ in period $p$
> - $q_{o,d,p}$ - People queued to travel from station $o$ to $d$ with
>   $o,d \in \mathcal{O}$ in $p$
> - $m$ - period length in minutes

## Dispatch Only Available People

<span class="question">Question:</span> **What could be the
constraint?**

. . .

<div class="temp-math-size">

<style>
.temp-math-size .math.display .MathJax  {
  font-size: 85% !important;
}
</style>

$$
\min\{\frac{\sum_{d \in \mathcal{O}} q_{o,d,p}}{m},c_{o}^{\min}\} \leq X_{o,p} \leq \min\{\frac{\sum_{d \in \mathcal{O}} q_{o,d,p}}{m},c_{o}^{\max}\} \quad \forall o \in \mathcal{O}, p \in \mathcal{P}
$$

</div>

. . .

> [!NOTE]
>
> We need this constraint for **two reasons**:
>
> 1.  We could also dispatch more people than there are as this would
>     **minimize the objective value. **
> 2.  We also need to ensure that we can dispatch at **least the minimum
>     allowed inflow** or less if the queue is smaller than the minimum
>     allowed inflow.

------------------------------------------------------------------------

## Metro Inflow Model

<div class="temp-math-size">

<style>
.temp-math-size .math.display .MathJax  {
  font-size: 85% !important;
}
</style>

subject to:

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
- What are likely issues that can arise if applied?
- Have we thought in detail about queues?
- Are shortest paths a feasible assumption?

</div>

------------------------------------------------------------------------

# <span class="flow">Implementation and Impact</span>

## <span class="invert-font">Metro Inflow Optimization</span>

. . .

<span class="invert-font"><span class="question">Question:</span> **Can
this be applied?**</span>

<div class="footer">

</div>

## Metro Inflow Problem

- Solved very fast <span class="highlight">within seconds</span> for
  realistic problem sizes
- **But** we cannot plan or control the metro inflow
- Queues are **too simplified** with passengers disappearing

. . .

<span class="question">Question:</span> **Any ideas, how the current
model could be improved or how it could be embedded into a heuristic?**

## Heuristic: Step-Wise Optimization

- Solve the model for the time-horizon of a **few periods**
- Fix the inflow in the **current first period**
- Decrease capacity in the network **based on the inflow**
- Transfer **remaining queues** into the subsequent period
- <span class="highlight">Solve the model again</span>
- **Repeat**, until the inflow is computed for all periods

## Transport Demand

<img src="https://images.byndsim.com/ao/ao_metro-transportdemand.svg"
data-fig-align="center" />

## Utilization Analysis

<img src="https://images.byndsim.com/ao/ao_metro-arcutil.svg"
data-fig-align="center" />

## Implementation

- **Assumption of known destinations** based is strong
- Movements **seemed to follow our forecasts**
- We did achieve our goal of **metro inflow control**
- Simulation was used to **estimate the inflows**

. . .

> [!NOTE]
>
> Few dangerous situations, especially at the FIFA Fan Fest, were
> **handled well** by the authorities.

## Wrap Up

- Model can help to achieve a <span class="highlight">good
  balance</span>
- Can be adapted easily to **any metro system worldwide **
- Especially interesting for **larger Asian cities**

. . .

> [!NOTE]
>
> ### And that’s it for todays lecture!
>
> We now have covered a metro inflow control problem based on a
> real-world application and are ready to start solving some new tasks
> in the upcoming tutorial.

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
