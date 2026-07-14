---
title: Lecture V - Planning in Breweries
subtitle: Applied Optimization with Julia
author: Dr. Tobias Vlćek
format:
  revealjs:
    footer: ' {{< meta title >}} | {{< meta author >}} | [Home](lecture-05-production.qmd)'
    output-file: lecture-05-presentation.html
---


# <span class="flow">Introduction</span>

## Case Study

<a href="https://unsplash.com/" width="85%"><img src="https://images.unsplash.com/photo-1719752486455-3c6809b5e238?q=80&amp;w=3456&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" style="width:90.0%" data-fig-alt="Copper brewing kettles in a brewery" /></a>

- **Large brewery**
- Brews and sells beverages
- Production planning by hand
- Planner has a <span class="highlight">lot of experience</span>
- **But** will retire soon

## Challenges

<a href="https://unsplash.com/" width="85%"><img src="https://images.unsplash.com/photo-1518542698889-ca82262f08d5?q=80&amp;w=3687&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" style="width:90.0%" data-fig-alt="Shelves with a large variety of beer bottles" /></a>

- **Strong** competition
- Customer **demand is changing**
- Craft beer **gains popularity**
- **Variety** of drinks is increasing
- <span class="highlight">Batch sizes are getting smaller</span>

## Different costs

<a href="https://unsplash.com/photos/a-large-industrial-machine-v-ySKssePQM" width="85%"><img src="https://images.unsplash.com/photo-1651475828382-1ffeea47739b?q=80&amp;w=3000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" style="width:90.0%" data-fig-alt="Industrial bottling line filling beer bottles" /></a>

- Plant can fill **multiple types**
- Time depends on **type and batch**
- **Changing type** leads to setup costs for preparation and cleaning
- **Unsold beer bottles** can be <span class="highlight">stored in a warehouse</span>
- This leads to **inventory costs**

## Learning Objectives

After this lecture, you will be able to:

- **Formulate** the Capacitated Lot-Sizing Problem (CLSP)
- **Explain** the trade-off between setup and inventory holding costs
- **Recognize and construct** Big-M constraints
- **Discuss** the assumptions and limits of a finite planning horizon

## 

Where is the

challenge?

# <span class="flow">Problem Structure</span>

## Objective

<img src="https://images.beyondsimulations.com/ao/ao_clsp_overview.png" style="width:60.0%" data-fig-alt="Overview of the lot-sizing problem: setups, batches, and inventory" />

<span class="question">Question:</span> **What could be the objective?**

<span class="fragment">Minimize the combined setup and inventory holding cost while satisfying the demand and adhering to the production capacity.</span>

## Trade-Off

<img src="https://images.beyondsimulations.com/ao/ao_clsp_overview.png" style="width:60.0%" data-fig-alt="Overview of the lot-sizing problem: setups, batches, and inventory" />

<span class="question">Question:</span> **What is the trade-off?**

<span class="fragment">Larger batches require <span class="highlight">less setup cost per bottle</span>, but increase the storage cost.</span>

------------------------------------------------------------------------

## Available Sets

<span class="question">Question:</span> **What are sets again?**

. . .

Sets are <span class="highlight">collections of objects</span>.

. . .

<span class="question">Question:</span> **What could be the sets here?**

. . .

- $\mathcal{I}$ - Set of beer types indexed by $i \in \{1,2,...,|\mathcal{I}|\}$
- $\mathcal{T}$ - Set of time periods indexed by $t \in \{1,2,...,|\mathcal{T}|\}$

## Available Parameters

<span class="question">Question:</span> **What are possible parameters?**

. . .

- $a_t$ - Available time on the bottling plant in period $t\in\mathcal{T}$
- $b_i$ - Time used for bottling one unit of beer type $i\in\mathcal{I}$
- $g_i$ - Setup time for beer type $i\in\mathcal{I}$
- $f_i$ - Setup cost of beer type $i\in\mathcal{I}$
- $c_i$ - Inventory holding cost for one unit of beer type $i\in\mathcal{I}$
- $d_{i,t}$ - Demand of beer type $i\in\mathcal{I}$ in period $t\in\mathcal{T}$

## Decision Variables?

> **We have the following sets:**
>
> - Beer types indexed by $i \in \{1,2,...,|\mathcal{I}|\}$
> - Time periods of the planning horizon indexed by $t \in \{1,2,...,|\mathcal{T}|\}$

. . .

> **Our objective is to:**
>
> Minimize the combined setup and inventory holding cost while satisfying the demand and adhering to the production capacity.

. . .

<span class="question">Question:</span> **What could be our decision variable/s?**

## Decision Variables

- $W_{i,t}$ - Inventory of type $i\in\mathcal{I}$ at the end of $t\in\mathcal{T}$
- $Y_{i,t}$ - 1, if type $i\in\mathcal{I}$ is bottled in $t\in\mathcal{T}$, 0 otherwise
- $X_{i,t}$ - Batch size of type $i\in\mathcal{I}$ in $t\in\mathcal{T}$

# <span class="flow">Model Formulation</span>

## Objective Function?

> **Our objective is to:**
>
> Minimize the combined setup and inventory holding cost while satisfying the demand and adhering to the production capacity.

. . .

<span class="question">Question:</span> **What could be our objective function?**

. . .

> **We need the following variables:**
>
> - $W_{i,t}$ - Inventory of type $i\in\mathcal{I}$ at the end of $t\in\mathcal{T}$
> - $Y_{i,t}$ - 1, if type $i\in\mathcal{I}$ is bottled in $t\in\mathcal{T}$, 0 otherwise

## Objective Function

> **We need the following parameters:**
>
> - $f_i$ - Setup cost of beer type $i\in\mathcal{I}$
> - $c_i$ - Inventory holding cost for one unit of beer type $i\in\mathcal{I}$

. . .

$$\text{Minimize} \quad \sum_{i \in \mathcal{I}} \sum_{t \in \mathcal{T}} (c_i \times W_{i,t} + f_i \times Y_{i,t})$$

## Constraints

<img src="https://images.beyondsimulations.com/ao/ao_clsp_overview.png" style="width:60.0%" data-fig-alt="Overview of the lot-sizing problem: setups, batches, and inventory" />

<span class="question">Question:</span> **What constraints?**

- Transfer **unused** inventory
- **Fulfill** the customer demand
- **Set up** beer types
- Calculate **batch size** per set-up
- Compute **remaining** inventory
- **Limit** the bottling plant

## Demand/Inventory Constraints?

> **The goal of these constraints is to:**
>
> Consider the current inventory and batch sizes and compute the remaining inventory.

. . .

> **We need the following variables and parameters:**
>
> - $W_{i,t}$ - Inventory of beer type $i\in\mathcal{I}$ at the end of period $t\in\mathcal{T}$
> - $X_{i,t}$ - Batch size of beer type $i\in\mathcal{I}$ in $t\in\mathcal{T}$
> - $d_{i,t}$ - Demand of beer type $i\in\mathcal{I}$ in period $t\in\mathcal{T}$

. . .

<span class="question">Question:</span> **What could the constraint look like?**

## Demand/Inventory Constraints

$$W_{i,t-1} + X_{i,t} - W_{i,t} = d_{i,t} \quad \forall i\in\mathcal{I}, t\in\mathcal{T}$$

with $W_{i,0} = 0$, as the warehouse starts empty.

. . .

> **Remember, these are the variables and parameters:**
>
> - $W_{i,t}$ - Inventory of beer type $i\in\mathcal{I}$ at the end of period $t\in\mathcal{T}$
> - $X_{i,t}$ - Batch size of beer type $i\in\mathcal{I}$ in $t\in\mathcal{T}$
> - $d_{i,t}$ - Demand of beer type $i\in\mathcal{I}$ in period $t\in\mathcal{T}$

## Why Fix the Starting Inventory?

<span class="question">Question:</span> **Why do we have to fix $W_{i,0} = 0$?**

. . .

Otherwise, the solver could invent free starting inventory and would never need to bottle anything for the first weeks!

## Setup Constraints?

> **The goal of these constraints is to:**
>
> Set up beer types in all periods where the batch size is $>$ 0.

. . .

> **We need the following variables and parameters:**
>
> - $Y_{i,t}$ - 1, if beer type $i\in\mathcal{I}$ is bottled in period $t\in\mathcal{T}$, 0 otherwise
> - $X_{i,t}$ - Batch size of beer type $i\in\mathcal{I}$ in $t\in\mathcal{T}$
> - $d_{i,t}$ - Demand of beer type $i\in\mathcal{I}$ in period $t\in\mathcal{T}$

. . .

<span class="question">Question:</span> **What could the second constraint be?**

## Setup Constraints

$$X_{i,t} \leq Y_{i,t} \times \sum_{\tau \in \mathcal{T}} d_{i,\tau} \quad \forall i\in\mathcal{I}, t\in\mathcal{T}$$

. . .

<span class="question">Question:</span> **Do you know this type of constraint?**

. . .

This type of constraint is called a **"Big-M"** constraint!

. . .

- **M** (here $\sum_{\tau \in \mathcal{T}} d_{i,\tau}$) is a large number
- It is coupled with a binary variable (here $Y_{i,t}$)
- <span class="highlight">Like an if-then constraint</span>

## Capacity Constraints?

> **The goal of these constraints is to:**
>
> Limit the capacity of the bottling plant per period.

. . .

> **We need the following variables and parameters:**
>
> - $Y_{i,t}$ - 1, if beer type $i\in\mathcal{I}$ is bottled in period $t\in\mathcal{T}$, 0 otherwise
> - $X_{i,t}$ - Batch size of beer type $i\in\mathcal{I}$ in $t\in\mathcal{T}$
> - $a_t$ - Available time on the bottling plant in period $t\in\mathcal{T}$
> - $b_i$ - Time used for bottling one unit of beer type $i\in\mathcal{I}$
> - $g_i$ - Setup time for beer type $i\in\mathcal{I}$

## Capacity Constraints

<span class="question">Question:</span> **What could the third constraint be?**

It uses more parameters than the previous constraints, but it is easier to understand.

. . .

$$\sum_{i \in \mathcal{I}} (b_i \times X_{i,t} + g_i \times Y_{i,t}) \leq a_t \quad \forall t\in\mathcal{T}$$

. . .

<span class="highlight">And that's basically it!</span>

## CLSP: Objective Function

The complete model is known as the **Capacitated Lot-Sizing Problem (CLSP)**.

$$\text{Minimize} \quad \sum_{i \in \mathcal{I}} \sum_{t \in \mathcal{T}} (c_i \times W_{i,t} + f_i \times Y_{i,t})$$

> **The goal of the objective function is to:**
>
> Minimize the combined setup and inventory holding cost while satisfying the demand and adhering to the production capacity.

## CLSP: Constraints

$$W_{i,t-1} + X_{i,t} - W_{i,t} = d_{i,t} \quad \forall i\in\mathcal{I}, t\in\mathcal{T} \quad (W_{i,0} = 0)$$

$$X_{i,t} \leq Y_{i,t} \times \sum_{\tau \in \mathcal{T}} d_{i,\tau} \quad \forall i\in\mathcal{I}, t\in\mathcal{T}$$

$$\sum_{i \in \mathcal{I}} (b_i \times X_{i,t} + g_i \times Y_{i,t}) \leq a_t \quad \forall t\in\mathcal{T}$$

> **Our constraints ensure:**
>
> Demand is met, inventory transferred, setup taken care of, and capacity respected.

## CLSP: Variable Domains

$$Y_{i,t}\in\{0,1\} \quad \forall i\in\mathcal{I},t\in\mathcal{T}$$

$$W_{i,t}, X_{i,t}\geq 0 \quad \forall i\in\mathcal{I},t\in\mathcal{T}$$

> **The variable domains make sure that:**
>
> The binary setup variable is either 0 or 1 and that the inventory and batch size are non-negative.

. . .

<span class="question">Question:</span> **Why is a continuous batch size acceptable here?**

. . .

At this scale, rounding a batch of thousands of bottles changes the cost only marginally.

# <span class="flow">Julia Implementation</span>

## Variables in Julia

<span class="question">Question:</span> **How could we formulate the variables in Julia?**

. . .

``` julia
using JuMP, HiGHS
beer_types = ["IPA", "Lager", "Stout"] # Beer types
periods = 1:3 # Time periods (weeks)
clsp_model = Model(HiGHS.Optimizer)
set_silent(clsp_model) # Hide the solver output
```

. . .

``` julia
@variable(clsp_model, Y[i in beer_types, t in periods], Bin)
@variable(clsp_model, X[i in beer_types, t in periods] >= 0)
@variable(clsp_model, W[i in beer_types, t in 0:last(periods)] >= 0)
```

    2-dimensional DenseAxisArray{JuMP.VariableRef,2,...} with index sets:
        Dimension 1, ["IPA", "Lager", "Stout"]
        Dimension 2, 0:3
    And data, a 3×4 Matrix{JuMP.VariableRef}:
     W[IPA,0]    W[IPA,1]    W[IPA,2]    W[IPA,3]
     W[Lager,0]  W[Lager,1]  W[Lager,2]  W[Lager,3]
     W[Stout,0]  W[Stout,1]  W[Stout,2]  W[Stout,3]

. . .

Note, how we declare the inventory $W$ also for period 0!

## Objective Function in Julia

$$\text{Minimize} \quad \sum_{i \in \mathcal{I}} \sum_{t \in \mathcal{T}} (c_i \times W_{i,t} + f_i \times Y_{i,t})$$

. . .

``` julia
c = Dict("IPA" => 0.1, "Lager" => 0.1, "Stout" => 0.1) # Holding costs
f = Dict("IPA" => 5000, "Lager" => 4000, "Stout" => 6000) # Setup costs
```

. . .

``` julia
@objective(clsp_model, Min,
    sum(c[i] * W[i,t] + f[i] * Y[i,t]
        for i in beer_types, t in periods)
)
```

## Data for our Small Brewery

We need the demand $d_{i,t}$, capacity $a_t$, and times $b_i$, $g_i$:

. . .

``` julia
d = Dict( # Demand per beer type and week
    "IPA"   => [300, 800, 500],
    "Lager" => [600, 500, 800],
    "Stout" => [200, 300, 250],
)
a = [1800, 1800, 1800] # Capacity per week in minutes
b = Dict("IPA" => 0.9, "Lager" => 0.6, "Stout" => 1.2) # Min. per bottle
g = Dict("IPA" => 60, "Lager" => 40, "Stout" => 80) # Setup in minutes
```

## Constraints in Julia

The constraints map almost one-to-one from the math:

. . .

``` julia
@constraint(clsp_model, [i in beer_types],
    W[i,0] == 0) # The warehouse starts empty
@constraint(clsp_model, [i in beer_types, t in periods],
    W[i,t-1] + X[i,t] - W[i,t] == d[i][t])
```

. . .

``` julia
@constraint(clsp_model, [i in beer_types, t in periods],
    X[i,t] <= sum(d[i]) * Y[i,t]) # Big-M setup constraint
@constraint(clsp_model, [t in periods],
    sum(b[i] * X[i,t] + g[i] * Y[i,t] for i in beer_types) <= a[t])
```

## Solving the Model

``` julia
optimize!(clsp_model)
println("Status: ", termination_status(clsp_model))
println("Total cost: ", objective_value(clsp_model))
```

    Status: OPTIMAL
    Total cost: 28130.0

. . .

Of the 28,130 total cost, 28,000 are setup costs and only 130 are inventory holding costs --- but what does the plan look like?

## The Production Plan

``` julia
for i in beer_types
    println(rpad(i, 8),
        "X = ", rpad(string([round(Int, value(X[i,t])) for t in periods]), 18),
        "W = ", [round(Int, value(W[i,t])) for t in periods])
end
```

    IPA     X = [300, 1300, 0]    W = [0, 500, 0]
    Lager   X = [600, 500, 800]   W = [0, 0, 0]
    Stout   X = [750, 0, 0]       W = [550, 250, 0]

. . .

- **Stout** is bottled <span class="highlight">only once</span>: week 1 covers all three weeks, saving two setups at 6,000 each
- **Lager** is bottled every week, as the plant capacity is too tight to batch it
- **IPA** batches the demand of week 3 into week 2

# <span class="flow">Model Characteristics</span>

## Recap on some Basics

There exist several types of optimization problems:

- **Linear (LP):** Linear constraints and objective function
- **Mixed-integer (MIP):** Linear constraints and objective function, but discrete variable domains
- **Quadratic (QP):** Quadratic constraints and/or objective
- **Non-linear (NLP):** Non-linear constraints and/or objective
- <span class="highlight">And more!</span>

## Recap on Solution Algorithms

- **Simplex algorithm** to solve LPs
- **Branch & Bound** to solve MIPs
- **Outer-Approximation** for mixed-integer NLPs
- **Matheuristics** (e.g., Fix-and-Optimize, ...)
- **Metaheuristics** (e.g., tabu search, genetic algorithms, ...)
- **Decomposition** methods (Lagrange, Benders, ...)
- **Heuristics** (greedy, construction method, n-opt, ...)
- **Graph theoretical methods** (network flow, shortest path)

## Model Characteristics

<span class="question">Questions:</span> **On model characteristics**

- Is the model formulation linear/ non-linear?
- What kind of variable domains do we have?
- What kind of solver could we use?
- Can the Big-M constraint be tightened?

## Tightening the Big-M

<span class="question">Question:</span> **How small can we make M without cutting off solutions?**

. . .

- Production in period $t$ only serves demand from $t$ onward: $M_{i,t} = \sum_{\tau \in \mathcal{T} | \tau \geq t} d_{i,\tau}$
- Capacity limits a batch as well: $M_{i,t} = (a_t - g_i)/b_i$

. . .

The <span class="highlight">smaller</span> of the two is the tighter bound --- and tighter formulations are usually solved faster!

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

- What assumptions have we made?
- What is the problem with the planning horizon?
- Any idea how to solve it?

. . .

> **End-of-horizon effect**
>
> The model plans no inventory for demand after week $|\mathcal{T}|$, as it does not know about it. In practice, this is solved by re-planning on a **rolling horizon**.

# <span class="flow">Impact</span>

## 

Can this be

applied?

## <span class="invert-font">Scale as a Problem</span>

<span class="invert-font fragment">Solving the problem with commercial solvers is not tractable, as it takes too long.</span>

## Scale of the Case Study

- **220** finished products
- **100** semi-finished products
- **13** production resources
- **8** storage resources
- **3** main production levels
- **52** weeks planning horizon

. . .

Our CLSP is the **single-level core** of this problem --- the real case is multi-level, with semi-finished products and storage resources.

## 

Any idea what

could be done?

## Heuristics and Optimization

- Multi-level Capacitated Lot-Sizing Problem
- Heuristic fix and optimize approach [^1]
- Operating cost reduction by 5% and planning effort by 40%

. . .

> **And that's it for today's lecture!**
>
> We now have covered the basics of the CLSP and are ready to start solving some tasks in the upcoming tutorial.

## 

Questions?

# <span class="flow">Literature</span>

## Literature

For more interesting literature to learn more about Julia, take a look at the [literature list](../general/literature.qmd) of this course.

Mickein, Markus, Matthes Koch, and Knut Haase. 2022. "A Decision Support System for Brewery Production Planning at Feldschlösschen." *INFORMS Journal on Applied Analytics* 52 (2): 158--72.

[^1]: Mickein et al. (2022)
