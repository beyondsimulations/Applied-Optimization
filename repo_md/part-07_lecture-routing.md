# Lecture VII - Library Routing Optimization
Dr. Tobias Vlćek

# <span class="flow">Introduction</span>

## <span class="invert-font">Central Libraries</span>

. . .

<span class="invert-font fragment">**Question:** Anybody an idea what a
central library is?</span>

<div class="footer">

</div>

## Central Libraries

- <span class="highlight">Book Delivery to Libraries</span> in Germany
- They supply **all local libraries** within the same state
- Complex, as the **number of libraries** per state can be large
- Books and media in the libraries **change often**
- Customers can **request books** from other libraries

## Structure of the Deliveries

- For delivery, central has <span class="highlight">several employees
  and cars</span>
- Local libraries differ in size, some receive **more items**
- Items are **collected as well** during the tours[^1]
- They are **transported back** to the central library

## Potential Decisions

<span class="question">Question</span>: **What decisions can the library
make for tours?**

. . .

- Subdivide their set of libraries into **several ordered tours**
- Decide in **which order to visit** the libraries
- Evaluate **which car to use** for each of the tours
- Decide **which driver** to assign to each of the tours

## Impact of the Decisions

<span class="question">Question</span>: **What is the impact of the
decisions?**

. . .

- Longer driving routes <span class="highlight">increase the
  footprint</span> of the deliveries
- Suboptimal tours can lead to **unnecessary costs**
- Fuel, personnel, and repairs **are increased**
- Unhappy customers due to **waiting times** on ordered books

## 

<div class="r-fit-text">

Have you heard of

this problem before?

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

# <span class="flow">Problem Structure</span>

## Objective

<span class="question">Question</span>: **What could be the objective
for central libraries?**

. . .

- <span class="highlight">Lowering costs</span> through improved tours
- Improvement of their **footprint** through shorter tours
- **Faster fulfillment** of the deliveries

## Modelling

<span class="question">Question</span>: **What could we try to model?**

. . .

**Minimization** of the travel time while
<span class="highlight">supplying all libraries</span> in the state and
adhering to **the vehicle capacities and driving time restrictions.**

## 

<div class="r-fit-text">

Capacitated

Vehicle Routing

(CVRP)

</div>

<div class="footer">

</div>

## Vehicle Routing Problem

- CVRP is a **subproblem**
- Main problem is **Vehicle Routing Problem (VRP)**
- Problem class about **designing routes for vehicle fleets**

. . .

> [!NOTE]
>
> There are many variants of the VRP! E.g., with time windows, periodic
> deliveries, allowing for pickups or deliveries,
> <span class="highlight">and much more!</span>

## 

<div class="r-fit-text">

Let’s visualize

the problem!

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

# <span class="flow">Problem Visualization</span>

## Basic Problem Setting

<img
src="https://images.beyondsimulations.com/ao/ao_routing-basic-01.svg"
style="width:99.0%" />

## Basic Problem Setting with Arcs

<img
src="https://images.beyondsimulations.com/ao/ao_routing-basic-02.svg"
style="width:99.0%" />

## Setting with Vehicles

<img
src="https://images.beyondsimulations.com/ao/ao_routing-basic-03.svg"
style="width:99.0%" />

## Basic Problem Setting with Tours

<img
src="https://images.beyondsimulations.com/ao/ao_routing-basic-04.svg"
style="width:99.0%" />

------------------------------------------------------------------------

# <span class="flow">Problem Structure</span>

## Available Sets

<span class="question">Question:</span> **What could be the sets here?**

. . .

- $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
- $\mathcal{A}$ - Set of all arcs between the nodes, index
  $(i,j) \in \mathcal{A}$
- $\mathcal{K}$ - Set of vehicles with identical capacity, index
  $k \in \mathcal{K}$
- $0 \in \mathcal{V}$ - Depot where the vehicles start

## Available Parameters

<span class="question">Question:</span> **What are possible
parameters?**

. . .

- $b$ - Capacity per vehicle
- $t$ - Maximal duration of each tour
- $d_i$ - Demand at node $i$
- $c_{i,j}$ - Travel time on an arc from $i$ to $j$

. . .

> [!TIP]
>
> $t$ is the maximal duration of each tour, not the travel time on an
> arc or an index!

------------------------------------------------------------------------

## Decision Variable(s)?

> [!NOTE]
>
> ### We have the following sets:
>
> - All nodes, including the depot, $i \in \mathcal{V}$
> - All arcs between the nodes, $(i,j) \in \mathcal{A}$
> - The available vehicles, $k \in \mathcal{K}$

. . .

> [!IMPORTANT]
>
> ### Our objective is to:
>
> Minimize the **total travel time** while supplying **all customers**
> and adhering to the **vehicle capacities and duration restrictions**.

. . .

<span class="question">Question:</span> **What could be our decision
variable/s?**

## Decision Variables

- $X_{i,j,k}$ - 1, if $k$ passes between $i$ and $j$ on its tour, 0
  otherwise

. . .

> [!NOTE]
>
> ### Variable Domain
>
> $X_{i,j,k}$ is a **binary variable**, as it can only take values 0
> or 1. But most likely, you will already have spotted that!

. . .

<span class="question">Question:</span> **Why this might make the
problem difficult?**

## Decision Variable/s (again)?

> [!NOTE]
>
> ### We have the following sets:
>
> - All nodes, including the depot, $i \in \mathcal{V}$
> - All arcs between the nodes, $(i,j) \in \mathcal{A}$
> - The available vehicles, $k \in \mathcal{K}$

. . .

> [!IMPORTANT]
>
> ### Our objective is to:
>
> Minimization of the travel time (or driving distance), while supplying
> all customers and adhering to the vehicle capacities and duration
> restrictions. **Hint:** Even with many vehicles,
> <span class="highlight">each arc can maximally be passed once</span>!

## Decision Variables (again)

<span class="question">Question:</span> **What could be our decision
variable/s?**

. . .

- $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, else
  0

. . .

> [!IMPORTANT]
>
> ### Only possible under certain conditions!
>
> Only possible, if time and capacity constraints are equal for all
> vehicles!

------------------------------------------------------------------------

# <span class="flow">Model Formulation</span>

## Objective Function?

> [!IMPORTANT]
>
> ### Our objective is to:
>
> Minimization of the travel time (or driving distance), while supplying
> all customers and adhering to the vehicle capacities and duration
> restrictions.

. . .

<span class="question">Question:</span> **What could be our objective
function?**

. . .

> [!NOTE]
>
> ### We need the following variable:
>
> - $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour,
>   else 0

## Objective Function

> [!NOTE]
>
> ### We need the following parameters:
>
> - $c_{i,j}$ - travel time on an arc from $i$ to $j$

. . .

$$\text{minimize} \quad \sum_{(i,j) \in \mathcal{A}} c_{i,j} \times X_{i,j}$$

. . .

<span class="question">Question:</span> **What does
$(i,j) \in \mathcal{A}$ under the sum mean?**

------------------------------------------------------------------------

## Problem Constraints

<img
src="https://images.beyondsimulations.com/ao/ao_routing-basic-04.svg"
style="width:99.0%" />

## Constraints?

<span class="question">Question:</span> **What constraints do we need?**

. . .

- Each customer has to be **visited once**
- The depot has to be **entered and left** $|\mathcal{K}|$ times
- We have to enforce the **capacity of our vehicles**
- We have to ensure the **maximal duration of each tour**

. . .

> [!IMPORTANT]
>
> ### Subtours
>
> In addition, we have to prevent **subtours**!

## 

<div class="r-fit-text">

What is a

subtour?

</div>

<div class="footer">

</div>

## Subtours

<img
src="https://images.beyondsimulations.com/ao/ao_routing-basic-05.svg"
style="width:99.0%" />

------------------------------------------------------------------------

# <span class="flow">Constraints</span>

## Visit Each Customer Once?

> [!IMPORTANT]
>
> ### The goal of these constraints is to:
>
> Ensure that each customer is visited exactly once. Essentially, we
> could also say that each node **has to be entered and left exactly
> once.**

. . .

> [!NOTE]
>
> ### We need the following sets and variables:
>
> - $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
> - $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, 0
>   otherwise

## Visit Each Customer Once

<span class="question">Question:</span> **What could the constraint look
like?**

. . .

$$
\sum_{i \in \mathcal{V}} X_{i,j} = 1 \quad \forall j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

$$
\sum_{j \in \mathcal{V}} X_{i,j} = 1 \quad \forall i \in \mathcal{V} \setminus \{0\}, i \neq j
$$

. . .

<span class="question">Question:</span> **Why for all nodes except the
depot?**

. . .

The depot is the **only node** that is <span class="highlight">visited
multiple times!</span>

------------------------------------------------------------------------

## Depot Entry and Exit Constraints?

> [!IMPORTANT]
>
> ### The goal of these constraints is to:
>
> Ensure that each vehicle enters and leaves the depot exactly
> $|\mathcal{K}|$ times, as we have $|\mathcal{K}|$ vehicles and each
> vehicle has to return to the depot.

. . .

> [!NOTE]
>
> ### We need the following sets and variables:
>
> - $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
> - $|\mathcal{K}|$ - Number of vehicles
> - $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, 0
>   otherwise

. . .

<span class="question">Question:</span> **What could the constraint look
like?**

## Depot Entry and Exit Constraints

$$
\sum_{i \in \mathcal{V} \setminus \{0\}} X_{i,0} = |\mathcal{K}|
$$

$$
\sum_{j \in \mathcal{V} \setminus \{0\}} X_{0,j} = |\mathcal{K}|
$$

. . .

> [!NOTE]
>
> ### Are all constraints necessary?
>
> No, theoretically we could also say that we only have to leave **or**
> enter the depot exactly $|\mathcal{K}|$ times, as the other constraint
> is already enforced by the “visit each customer once constraint”.

------------------------------------------------------------------------

# <span class="flow">Capacity and Subtour Elimination</span>

## 

<div class="r-fit-text">

The next ones are

a little bit tricky.

</div>

<div class="footer">

</div>

## MTZ Formulation

<div class="incremental">

- **Miller-Tucker-Zemlin (MTZ)** Constraints
- Formulation by Kara, Laporte, and Bektas (2004)
- Prevent subtours and **track routes** and **capacity utilization**
- First, we need <span class="highlight">an additional variable!</span>
- $U_{i}$ - Capacity utilization at $i$ of vehicle on its tour with
  $i \in \mathcal{I}$

</div>

. . .

> [!NOTE]
>
> You don’t need to guess these constraints, as they are quite tricky!

## MTZ Constraints

> [!NOTE]
>
> ### We need the following sets, parameters, and variables:
>
> - $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
> - $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, 0
>   otherwise
> - $U_{i}$ - Capacity utilization at $i$ of vehicle on its tour with
>   $i \in \mathcal{I}$
> - $b$ - Capacity per vehicle (all are identical!)
> - $d_i$ - Demand at node $i$

. . .

$$
U_i - U_j + b \times X_{i,j} \leq b - d_j \quad \forall i,j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

. . .

$$
d_i \leq U_i \leq b \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

## 

<div class="r-fit-text">

Too

complicated?

</div>

<div class="footer">

</div>

## Don’t worry!

<div class="columns">

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_routing-subtours-01.svg"
style="width:99.0%" />

</div>

<div class="column incremental" width="50%">

- Let’s <span class="highlight">break it down!</span>
- $d_i$ for **all customers** is 1
- Capacity $b$ **per vehicle** is 5
- $U_i$ is the current **capacity utilization** at node
  $i \in \mathcal{I}$

</div>

</div>

------------------------------------------------------------------------

## No connection between nodes

<div class="columns">

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_routing-subtours-01.svg"
style="width:99.0%" />

</div>

<div class="column incremental" width="50%">

- In case $X_{ij} = 0$:
  - $U_i - U_j \leq b - d_j$
  - **Non-binding** for relation between two nodes
- Following is <span class="highlight">perfectly fine</span>:
  - $U_i \leq b$ and $U_j \geq d_j$

</div>

</div>

## Connection between two nodes

<div class="columns">

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_routing-subtours-01.svg"
style="width:99.0%" />

</div>

<div class="column incremental" width="50%">

- In case $X_{ij} = 1$:
  - $$U_i - U_j + b \leq b - d_j$$
  - **Binding** for relation between two nodes
- <span class="highlight">Can be summarized to</span>:
  - $U_j \geq d_j + U_i$

</div>

</div>

## Connection in more detail

<span class="question">Question:</span> **Why is it binding?**

. . .

- Binding as $U_j$ has to be **at least as large** as $d_i + U_i$
- Hence, fullfiled if the demand of $i$ is <span class="highlight">added
  to the vehicle</span>

. . .

<span class="question">Question:</span> **Do you get the idea?**

. . .

- If $X_{ij} = 1$, then $U_j$ has to be **at least as large** as
  $d_i + U_i$
- If $X_{ij} = 0$, then $U_i \leq b$ and $U_j \geq d_j$

## Tour from the Depot

<div class="columns">

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_routing-subtours-03.svg"
style="width:99.0%" />

</div>

<div class="column incremental" width="50%">

- Tour of vehicle A ok
- Depot is the only node <span class="highlight">visited multiple
  times</span>
- But the constraints are **not applied here!**

</div>

</div>

## Tour on its Own

<div class="columns">

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_routing-subtours-04.svg"
style="width:99.0%" />

</div>

<div class="column incremental" width="50%">

- Let’s start at node $H$
- We drive to node $C$
- $U_C$ = 1

</div>

</div>

## Tour on its Own II

<div class="columns">

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_routing-subtours-05.svg"
style="width:99.0%" />

</div>

<div class="column incremental" width="50%">

- We continue to node $I$
- $U_I$ = 2

</div>

</div>

## Tour on its Own III

<div class="columns">

<div class="column" width="50%">

<img
src="https://images.beyondsimulations.com/ao/ao_routing-subtours-06.svg"
style="width:99.0%" />

</div>

<div class="column incremental" width="50%">

- We continue to node $H$
- $U_H$ = 3
- Connection from $H$ to $C$
- $U_H$ is **greater** than $U_C$!
- <span class="highlight">Infeasible solution!</span>

</div>

</div>

## Subtour Elimination

- Connection in the other direction wouldn’t work as well
- **Only depot as “reset” **, as constraints are not applied here

<span class="question">Question:</span> **What about the capacity?**

. . .

- Remember variable domain of $U_i$?
- $d_i \leq U_i \leq b$ → <span class="highlight">Overall capacity limit
  enforced!</span>

------------------------------------------------------------------------

# <span class="flow">Last Constraint</span>

## Ensure time limit?

<span class="question">Question:</span> **Anybody an idea?**

. . .

- Constraints basically **follow the same idea**!
- First, we again need an additional variable
- $T_{i}$ - Time spent on tour at the node $i$ of a vehicle with
  $i \in \mathcal{I}$

## Ensure time limit

> [!NOTE]
>
> ### We need the following sets and variables:
>
> - $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
> - $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, 0
>   otherwise
> - $T_{i}$ - Time spent on tour at the node $i$ of a vehicle with
>   $i \in \mathcal{I}$
> - $t$ - Maximal duration of a tour
> - $c_{i,j}$ - Travel time on an arc from $i$ to $j$

. . .

$$
T_i - T_j + t \times X_{i,j} \leq t - c_{i,j} \quad \forall i,j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

. . .

$$
0 \leq T_{i} \leq t \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

## 

<div class="r-fit-text">

Any questions?

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

# <span class="flow">Asymmetric Vehicle Routing Problem</span>

## Objective

$$
\text{minimize} \quad \sum_{(i,j) \in \mathcal{A}} c_{i,j} \times X_{i,j} 
$$

> [!IMPORTANT]
>
> ### The goal of the objective function is to:
>
> Minimize the total travel distance.

## Each customer is visited once

$$
\sum_{i \in \mathcal{V}} X_{i,j} = 1 \quad \forall j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

$$
\sum_{j \in \mathcal{V}} X_{i,j} = 1 \quad \forall i \in \mathcal{V} \setminus \{0\}, i \neq j
$$

> [!IMPORTANT]
>
> ### Our constraints ensure:
>
> Each customer is visited exactly once.

## Depot entry and exit

$$
\sum_{i \in \mathcal{V} \setminus \{0\}} X_{i,0} = |\mathcal{K}|
$$

$$
\sum_{j \in \mathcal{V} \setminus \{0\}} X_{0,j} = |\mathcal{K}|
$$

> [!IMPORTANT]
>
> ### Our constraints ensure:
>
> The depot is visited by exactly $|\mathcal{K}|$ vehicles. Note, that
> we could remove one of the constraints and the solution would still be
> optimal.

## Capacity and subtour elimination

$$
U_i - U_j + b \times X_{i,j} \leq b - d_j \quad \forall i,j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

$$
d_i \leq U_i \leq b \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

> [!IMPORTANT]
>
> ### Our constraints ensure:
>
> The capacity limit is respected and subtours are eliminated.

## Time constraints

$$
T_i - T_j + t \times X_{i,j} \leq t - c_{i,j} \quad \forall i,j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

$$
0 \leq T_i \leq t \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

> [!IMPORTANT]
>
> ### Our constraints ensure:
>
> The time limit is respected (and subtours are eliminated).

## Variables

$$
X_{i,j} \in \{0,1\} \quad \forall i,j \in \mathcal{V}
$$

$$
d_i \leq U_i \leq b \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

$$
0 \leq T_i \leq t \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

> [!IMPORTANT]
>
> ### The variable domains make sure that:
>
> The binary setup variable is either 0 or 1 and the new variables are
> below the time and capacity limit.

------------------------------------------------------------------------

# <span class="flow">Model Characteristics</span>

## Characteristics

<span class="question">Questions:</span> **On model characteristics**

<div class="incremental">

- Is the model formulation linear/ non-linear?
- What kind of variable domains do we have?
- What do you think, can the model be solved quickly?

</div>

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

<div class="incremental">

- What assumptions have we made?
- What are likely issues that can arise if the model is applied?
- Have we considered service times?

</div>

------------------------------------------------------------------------

## Extensions of the CVRP

<span class="question">Questions:</span> **What extensions do you
know?**

. . .

- time windows (TW)
- soft time windows (STW)
- multiple depots (MD)
- heterogeneous fleet (HF)
- backhauls (B)
- pickup and delivery (PD)

------------------------------------------------------------------------

# <span class="flow">Implementation and Impact</span>

## <span class="invert-font">Case Study in Schleswig-Holstein</span>

. . .

<div class="invert-font">

- 165 libraries
- 119 visited biweekly
- Up to 9 different tours
- Time-Limit of 8 hours for each tour

</div>

<div class="footer">

</div>

## Current Routing Plan

<iframe width="95%" height="600" src="https://libraries.byndsim.com/W1P1Benchmark.html" title="Optimized Tours">

</iframe>

## 

<div class="r-fit-text">

Can our formulation

solve the problem

on a real-world instance?

</div>

<div class="footer">

</div>

## 

<div class="r-fit-text">

No, although we can find

solutions within one hour,

the gap is still very large

with 40%-45%.

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

## Problem is NP-hard

- We have already seen that a problem **can be NP-hard**
- Likely, that there are **no polynomial-time algorithms**
- <span class="highlight">Doesn’t mean that it can’t be solved!</span>

. . .

> [!NOTE]
>
> We won’t go deeper into this, but feel free to ask me!

## 

<div class="r-fit-text">

Can we do

anything to solve

the model?

</div>

<div class="footer">

</div>

## Heuristics

- We can still solve the problem **with a heuristic**
- <span class="highlight">Likely not the optimal solution</span>, but a
  lot of research goes into efficient algorithms to solve these problems
- In our case study we applied **Hybrid Genetic Search** for the CVRP
  (HGS-CVRP) by Vidal (2022)

. . .

> [!TIP]
>
> For problems with 100+ locations, heuristics are often the only
> practical choice.

------------------------------------------------------------------------

## Applications Beyond Libraries

<div class="columns">

<div class="column" width="50%">

**Logistics & Delivery**

- Package delivery
- Food delivery services
- Grocery delivery
- Mail distribution

</div>

<div class="column" width="50%">

**Service Industries**

- Maintenance crews
- Home healthcare visits
- Waste collection
- School bus routing

</div>

</div>

. . .

<span class="question">Question:</span> **Can you think of other
applications?**

## Conclusion

- Standard problem that <span class="highlight">occurs in many different
  places</span>
- Solving the problem with a mathematical model **is difficult**
- Nowadays, there are **many good heuristics**
- **Many companies** are working on the problem

. . .

> [!NOTE]
>
> ### And that’s it for todays lecture!
>
> We now have covered the Capacitated Vehicle Routing Problem and are
> ready to start solving some tasks in the upcoming tutorial.

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

## Literature II

<div id="refs" class="references csl-bib-body hanging-indent"
entry-spacing="0">

<div id="ref-KARA2004793" class="csl-entry">

Kara, Imdat, Gilbert Laporte, and Tolga Bektas. 2004. “A Note on the
Lifted Miller–Tucker–Zemlin Subtour Elimination Constraints for the
Capacitated Vehicle Routing Problem.” *European Journal of Operational
Research* 158 (3): 793–95.
https://doi.org/<https://doi.org/10.1016/S0377-2217(03)00377-1>.

</div>

<div id="ref-Vidal_2022" class="csl-entry">

Vidal, Thibaut. 2022. “Hybrid Genetic Search for the CVRP: Open-Source
Implementation and SWAP\* Neighborhood.” *Computers & Operations
Research* 140 (April): 105643.
<https://doi.org/10.1016/j.cor.2021.105643>.

</div>

</div>

[^1]: Due to regulations, the delivery tours cannot exceed a certain
    duration
