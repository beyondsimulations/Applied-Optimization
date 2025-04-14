# Lecture V - Production Planning in Breweries
Dr. Tobias Vlćek

# <span class="flow">Introduction</span>

## Case Study

<div class="columns">

<div class="column" width="40%">

<a href="https://unsplash.com/" width="85%"><img
src="https://images.unsplash.com/photo-1719752486455-3c6809b5e238?q=80&amp;w=3456&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
style="width:90.0%" /></a>

</div>

<div class="column" width="60%">

- **Large brewery**
- Brews and sells beverages
- Production planning by hand
- Planner has a <span class="highlight">lot of experience</span>
- **But** will retire soon

</div>

</div>

## Challenges

<div class="columns">

<div class="column" width="40%">

<a href="https://unsplash.com/" width="85%"><img
src="https://images.unsplash.com/photo-1518542698889-ca82262f08d5?q=80&amp;w=3687&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
style="width:90.0%" /></a>

</div>

<div class="column" width="60%">

- **Strong** competition
- Customer **demand is changing**
- Craft beer **gains popularity**
- **Variety** of drinks is increasing
- <span class="highlight">Batch sizes are getting smaller</span>

</div>

</div>

## Different costs

<div class="columns">

<div class="column" width="40%">

<a
href="https://unsplash.com/photos/a-large-industrial-machine-v-ySKssePQM"
width="85%"><img
src="https://images.unsplash.com/photo-1651475828382-1ffeea47739b?q=80&amp;w=3000&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
style="width:90.0%" /></a>

</div>

<div class="column" width="60%">

- Plant can fill **multiple types**
- Time depends on **type and batch**
- **Changing type** leads to set-up costs for preparation and cleaning
- **Unsold beer bottles** can be <span class="highlight">stored in a
  warehouse</span>
- This leads to **inventory costs**

</div>

</div>

## 

<div class="r-fit-text">

Where is the

challenge?

</div>

<div class="footer">

</div>

------------------------------------------------------------------------

# <span class="flow">Problem Structure</span>

## Objective

<div class="columns">

<div class="column" width="40%">

<img src="https://images.beyondsimulations.com/ao/ao_clsp_overview.png"
style="width:60.0%" />

</div>

<div class="column" width="60%">

<span class="question">Question:</span> **What could be the objective?**

<span class="fragment">Minimize the combined setup and inventory holding
cost while satisfying the demand and adhering to the production
capacity.</span>

</div>

</div>

## Trade-Off

<div class="columns">

<div class="column" width="40%">

<img src="https://images.beyondsimulations.com/ao/ao_clsp_overview.png"
style="width:60.0%" />

</div>

<div class="column" width="60%">

<span class="question">Question:</span> **What is the trade-off?**

<span class="fragment">Larger batches require
<span class="highlight">less setup cost per bottle</span>, but increase
the storage cost.</span>

</div>

</div>

------------------------------------------------------------------------

## Available Sets

<span class="question">Question:</span> **What are sets again?**

. . .

Sets are <span class="highlight">collections of objects</span>.

. . .

<span class="question">Question:</span> **What could be the sets here?**

. . .

- $\mathcal{I}$ - Set of beer types indexed by
  $i \in \{1,2,...,|\mathcal{I}|\}$
- $\mathcal{T}$ - Set of time periods indexed by
  $t \in \{1,2,...,|\mathcal{T}|\}$

## Available Parameters

<span class="question">Question:</span> **What are possible
parameters?**

. . .

- $a_t$ - Available time on the bottling plant in period
  $t\in\mathcal{T}$
- $b_i$ - Time used for bottling one unit of beer type $i\in\mathcal{I}$
- $g_i$ - Setup time for beer type $i\in\mathcal{I}$
- $f_i$ - Setup cost of beer type $i\in\mathcal{I}$
- $c_i$ - Inventory holding cost for one unit of beer type
  $i\in\mathcal{I}$
- $d_{i,t}$ - Demand of beer type $i\in\mathcal{I}$ in period
  $t\in\mathcal{T}$

------------------------------------------------------------------------

## Decision Variables?

> [!NOTE]
>
> ### We have the following sets:
>
> - Beer types indexed by $i \in \{1,2,...,|\mathcal{I}|\}$
> - Time periods of the planning horizon indexed by
>   $t \in \{1,2,...,|\mathcal{T}|\}$

. . .

> [!IMPORTANT]
>
> ### Our objective is to:
>
> Minimize the combined setup and inventory holding cost while
> satisfying the demand and adhering to the production capacity.

. . .

<span class="question">Question:</span> **What could be our decision
variable/s?**

## Decision Variables

- $W_{i,t}$ - Inventory of type $i\in\mathcal{I}$ at the end of
  $t\in\mathcal{T}$
- $Y_{i,t}$ - 1, if type $i\in\mathcal{I}$ is bottled in
  $t\in\mathcal{T}$, 0 otherwise
- $X_{i,t}$ - Batch size of type $i\in\mathcal{I}$ in $t\in\mathcal{T}$

------------------------------------------------------------------------

# <span class="flow">Model Formulation</span>

## Objective Function?

> [!IMPORTANT]
>
> ### Our objective is to:
>
> Minimize the combined setup and inventory holding cost while
> satisfying the demand and adhering to the production capacity.

. . .

<span class="question">Question:</span> **What could be our objective
function?**

. . .

> [!NOTE]
>
> ### We need the following variables:
>
> - $W_{i,t}$ - Inventory of type $i\in\mathcal{I}$ at the end of
>   $t\in\mathcal{T}$
> - $Y_{i,t}$ - 1, if type $i\in\mathcal{I}$ is bottled in
>   $t\in\mathcal{T}$, 0 otherwise

------------------------------------------------------------------------

## Objective Function

> [!NOTE]
>
> ### We need the following parameters:
>
> - $f_i$ - Setup cost of beer type $i\in\mathcal{I}$
> - $c_i$ - Inventory holding cost for one unit of beer type
>   $i\in\mathcal{I}$

. . .

$$\text{Minimize} \quad \sum_{i=1}^{\mathcal{I}} \sum_{t=1}^{\mathcal{T}} (c_i \times W_{i,t} + f_i \times Y_{i,t})$$

------------------------------------------------------------------------

## Constraints

<div class="columns">

<div class="column" width="40%">

<img src="https://images.beyondsimulations.com/ao/ao_clsp_overview.png"
style="width:60.0%" />

</div>

<div class="column" width="60%">

<span class="question">Question:</span> **What constraints?**

<div class="fragment">

- Transfer **unused** inventory
- **Fulfill** the customer demand
- **Set up** beer types
- Calculate the **batch size** per set-up
- Compute **remaining** inventory
- **Limit** the bottling plant

</div>

</div>

</div>

------------------------------------------------------------------------

## Demand/Inventory Constraints?

> [!IMPORTANT]
>
> ### The goal of these constraints is to:
>
> Consider the current inventory and batch sizes and compute the
> remaining inventory.

. . .

> [!NOTE]
>
> ### We need the following variables and parameters:
>
> - $W_{i,t}$ - Inventory of beer type $i\in\mathcal{I}$ at the end of
>   period $t\in\mathcal{T}$
> - $X_{i,t}$ - Batch size of beer type $i\in\mathcal{I}$ in
>   $t\in\mathcal{T}$
> - $d_{i,t}$ - Demand of beer type $i\in\mathcal{I}$ in period
>   $t\in\mathcal{T}$

. . .

<span class="question">Question:</span> **What could the constraint look
like?**

## Demand/Inventory Constraints

$$W_{i,t-1} + X_{i,t} - W_{i,t} = d_{i,t} \quad \forall i\in\mathcal{I},t\in\mathcal{T}|t>1$$

. . .

> [!NOTE]
>
> ### Remember, these are the variables and parameters:
>
> - $W_{i,t}$ - Inventory of beer type $i\in\mathcal{I}$ at the end of
>   period $t\in\mathcal{T}$
> - $X_{i,t}$ - Batch size of beer type $i\in\mathcal{I}$ in
>   $t\in\mathcal{T}$
> - $d_{i,t}$ - Demand of beer type $i\in\mathcal{I}$ in period
>   $t\in\mathcal{T}$

. . .

<span class="question">Question:</span> **What does $|t>1$ mean?**

------------------------------------------------------------------------

## Setup Constraints?

> [!IMPORTANT]
>
> ### The goal of these constraints is to:
>
> Set up beer types where the batch size is $\geq$ 0.

. . .

> [!NOTE]
>
> ### We need the following variables and parameters:
>
> - $Y_{i,t}$ - 1, if beer type $i\in\mathcal{I}$ is bottled in period
>   $t\in\mathcal{T}$, 0 otherwise
> - $X_{i,t}$ - Batch size of beer type $i\in\mathcal{I}$ in
>   $t\in\mathcal{T}$
> - $d_{i,t}$ - Demand of beer type $i\in\mathcal{I}$ in period
>   $t\in\mathcal{T}$

. . .

<span class="question">Question:</span> **What could the second
constraint be?**

## Setup Constraints

$$X_{i,t} \leq Y_{i,t} \times \sum_{\tau=1}^{\mathcal{T}} d_{i\tau} \quad \forall i\in\mathcal{I},\forall t\in\mathcal{T}$$

. . .

<span class="question">Question:</span> **Do you know this type of
constraint?**

. . .

This type of constraint is called a **“Big-M”** constraint!

. . .

- **M** (here $\sum_{\tau=1}^{\mathcal{T}} d_{i\tau}$) is a large number
- It is coupled with a binary variable (here $Y_{i,t}$)
- <span class="highlight">Like an if-then constraint</span>

------------------------------------------------------------------------

## Capacity Constraints?

> [!IMPORTANT]
>
> ### The goal of these constraints is to:
>
> Limit the capacity of the bottling plant per period.

. . .

> [!NOTE]
>
> ### We need the following variables and parameters:
>
> - $Y_{i,t}$ - 1, if beer type $i\in\mathcal{I}$ is bottled in period
>   $t\in\mathcal{T}$, 0 otherwise
> - $X_{i,t}$ - Batch size of beer type $i\in\mathcal{I}$ in
>   $t\in\mathcal{T}$
> - $a_t$ - Available time on the bottling plant in period
>   $t\in\mathcal{T}$
> - $b_i$ - Time used for bottling one unit of beer type
>   $i\in\mathcal{I}$
> - $g_i$ - Setup time for beer type $i\in\mathcal{I}$

## Capacity Constraints

<span class="question">Question:</span> **What could the third
constraint be?**

It has more variables and parameters when compared to the other
constraints but it is easier to understand.

. . .

$$\sum_{i=1}^{\mathcal{I}} (b_i \times X_{i,t} + g_i \times Y_{i,t}) \leq a_t \quad \forall t\in\mathcal{T}$$

. . .

<span class="highlight">And that’s basically it!</span>

------------------------------------------------------------------------

## CLSP: Objective Function

$$\text{Minimize} \quad \sum_{i \in \mathcal{I}} \sum_{t \in \mathcal{T}} (c_i \times W_{i,t} + f_i \times Y_{i,t})$$

> [!IMPORTANT]
>
> ### The goal of the objective function is to:
>
> Minimize the combined setup and inventory holding cost while
> satisfying the demand and adhering to the production capacity.

## CLSP: Constraints

$$W_{i,t-1} + X_{i,t} - W_{i,t} = d_{i,t} \quad \forall i\in\mathcal{I},t\in\mathcal{T}|t>1$$

$$X_{i,t} \leq Y_{i,t} \times \sum_{\tau \in \mathcal{T}} d_{i,\tau} \quad \forall i\in\mathcal{I},\forall t\in\mathcal{T}$$

$$\sum_{i \in \mathcal{I}} (b_i \times X_{i,t} + g_i \times Y_{i,t}) \leq a_t \quad \forall t\in\mathcal{T}$$

> [!IMPORTANT]
>
> ### Our constraints ensure:
>
> Demand is met, inventory transferred, setup taken care of, and
> capacity respected.

## CLSP: Variable Domains

$$Y_{i,t}\in\{0,1\} \quad \forall i\in\mathcal{I},t\in\mathcal{T}$$

$$W_{i,t}, X_{i,t}\geq 0 \quad \forall i\in\mathcal{I},t\in\mathcal{T}$$

> [!IMPORTANT]
>
> ### The variable domains make sure that:
>
> The binary setup variable is either 0 or 1 and that the inventory and
> batch size are non-negative.

------------------------------------------------------------------------

# <span class="flow">Model Characteristics</span>

## Recap on some Basics

There exist several types of optimization problems:

<div class="incremental">

- **Linear (LP):** Linear constraints and objective function
- **Mixed-integer (MIP):** Linear constraints and objective function,
  but discrete variable domains
- **Quadratic (QP):** Quadratic constraints and/or objective
- **Non-linear (NLP):** Non-linear constraints and/or objective
- <span class="highlight">And more!</span>

</div>

## Recap on Solution Algorithms

<div class="incremental">

- **Simplex algorithm** to solve LPs
- **Branch & Bound** to solve MIPs
- **Outer-Approximation** for mixed-integer NLPs
- **Math-Heuristics** (e.g., Fix-and-Optimize, Tabu-Search, …)
- **Decomposition** methods (Lagrange, Benders, …)
- **Heuristics** (greedy, construction method, n-opt, …)
- **Graph theoretical methods** (network flow, shortest path)

</div>

------------------------------------------------------------------------

## Model Characteristics

<span class="question">Questions:</span> **On model characteristics**

<div class="incremental">

- Is the model formulation linear/ non-linear?
- What kind of variable domains do we have?
- What kind of solver could we use?
- Can the Big-M constraint be tightened?

</div>

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

<div class="incremental">

- What assumptions have we made?
- What is the problem with the planning horizon?
- Any idea how to solve it?

</div>

------------------------------------------------------------------------

# <span class="flow">Impact</span>

## 

<div class="r-fit-text">

Can this be

applied?

</div>

<div class="footer">

</div>

## <span class="invert-font">Scale as a Problem</span>

<span class="invert-font fragment">Solving the problem with commercial
solvers is not feasible.</span>

<div class="footer">

</div>

## Scale of the Case Study

- **220** finished products
- **100** semi-finished products
- **13** production resources
- **8** storage resources
- **3** main production levels
- **52** weeks planning horizon

## 

<div class="r-fit-text">

Any idea what

could be done?

</div>

<div class="footer">

</div>

## Heuristics and Optimization

- Multi-level Capacitated Lot-Sizing Problem
- Heuristic fix and optimize approach [^1]
- Operating cost reduction by 5% and planning effort by 40%

. . .

> [!NOTE]
>
> ### And that’s it for todays lecture!
>
> We now have covered the basics of the CLSP and are ready to start
> solving some tasks in the upcoming tutorial.

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

<div id="ref-mickein2022decision" class="csl-entry">

Mickein, Markus, Matthes Koch, and Knut Haase. 2022. “A Decision Support
System for Brewery Production Planning at Feldschlösschen.” *INFORMS
Journal on Applied Analytics* 52 (2): 158–72.

</div>

</div>

[^1]: Mickein, Koch, and Haase (2022)
