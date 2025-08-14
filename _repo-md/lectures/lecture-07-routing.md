---
title: Lecture VII - Library Routing Optimization
subtitle: Applied Optimization with Julia
author: Dr. Tobias Vlćek
format:
  revealjs:
    footer: ' {{< meta title >}} | {{< meta author >}} | [Home](lecture-07-routing.qmd)'
    output-file: lecture-07-presentation.html
format-links:
  - text: PDF
    href: lecture-07-presentation.pdf
    icon: file-pdf
---


# <span class="flow">Introduction</span>

## <span class="invert-font">Central Libraries</span>

. . .

<span class="invert-font fragment">**Question:** Anybody an idea what a central library is?</span>

## Central Libraries

-   <span class="highlight">Book Delivery to Libraries</span> in Germany
-   They supply **all local libraries** within the same state
-   Complex, as the **number of libraries** per state can be large
-   Books and media in the libraries **change often**
-   Customers can **request books** from other libraries

## Structure of the Deliveries

-   For delivery, central has <span class="highlight">several employees and cars</span>
-   Local libraries differ in size, some receive **more items**
-   Items are **collected as well** during the tours[^1]
-   They are **transported back** to the central library

## Potential Decisions

<span class="question">Question</span>: **What decisions can the library make for tours?**

. . .

-   Subdivide their set of libraries into **several ordered tours**
-   Decide in **which order to visit** the libraries
-   Evaluate **which car to use** for each of the tours
-   Decide **which driver** to assign to each of the tours

## Impact of the Decisions

<span class="question">Question</span>: **What is the impact of the decisions?**

. . .

-   Longer driving routes <span class="highlight">increase the footprint</span> of the deliveries
-   Suboptimal tours can lead to **unnecessary costs**
-   Fuel, personnel, and repairs **are increased**
-   Unhappy customers due to **waiting times** on ordered books

## 

Have you heard of

this problem before?

------------------------------------------------------------------------

# <span class="flow">Problem Structure</span>

## Objective

<span class="question">Question</span>: **What could be the objective for central libraries?**

. . .

-   <span class="highlight">Lowering costs</span> through improved tours
-   Improvement of their **footprint** through shorter tours
-   **Faster fulfillment** of the deliveries

## Modelling

<span class="question">Question</span>: **What could we try to model?**

. . .

**Minimization** of the travel time while <span class="highlight">supplying all libraries</span> in the state and adhering to **the vehicle capacities and driving time restrictions.**

## 

Capacitated

Vehicle Routing

(CVRP)

## Vehicle Routing Problem

-   CVRP is a **subproblem**
-   Main problem is **Vehicle Routing Problem (VRP)**
-   Problem class about **designing routes for vehicle fleets**

. . .

> **Note**
>
> There are many variants of the VRP! E.g., with time windows, periodic deliveries, allowing for pickups or deliveries, <span class="highlight">and much more!</span>

## 

Let's visualize

the problem!

------------------------------------------------------------------------

# <span class="flow">Problem Visualization</span>

## Basic Problem Setting

<img src="https://images.beyondsimulations.com/ao/ao_routing-basic-01.svg" style="width:99.0%" />

## Basic Problem Setting with Arcs

<img src="https://images.beyondsimulations.com/ao/ao_routing-basic-02.svg" style="width:99.0%" />

## Setting with Vehicles

<img src="https://images.beyondsimulations.com/ao/ao_routing-basic-03.svg" style="width:99.0%" />

## Basic Problem Setting with Tours

<img src="https://images.beyondsimulations.com/ao/ao_routing-basic-04.svg" style="width:99.0%" />

------------------------------------------------------------------------

# <span class="flow">Problem Structure</span>

## Available Sets

<span class="question">Question:</span> **What could be the sets here?**

. . .

-   $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
-   $\mathcal{A}$ - Set of all arcs between the nodes, index $(i,j) \in \mathcal{A}$
-   $\mathcal{K}$ - Set of vehicles with identical capacity, index $k \in \mathcal{K}$
-   $0 \in \mathcal{V}$ - Depot where the vehicles start

## Available Parameters

<span class="question">Question:</span> **What are possible parameters?**

. . .

-   $b$ - Capacity per vehicle
-   $t$ - Maximal duration of each tour
-   $d_i$ - Demand at node $i$
-   $c_{i,j}$ - Travel time on an arc from $i$ to $j$

. . .

> **Tip**
>
> $t$ is the maximal duration of each tour, not the travel time on an arc or an index!

------------------------------------------------------------------------

## Decision Variable(s)?

> **We have the following sets:**
>
> -   All nodes, including the depot, $i \in \mathcal{V}$
> -   All arcs between the nodes, $(i,j) \in \mathcal{A}$
> -   The available vehicles, $k \in \mathcal{K}$

. . .

> **Our objective is to:**
>
> Minimize the **total travel time** while supplying **all customers** and adhering to the **vehicle capacities and duration restrictions**.

. . .

<span class="question">Question:</span> **What could be our decision variable/s?**

## Decision Variables

-   $X_{i,j,k}$ - 1, if $k$ passes between $i$ and $j$ on its tour, 0 otherwise

. . .

> **Variable Domain**
>
> $X_{i,j,k}$ is a **binary variable**, as it can only take values 0 or 1. But most likely, you will already have spotted that!

. . .

<span class="question">Question:</span> **Why this might make the problem difficult?**

## Decision Variable/s (again)?

> **We have the following sets:**
>
> -   All nodes, including the depot, $i \in \mathcal{V}$
> -   All arcs between the nodes, $(i,j) \in \mathcal{A}$
> -   The available vehicles, $k \in \mathcal{K}$

. . .

> **Our objective is to:**
>
> Minimization of the travel time (or driving distance), while supplying all customers and adhering to the vehicle capacities and duration restrictions. **Hint:** Even with many vehicles, <span class="highlight">each arc can maximally be passed once</span>!

## Decision Variables (again)

<span class="question">Question:</span> **What could be our decision variable/s?**

. . .

-   $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, else 0

. . .

> **Only possible under certain conditions!**
>
> Only possible, if time and capacity constraints are equal for all vehicles!

------------------------------------------------------------------------

# <span class="flow">Model Formulation</span>

## Objective Function?

> **Our objective is to:**
>
> Minimization of the travel time (or driving distance), while supplying all customers and adhering to the vehicle capacities and duration restrictions.

. . .

<span class="question">Question:</span> **What could be our objective function?**

. . .

> **We need the following variable:**
>
> -   $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, else 0

## Objective Function

> **We need the following parameters:**
>
> -   $c_{i,j}$ - travel time on an arc from $i$ to $j$

. . .

$$\text{minimize} \quad \sum_{(i,j) \in \mathcal{A}} c_{i,j} \times X_{i,j}$$

. . .

<span class="question">Question:</span> **What does $(i,j) \in \mathcal{A}$ under the sum mean?**

------------------------------------------------------------------------

## Problem Constraints

<img src="https://images.beyondsimulations.com/ao/ao_routing-basic-04.svg" style="width:99.0%" />

## Constraints?

<span class="question">Question:</span> **What constraints do we need?**

. . .

-   Each customer has to be **visited once**
-   The depot has to be **entered and left** $|\mathcal{K}|$ times
-   We have to enforce the **capacity of our vehicles**
-   We have to ensure the **maximal duration of each tour**

. . .

> **Subtours**
>
> In addition, we have to prevent **subtours**!

## 

What is a

subtour?

## Subtours

<img src="https://images.beyondsimulations.com/ao/ao_routing-basic-05.svg" style="width:99.0%" />

------------------------------------------------------------------------

# <span class="flow">Constraints</span>

## Visit Each Customer Once?

> **The goal of these constraints is to:**
>
> Ensure that each customer is visited exactly once. Essentially, we could also say that each node **has to be entered and left exactly once.**

. . .

> **We need the following sets and variables:**
>
> -   $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
> -   $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, 0 otherwise

## Visit Each Customer Once

<span class="question">Question:</span> **What could the constraint look like?**

. . .

$$
\sum_{i \in \mathcal{V}} X_{i,j} = 1 \quad \forall j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

$$
\sum_{j \in \mathcal{V}} X_{i,j} = 1 \quad \forall i \in \mathcal{V} \setminus \{0\}, i \neq j
$$

. . .

<span class="question">Question:</span> **Why for all nodes except the depot?**

. . .

The depot is the **only node** that is <span class="highlight">visited multiple times!</span>

------------------------------------------------------------------------

## Depot Entry and Exit Constraints?

> **The goal of these constraints is to:**
>
> Ensure that each vehicle enters and leaves the depot exactly $|\mathcal{K}|$ times, as we have $|\mathcal{K}|$ vehicles and each vehicle has to return to the depot.

. . .

> **We need the following sets and variables:**
>
> -   $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
> -   $|\mathcal{K}|$ - Number of vehicles
> -   $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, 0 otherwise

. . .

<span class="question">Question:</span> **What could the constraint look like?**

## Depot Entry and Exit Constraints

$$
\sum_{i \in \mathcal{V} \setminus \{0\}} X_{i,0} = |\mathcal{K}|
$$

$$
\sum_{j \in \mathcal{V} \setminus \{0\}} X_{0,j} = |\mathcal{K}|
$$

. . .

> **Are all constraints necessary?**
>
> No, theoretically we could also say that we only have to leave **or** enter the depot exactly $|\mathcal{K}|$ times, as the other constraint is already enforced by the "visit each customer once constraint".

------------------------------------------------------------------------

# <span class="flow">Capacity and Subtour Elimination</span>

## 

The next ones are

a little bit tricky.

## MTZ Formulation

-   **Miller-Tucker-Zemlin (MTZ)** Constraints
-   Formulation by Kara, Laporte, and Bektas (2004)
-   Prevent subtours and **track routes** and **capacity utilization**
-   First, we need <span class="highlight">an additional variable!</span>
-   $U_{i}$ - Capacity utilization at $i$ of vehicle on its tour with $i \in \mathcal{I}$

. . .

> **Note**
>
> You don't need to guess these constraints, as they are quite tricky!

## MTZ Constraints

> **We need the following sets, parameters, and variables:**
>
> -   $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
> -   $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, 0 otherwise
> -   $U_{i}$ - Capacity utilization at $i$ of vehicle on its tour with $i \in \mathcal{I}$
> -   $b$ - Capacity per vehicle (all are identical!)
> -   $d_i$ - Demand at node $i$

. . .

$$
U_i - U_j + b \times X_{i,j} \leq b - d_j \quad \forall i,j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

. . .

$$
d_i \leq U_i \leq b \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

## 

Too

complicated?

## Don't worry!

<img src="https://images.beyondsimulations.com/ao/ao_routing-subtours-01.svg" style="width:99.0%" />

-   Let's <span class="highlight">break it down!</span>
-   $d_i$ for **all customers** is 1
-   Capacity $b$ **per vehicle** is 5
-   $U_i$ is the current **capacity utilization** at node $i \in \mathcal{I}$

------------------------------------------------------------------------

## No connection between nodes

<img src="https://images.beyondsimulations.com/ao/ao_routing-subtours-01.svg" style="width:99.0%" />

-   In case $X_{ij} = 0$:
    -   $U_i - U_j \leq b - d_j$
    -   **Non-binding** for relation between two nodes
-   Following is <span class="highlight">perfectly fine</span>:
    -   $U_i \leq b$ and $U_j \geq d_j$

## Connection between two nodes

<img src="https://images.beyondsimulations.com/ao/ao_routing-subtours-01.svg" style="width:99.0%" />

-   In case $X_{ij} = 1$:
    -   $$U_i - U_j + b \leq b - d_j$$
    -   **Binding** for relation between two nodes
-   <span class="highlight">Can be summarized to</span>:
    -   $U_j \geq d_j + U_i$

## Connection in more detail

<span class="question">Question:</span> **Why is it binding?**

. . .

-   Binding as $U_j$ has to be **at least as large** as $d_i + U_i$
-   Hence, fullfiled if the demand of $i$ is <span class="highlight">added to the vehicle</span>

. . .

<span class="question">Question:</span> **Do you get the idea?**

. . .

-   If $X_{ij} = 1$, then $U_j$ has to be **at least as large** as $d_i + U_i$
-   If $X_{ij} = 0$, then $U_i \leq b$ and $U_j \geq d_j$

## Tour from the Depot

<img src="https://images.beyondsimulations.com/ao/ao_routing-subtours-03.svg" style="width:99.0%" />

-   Tour of vehicle A ok
-   Depot is the only node <span class="highlight">visited multiple times</span>
-   But the constraints are **not applied here!**

## Tour on its Own

<img src="https://images.beyondsimulations.com/ao/ao_routing-subtours-04.svg" style="width:99.0%" />

-   Let's start at node $H$
-   We drive to node $C$
-   $U_C$ = 1

## Tour on its Own II

<img src="https://images.beyondsimulations.com/ao/ao_routing-subtours-05.svg" style="width:99.0%" />

-   We continue to node $I$
-   $U_I$ = 2

## Tour on its Own III

<img src="https://images.beyondsimulations.com/ao/ao_routing-subtours-06.svg" style="width:99.0%" />

-   We continue to node $H$
-   $U_H$ = 3
-   Connection from $H$ to $C$
-   $U_H$ is **greater** than $U_C$!
-   <span class="highlight">Infeasible solution!</span>

## Subtour Elimination

-   Connection in the other direction wouldn't work as well
-   **Only depot as "reset" **, as constraints are not applied here

<span class="question">Question:</span> **What about the capacity?**

. . .

-   Remember variable domain of $U_i$?
-   $d_i \leq U_i \leq b$ → <span class="highlight">Overall capacity limit enforced!</span>

------------------------------------------------------------------------

# <span class="flow">Last Constraint</span>

## Ensure time limit?

<span class="question">Question:</span> **Anybody an idea?**

. . .

-   Constraints basically **follow the same idea**!
-   First, we again need an additional variable
-   $T_{i}$ - Time spent on tour at the node $i$ of a vehicle with $i \in \mathcal{I}$

## Ensure time limit

> **We need the following sets and variables:**
>
> -   $\mathcal{V}$ - Set of all nodes, index $i \in \{0,1,2,...,n\}$
> -   $X_{i,j}$ - 1, if the arc between $i$ and $j$ is part of a tour, 0 otherwise
> -   $T_{i}$ - Time spent on tour at the node $i$ of a vehicle with $i \in \mathcal{I}$
> -   $t$ - Maximal duration of a tour
> -   $c_{i,j}$ - Travel time on an arc from $i$ to $j$

. . .

$$
T_i - T_j + t \times X_{i,j} \leq t - c_{i,j} \quad \forall i,j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

. . .

$$
0 \leq T_{i} \leq t \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

## 

Any questions?

------------------------------------------------------------------------

# <span class="flow">Asymmetric Vehicle Routing Problem</span>

## Objective

$$
\text{minimize} \quad \sum_{(i,j) \in \mathcal{A}} c_{i,j} \times X_{i,j}
$$

> **The goal of the objective function is to:**
>
> Minimize the total travel distance.

## Each customer is visited once

$$
\sum_{i \in \mathcal{V}} X_{i,j} = 1 \quad \forall j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

$$
\sum_{j \in \mathcal{V}} X_{i,j} = 1 \quad \forall i \in \mathcal{V} \setminus \{0\}, i \neq j
$$

> **Our constraints ensure:**
>
> Each customer is visited exactly once.

## Depot entry and exit

$$
\sum_{i \in \mathcal{V} \setminus \{0\}} X_{i,0} = |\mathcal{K}|
$$

$$
\sum_{j \in \mathcal{V} \setminus \{0\}} X_{0,j} = |\mathcal{K}|
$$

> **Our constraints ensure:**
>
> The depot is visited by exactly $|\mathcal{K}|$ vehicles. Note, that we could remove one of the constraints and the solution would still be optimal.

## Capacity and subtour elimination

$$
U_i - U_j + b \times X_{i,j} \leq b - d_j \quad \forall i,j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

$$
d_i \leq U_i \leq b \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

> **Our constraints ensure:**
>
> The capacity limit is respected and subtours are eliminated.

## Time constraints

$$
T_i - T_j + t \times X_{i,j} \leq t - c_{i,j} \quad \forall i,j \in \mathcal{V} \setminus \{0\}, i \neq j
$$

$$
0 \leq T_i \leq t \quad \forall i \in \mathcal{V} \setminus \{0\}
$$

> **Our constraints ensure:**
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

> **The variable domains make sure that:**
>
> The binary setup variable is either 0 or 1 and the new variables are below the time and capacity limit.

------------------------------------------------------------------------

# <span class="flow">Model Characteristics</span>

## Characteristics

<span class="question">Questions:</span> **On model characteristics**

-   Is the model formulation linear/ non-linear?
-   What kind of variable domains do we have?
-   What do you think, can the model be solved quickly?

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

-   What assumptions have we made?
-   What are likely issues that can arise if the model is applied?
-   Have we considered service times?

------------------------------------------------------------------------

## Extensions of the CVRP

<span class="question">Questions:</span> **What extensions do you know?**

. . .

-   time windows (TW)
-   soft time windows (STW)
-   multiple depots (MD)
-   heterogeneous fleet (HF)
-   backhauls (B)
-   pickup and delivery (PD)

------------------------------------------------------------------------

# <span class="flow">Implementation and Impact</span>

## <span class="invert-font">Case Study in Schleswig-Holstein</span>

. . .

-   165 libraries
-   119 visited biweekly
-   Up to 9 different tours
-   Time-Limit of 8 hours for each tour

## 

Can our formulation

solve the problem

on a real-world instance?

## 

No, although we can find

solutions within one hour,

the gap is still very large

with 40%-45%.

------------------------------------------------------------------------

## Problem is NP-hard

-   We have already seen that a problem **can be NP-hard**
-   Likely, that there are **no polynomial-time algorithms**
-   <span class="highlight">Doesn't mean that it can't be solved!</span>

. . .

> **Note**
>
> We won't go deeper into this, but feel free to ask me!

## 

Can we do

anything to solve

the model?

## Heuristics

-   We can still solve the problem **with a heuristic**
-   <span class="highlight">Likely not the optimal solution</span>, but a lot of research goes into efficient algorithms to solve these problems
-   In our case study we applied **Hybrid Genetic Search** for the CVRP (HGS-CVRP) by Vidal (2022)

. . .

> **Tip**
>
> For problems with 100+ locations, heuristics are often the only practical choice.

------------------------------------------------------------------------

## Applications Beyond Libraries

**Logistics & Delivery**

-   Package delivery
-   Food delivery services
-   Grocery delivery
-   Mail distribution

**Service Industries**

-   Maintenance crews
-   Home healthcare visits
-   Waste collection
-   School bus routing

. . .

<span class="question">Question:</span> **Can you think of other applications?**

## Conclusion

-   Standard problem that <span class="highlight">occurs in many different places</span>
-   Solving the problem with a mathematical model **is difficult**
-   Nowadays, there are **many good heuristics**
-   **Many companies** are working on the problem

. . .

> **And that's it for todays lecture!**
>
> We now have covered the Capacitated Vehicle Routing Problem and are ready to start solving some tasks in the upcoming tutorial.

## 

Questions?

------------------------------------------------------------------------

# <span class="flow">Literature</span>

## Literature I

For more interesting literature to learn more about Julia, take a look at the [literature list](../general/literature.qmd) of this course.

## Literature II

Kara, Imdat, Gilbert Laporte, and Tolga Bektas. 2004. "A Note on the Lifted Miller--Tucker--Zemlin Subtour Elimination Constraints for the Capacitated Vehicle Routing Problem." *European Journal of Operational Research* 158 (3): 793--95. https://doi.org/<https://doi.org/10.1016/S0377-2217(03)00377-1>.

Vidal, Thibaut. 2022. "Hybrid Genetic Search for the CVRP: Open-Source Implementation and SWAP\* Neighborhood." *Computers & Operations Research* 140 (April): 105643. <https://doi.org/10.1016/j.cor.2021.105643>.

[^1]: Due to regulations, the delivery tours cannot exceed a certain duration
