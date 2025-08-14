---
title: Lecture VI - Minimizing Split Orders in E-Commerce
subtitle: Applied Optimization with Julia
author: Dr. Tobias Vlćek
format:
  revealjs:
    footer: ' {{< meta title >}} | {{< meta author >}} | [Home](lecture-06-ordersplit.qmd)'
    output-file: lecture-06-presentation.html
format-links:
  - text: PDF
    href: lecture-06-presentation.pdf
    icon: file-pdf
---


# <span class="flow">Introduction</span>

## <span class="invert-font">E-Commerce Trends</span>

<span class="invert-font fragment">**Question:** What are current trends in e-commerce?</span>

## E-Commerce Sales

-   E-Commerce sales <span class="highlight">are growing fast</span>:
    -   Products are **no longer bound between borders**
    -   Product variety is **rising**
    -   Consumer shopping patterns are **shifting **
    -   Brick-and-mortar stores **loose customers to the internet**
    -   Covid-19 **accelerated this trend even more**

## Parcels Worldwide

-   The number of parcels is rising:
    -   **2014**: 44 billion parcels (Pitney Bowes Inc. 2017)
    -   **2019**: 103 billion parcels (Pitney Bowes Inc. 2019)
    -   **2026**: 220 -- 262 billion parcels [^1] (Pitney Bowes Inc. 2020)

## Pressure on infrastructure

<a href="https://unsplash.com/photos/person-holding-black-samsung-android-smartphone-hTUZW7E7krg" width="85%"><img src="https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?q=80&amp;w=2832&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" style="width:90.0%" /></a>

-   Consumers nowadays expect <span class="highlight">free and fast deliveries and returns</span>
-   Existing warehouses have to store an **increasing range of products**
-   Better customer service requires **faster deliveries**
-   Incurred fulfillment costs **depend on the number of parcels**

## Pressure on the environment

<a href="https://unsplash.com/photos/white-and-red-cars-parked-near-white-concrete-building-during-daytime-4jLpCkGqClE" width="85%"><img src="https://images.unsplash.com/photo-1606942298712-8bd250ff40f0?q=80&amp;w=2398&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" style="width:90.0%" /></a>

-   **Each parcel packaging** consumes resources during production
-   Every dispatched parcel to the customer <span class="highlight">causes CO₂ emissions</span>
-   In case of returns, **more parcels cause more emissions**

------------------------------------------------------------------------

# <span class="flow">Problem Structure</span>

## Split Order

<span class="question">Question:</span> **What is a split order?**

. . .

<img src="https://images.beyondsimulations.com/ao/ao_split-unoptimized.png" class="center" style="width:75.0%" />

## No Split Order

<img src="https://images.beyondsimulations.com/ao/ao_split-optimized.png" class="center" style="width:75.0%" />

## Reason for Split Orders

<span class="question">Question:</span> **Why might they occur?**

. . .

-   **Stock availability**: Some products are <span class="highlight">out of stock</span> at a warehouse and need to be fulfilled from another warehouse
-   **Capacity constraints**: Some products are stored at <span class="highlight">different warehouses</span> and need to be shipped from elsewhere

## Impact of Split Orders

<span class="question">Question:</span> **What are the consequences?**

. . .

-   **Higher** shipping costs
-   **Increased** packaging material
-   **More** CO₂ emissions
-   <span class="highlight">Higher operational complexity</span>
-   **Lower** customer satisfaction

## Mitigations?

<span class="question">Question:</span> **What are possible mitigations?**

. . .

-   **Consolidation**: Ship to a central warehouse before dispatch
-   **Cross-docking**: Ship directly from supplier to customer
-   **Transshipment**: Ship between warehouses before delivery
-   **Co-allocation**: Predict <span class="highlight">co-appearance of products</span> and allocate them to the <span class="highlight">same warehouse</span>

## <span class="invert-font">Case Study</span>

**Key information** about the case:

-   a large European e-commerce retailer
-   the retailer has two warehouses
-   product range cannot be stored in either warehouse
-   product deliveries can be made to both warehouses
-   products do not have to be stored exclusively

------------------------------------------------------------------------

# <span class="flow">Problem Structure - Version 1</span>

## Optimizing Co-allocation

<img src="https://images.beyondsimulations.com/ao/ao_split-suppliers.png" class="center" style="width:90.0%" />

<span class="question">**Question:**</span> **What could be our objective?**

We aim to improve the **SKU[^2]-warehouse allocation** to minimize the number of split parcels resulting from **SKUs being stored in different warehouses**.

## Available Sets

<span class="question">Question:</span> **What could be the sets here?**

. . .

-   $\mathcal{I}$ - Set of products indexed by $i \in \{1,2,...,|\mathcal{I}|\}$
-   $\mathcal{K}$ - Set of warehouses indexed by $k \in \{1,\dots,|\mathcal{K}|\}$
-   $\mathcal{M}$ - Set of customer orders $m \in \{1,2,...,|\mathcal{M}|\}$

## Available Parameters

<span class="question">Question:</span> **What are possible parameters?**

. . .

-   $c_k$ - Storage space of warehouse $k \in \{1,\dots,|\mathcal{K}|\}$
-   $\boldsymbol{T}= (t_{m,i})$ - Past customer orders for SKUs

. . .

<span class="question">**Question:**</span> **What could the transactional data look like?**

## Transactional Data

| $t_{m,i}$ | A   | B   | C   | D   |
|-----------|-----|-----|-----|-----|
| 1         | 1   | 1   | 1   | 0   |
| 2         | 1   | 1   | 1   | 0   |
| 3         | 1   | 1   | 0   | 0   |
| 4         | 1   | 0   | 0   | 1   |
| 5         | 1   | 0   | 0   | 1   |
| 6         | 1   | 0   | 0   | 1   |
| 7         | 1   | 0   | 0   | 1   |
| 8         | 0   | 0   | 1   | 1   |

Example of $\boldsymbol{T}$

## Past vs. Future

-   The <span class="highlight">transactional data</span> $\boldsymbol{T}$ is based on **past orders**
-   It is a **binary matrix** of customer orders and SKUs
-   We use this data to **assume** future co-occurrence
    -   <span class="highlight">Past co-occurrence predicts future co-occurrence</span>

. . .

<span class="question">Question:</span> **What is your opinion on the assumption?**

------------------------------------------------------------------------

## Split-Order Minimization

<span class="question">Question:</span> **What could be our decision variable/s?**

. . .

> **We have the following sets:**
>
> -   $\mathcal{I}$ - Set of products indexed by $i \in \{1,2,...,|\mathcal{I}|\}$
> -   $\mathcal{K}$ - Set of warehouses indexed by $k \in \{1,\dots,|\mathcal{K}|\}$
> -   $\mathcal{M}$ - Set of customer orders $m \in \{1,2,...,|\mathcal{M}|\}$

. . .

-   $X_{i,k}$ - 1, if $i\in\mathcal{I}$ is stored in $k\in\mathcal{K}$, 0 otherwise
-   $Y_{m,i,k}$ - 1, if SKU $i\in\mathcal{I}$ is shipped from warehouse $k\in\mathcal{K}$ for customer order $m\in\mathcal{M}$, 0 otherwise

## Integer Programming Model

-   Catalán and Fisher (2012) created an **integer model**
-   Number of SKUs of E-Commerce retailers can easily be **between 10,000 - 100,000**
-   Number of customer orders necessary for "stable" results have to be higher in the order of **100,000 - 10,000,000**

. . .

<span class="question">Question:</span> **Anybody an idea what this could mean?**

## Implementation Challenges

-   Small instance with 10 SKUs and 1000 customer orders
-   **CPLEX 20.1.0** needs 3100 seconds to solve the problem
-   Computation times scales exponentially
-   $\rightarrow$ **Not applicable** in real world applications!

## 

Any idea what

could be done?

------------------------------------------------------------------------

# <span class="flow">Problem Structure - Version 2</span>

## Heuristic Approach

-   **Heuristic**: Fast, but not necessarily optimal
-   **Approximation**: Not guaranteed to be optimal, but close
-   **Computational Effort**: Reasonable even for large instances

. . .

> **Different view on the problem**
>
> Focus on the warehouses and the co-appearance of SKUs! Discard the exact information about the customer orders.

## Objective

<img src="https://images.beyondsimulations.com/ao/ao_split-suppliers.png" style="width:75.0%" />

<span class="question">Question:</span> **What could be the objective?**

<span class="fragment">Maximize the coappearance of products that are often **part of the same customer orders**.</span>

## Transaction Matrix

``` julia
T = [
    1 1 1 0;
    1 1 1 0;
    1 1 0 0;
    1 0 0 1;
    1 0 0 1;
    1 0 0 1;
    1 0 0 1;
    0 0 1 1
]

# Create the coappearance matrix
Q = T' * T
println("Coappearance matrix Q:")
display(Q)
```

    Coappearance matrix Q:

    4×4 Matrix{Int64}:
     7  3  2  4
     3  3  2  0
     2  2  3  1
     4  0  1  5

## Coappearance Matrix

-   $\boldsymbol{Q}$ is a <span class="highlight">symmetric matrix</span>
-   Proposed by Catalán and Fisher (2012)
-   $\boldsymbol{Q} = (\boldsymbol{T}^T \cdot \boldsymbol{T})$ where $\boldsymbol{Q} = (q_{ij})_{i \in \{1,\dots,\mathcal{I}\},j \in \{1,\dots,\mathcal{I}\}}$
-   $q_{ij}$ shows how often $i$ and $j$ appear **in the same order**

. . .

<span class="question">Question:</span> **What do the principal diagonal values tell us?**

. . .

-   How often each SKU appeared over all orders **(binary!)**

------------------------------------------------------------------------

## How to approach the problem?

-   **Greedy Heuristic**[^3]: Allocation based on matrix
-   **Mathematical Model**[^4]: Maximizes coappearance
-   **GRASP**[^5]: Good on small instances
-   <span class="highlight">New</span>: Max. coappearance with non-linear solver
-   <span class="highlight">New</span>: Heuristic based on Chi-Square Tests

## Basic Setting

<img src="https://images.beyondsimulations.com/ao/ao_split-warehouse.png" style="width:75.0%" />

## Available Data (Version 2)

<span class="question">Question:</span> **What could be the sets?**

. . .

-   $\mathcal{I}$ - Set of products indexed by $i \in \{1,2,...,|\mathcal{I}|\}$
-   $\mathcal{K}$ - Set of warehouses indexed by $k \in \{1,\dots,|\mathcal{K}|\}$

. . .

> **No customer order information is needed!**
>
> We can focus on the SKUs and the warehouses, making the problem **much smaller**!

------------------------------------------------------------------------

## Available Parameters

<span class="question">Question:</span> **What are possible parameters?**

-   $c_k$ - Storage space of warehouse $k \in \{1,\dots,|\mathcal{K}|\}$
-   $\boldsymbol{Q}= (q_{ij})_{i \in \{1,\dots,\mathcal{I}\},j \in \{1,\dots,\mathcal{I}\}}$ - Coappearance matrix

. . .

> **Transactional Data replaced**
>
> Instead of the transactional data, we just **use the coappearance matrix** in our model!

------------------------------------------------------------------------

# <span class="flow">Model Formulation</span>

## Decision Variables?

> **We have the following sets:**
>
> -   $\mathcal{I}$ - Set of products indexed by $i \in \{1,2,...,|\mathcal{I}|\}$
> -   $\mathcal{K}$ - Set of warehouses indexed by $k \in \{1,\dots,|\mathcal{K}|\}$

. . .

> **Our objective is to:**
>
> Maximize the coappearance of products that are often part of the same customer orders. **In more mathematical terms:** Maximize the sum of all unique pair-wise values $q_{i,j}$ of all SKUs stored in the same warehouse.

. . .

<span class="question">Question:</span> **What could be our decision variable/s?**

## Decision Variables

-   $X_{i,k}$ - 1, if SKU $i\in\mathcal{I}$ is stored in $k\in\mathcal{K}$, 0 otherwise

. . .

> **Only one variable per SKU and warehouse!**
>
> As we don't need the customer order information, we only need to make a decision for each SKU and warehouse pair!

## Decision Variable in Julia

<span class="question">Question:</span> **How could we formulate the variable in Julia?**

``` julia
import Pkg; Pkg.add("SCIP")
using JuMP, SCIP # SCIP is a non-commercial MIQCP solver

warehouses = ["Hamburg", "Berlin"] # Add warehouses as a vector
skus = ["Smartphone", "Socks", "Charger"] # Add SKUs as a vector

warehouse_model = Model(SCIP.Optimizer)
```

. . .

``` julia
@variable(warehouse_model, X[i in skus, k in warehouses], Bin)
```

    2-dimensional DenseAxisArray{VariableRef,2,...} with index sets:
        Dimension 1, ["Smartphone", "Socks", "Charger"]
        Dimension 2, ["Hamburg", "Berlin"]
    And data, a 3×2 Matrix{VariableRef}:
     X[Smartphone,Hamburg]  X[Smartphone,Berlin]
     X[Socks,Hamburg]       X[Socks,Berlin]
     X[Charger,Hamburg]     X[Charger,Berlin]

------------------------------------------------------------------------

## Objective Function

> **We need the following:**
>
> -   $X_{i,k}$ - 1, if SKU $i\in\mathcal{I}$ is stored in $k\in\mathcal{K}$, 0 otherwise
> -   $q_{ij}$ - Coappearance of SKU $i\in\mathcal{I}$ and $j\in\mathcal{I}$

> **Our objective is to:**
>
> Maximize the sum of all unique pair-wise values $q_{i,j}$ of all SKUs stored in the same warehouse. Note, that this is a **quadratic objective function**!

. . .

<span class="question">Question:</span> **What could the objective function look like?**

. . .

## Quadratic Objective Function

$$\text{maximize} \quad \sum_{i=2}^{\mathcal{I}} \sum_{j=1}^{i-1} \sum_{k \in \mathcal{K}} X_{ik}\times X_{jk} \times q_{ij}$$

. . .

> **This is a **quadratic objective function**!**
>
> The quadratic terms are $X_{ik}\times X_{jk}$. This objective function is based on the **Quadratic Multiple Knapsack Problem (QMKP)**, formulated by Hiley and Julstrom (2006).

## Objective Function in Julia

<span class="question">Question:</span> **How could we formulate this in Julia?**

. . .

``` julia
Q = [2 1 2; 1 2 1; 2 1 2]

@objective(warehouse_model,
    Max,
    sum(
        X[skus[i], warehouses[k]] * X[skus[j], warehouses[k]] * Q[i,j]
        for i in 2:length(skus)
        for j in 1:i-1
        for k in 1:length(warehouses)
    )
)
```

\$ X\_{Socks,Hamburg}X\_{Smartphone,Hamburg} + X\_{Socks,Berlin}X\_{Smartphone,Berlin} + 2 X\_{Charger,Hamburg}X\_{Smartphone,Hamburg} + 2 X\_{Charger,Berlin}X\_{Smartphone,Berlin} + X\_{Charger,Hamburg}X\_{Socks,Hamburg} + X\_{Charger,Berlin}X\_{Socks,Berlin} \$

------------------------------------------------------------------------

# <span class="flow">Constraints</span>

## What constraints?

<img src="https://images.beyondsimulations.com/ao/ao_split-warehouse.png" style="width:90.0%" />

<span class="question">Question:</span> **What constraints?**

-   Allocate each SKU **at least once**
-   Warehouses have a **finite capacity**
-   Capacity is **not exceeded**

------------------------------------------------------------------------

## Single Allocation Constraint?

> **The goal of this constraint is to:**
>
> Ensure that each SKU is allocated at least once.

. . .

> **We need the following variable:**
>
> -   $X_{i,k}$ - 1, if SKU $i\in\mathcal{I}$ is stored in $k\in\mathcal{K}$, 0 otherwise

. . .

<span class="question">Question:</span> **What could the constraint look like?**

## Single Allocation Constraint

$$\sum_{k \in \mathcal{K}} X_{ik} \geq 1 \quad \forall i \in \mathcal{I}$$

. . .

> **Remember, this is the variable:**
>
> -   $X_{i,k}$ - 1, if SKU $i\in\mathcal{I}$ is stored in $k\in\mathcal{K}$, 0 otherwise

. . .

<span class="question">Question:</span> **How could we change the constraint to ensure that each SKU is allocated only once?**

. . .

<span class="question">Question:</span> **How could we add the constraint in Julia?**

## Single Allocation in Julia

``` julia
@constraint(warehouse_model, single_allocation[i in skus],
    sum(X[i, k] for k in warehouses) >= 1
)
```

    1-dimensional DenseAxisArray{ConstraintRef{Model, MathOptInterface.ConstraintIndex{MathOptInterface.ScalarAffineFunction{Float64}, MathOptInterface.GreaterThan{Float64}}, ScalarShape},1,...} with index sets:
        Dimension 1, ["Smartphone", "Socks", "Charger"]
    And data, a 3-element Vector{ConstraintRef{Model, MathOptInterface.ConstraintIndex{MathOptInterface.ScalarAffineFunction{Float64}, MathOptInterface.GreaterThan{Float64}}, ScalarShape}}:
     single_allocation[Smartphone] : X[Smartphone,Hamburg] + X[Smartphone,Berlin] ≥ 1
     single_allocation[Socks] : X[Socks,Hamburg] + X[Socks,Berlin] ≥ 1
     single_allocation[Charger] : X[Charger,Hamburg] + X[Charger,Berlin] ≥ 1

------------------------------------------------------------------------

## Capacity Constraints?

> **The goal of these constraints is to:**
>
> Ensure that the capacity of each warehouse is not exceeded.

. . .

> **We need the following variables and parameters:**
>
> -   $X_{i,k}$ - 1, if SKU $i\in\mathcal{I}$ is stored in $k\in\mathcal{K}$, 0 otherwise
> -   $c_k$ - Storage space of warehouse $k\in\mathcal{K}$

. . .

<span class="question">Question:</span> **What could the second constraint be?**

## Capacity Constraints

$$\sum_{i \in \mathcal{I}} X_{ik} \leq c_k \quad \forall k \in \mathcal{K}$$

. . .

<span class="highlight">And that's basically it!</span>

. . .

<span class="question">Question:</span> **How could we add the second constraint in Julia?**

## Capacity Constraints in Julia

``` julia
capacities = Dict("Hamburg" => 2, "Berlin" => 1) # Add capacities

@constraint(warehouse_model, capacity[k in warehouses],
    sum(X[i, k] for i in skus) <= capacities[k]
)
```

    1-dimensional DenseAxisArray{ConstraintRef{Model, MathOptInterface.ConstraintIndex{MathOptInterface.ScalarAffineFunction{Float64}, MathOptInterface.LessThan{Float64}}, ScalarShape},1,...} with index sets:
        Dimension 1, ["Hamburg", "Berlin"]
    And data, a 2-element Vector{ConstraintRef{Model, MathOptInterface.ConstraintIndex{MathOptInterface.ScalarAffineFunction{Float64}, MathOptInterface.LessThan{Float64}}, ScalarShape}}:
     capacity[Hamburg] : X[Smartphone,Hamburg] + X[Socks,Hamburg] + X[Charger,Hamburg] ≤ 2
     capacity[Berlin] : X[Smartphone,Berlin] + X[Socks,Berlin] + X[Charger,Berlin] ≤ 1

------------------------------------------------------------------------

## QMK Model

$$\text{maximize} \quad \sum_{i=2}^{\mathcal{I}} \sum_{j=1}^{i-1} \sum_{k \in \mathcal{K}} X_{ik}\times X_{jk} \times q_{ij}$$

subject to:

$$
\begin{align*}
                & \sum_{k \in \mathcal{K}} X_{ik} \geq 1 && \forall i \in \mathcal{I}\\
                & \sum_{i \in \mathcal{I}} X_{ik} \leq c_{k} && \forall k \in \mathcal{K}\\
                & X_{ik} \in \{0,1\}  && \forall i \in \mathcal{I}, \forall k \in \mathcal{K}
\end{align*}
$$

## QMK Model in Julia

``` julia
set_attribute(warehouse_model, "display/verblevel", 0) # Hide solver output
optimize!(warehouse_model)

println("The optimal objective value is: ", objective_value(warehouse_model))
println("The optimal solution is: ", value.(X))
```

    The optimal objective value is: 2.0
    The optimal solution is: 2-dimensional DenseAxisArray{Float64,2,...} with index sets:
        Dimension 1, ["Smartphone", "Socks", "Charger"]
        Dimension 2, ["Hamburg", "Berlin"]
    And data, a 3×2 Matrix{Float64}:
      1.0  0.0
     -0.0  1.0
      1.0  0.0

------------------------------------------------------------------------

# <span class="flow">Model Characteristics</span>

## Characteristics

-   Is the model formulation **linear/ non-linear?**
-   What kind of **variable domain** do we have?
-   Do we know the **split-orders** based on the **objective value?**
-   Why **couldn't we use HiGHS** as solver?

## Choosing a solver

-   Identify **problem structure**, e.g. LP, MIP, NLP, QCP, MIQCP, ...
-   What is the **size** of the problem?
-   Is a **commercial** solver needed?

. . .

> **Commercial Solvers**
>
> Commercial solvers are **faster** and **more robust** as open source solvers but also **more expensive**. During your studies, you can use most of them for free though! Nonetheless, we will only use open source solvers in this course.

## Global vs Local Optimality

<figure>
<a href="https://www.allaboutlean.com/polca-pros-and-cons/local-global-optimum/"><img src="https://i0.wp.com/www.allaboutlean.com/wp-content/uploads/2018/08/Local-Global-Optimum.png?w=1040&amp;ssl=1" style="width:80.0%" /></a>
<figcaption>Local vs Global Optimum by Christoph Roser</figcaption>
</figure>

------------------------------------------------------------------------

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

-   What assumptions have we made?
-   Problem with allocating SKUs to multiple warehouses?
-   What else might pose a problem in the real world?

# <span class="flow">Impact</span>

## 

Can this be

applied?

## Problem Size is Crucial

-   Up to 10,000 SKUs → **commercial solvers**
-   More than 10,000 SKUs → **heuristics**
-   For example, the <span class="highlight">CHI</span> heuristic

. . .

> **CHI-Heuristic**
>
> Detect dependencies between products and allocate them accordingly, as products within orders can have dependencies and products are bought with different frequencies!

------------------------------------------------------------------------

## Case Study

-   More than 100,000 SKUs and several millions of orders
-   Comparison of **different heuristics**[^6]
    -   **CHI**: based on Chi-Square tests Vlćek and Voigt (2024)
    -   **GP, GO, GS, BS**: based on greedy algorithms (Catalán and Fisher 2012)
    -   **RA**: Random allocation of SKUs to warehouses

## Real Data Set

<img src="https://images.beyondsimulations.com/ao/ao_split-case.png" style="width:80.0%" />

## Conclusion

-   Splits are **of no benefit**, except **faster customer deliveries**
-   <span class="highlight">Increase workload, packaging and shipping costs</span>
-   Mathematical Optimisation of **"full" problem not solvable**
-   **CHI** Heuristic close to mathematical optimisation

> **And that's it for todays lecture!**
>
> We now have covered the Quadratic Multiple Knapsack Problem and are ready to start solving some tasks in the upcoming tutorial.

## 

Questions?

------------------------------------------------------------------------

# <span class="flow">Literature</span>

## Literature I

For more interesting literature to learn more about Julia, take a look at the [literature list](../general/literature.qmd) of this course.

Catalán, Andrés, and Marshall Fisher. 2012. "Assortment Allocation to Distribution Centers to Minimize Split Customer Orders." *SSRN Electronic Journal*. <https://doi.org/10.2139/ssrn.2166687>.

Hiley, Amanda, and Bryant A. Julstrom. 2006. "The Quadratic Multiple Knapsack Problem and Three Heuristic Approaches to It." In *Proceedings of the 8th Annual Conference on Genetic and Evolutionary Computation*, edited by M. Keijzer, 547--52. New York, NY: Association for Computing Machinery. <https://doi.org/10.1145/1143997.1144096>.

Pitney Bowes Inc. 2017. "<span class="nocase">Pitney Bowes Parcel Shipping Index Reveals 48 Percent Growth in Parcel Volume since 2014</span>." 2017. <https://www.businesswire.com/news/home/20170830005628/en/Pitney-Bowes-Parcel-Shipping-Index-Reveals-48>.

---------. 2019. "<span class="nocase">Pitney Bowes Parcel Shipping Index Reports Continued Growth Bolstered by China and Emerging Markets</span>." 2019. <https://www.businesswire.com/news/home/20191010005148/en/>.

---------. 2020. "<span class="nocase">Pitney Bowes Parcel Shipping Index Reports Continued Growth as Global Parcel Volume Exceeds 100 billion for First Time Ever</span>." 2020. <https://www.businesswire.com/news/home/20201012005150/en/>.

Vlćek, Tobias, and Guido Voigt. 2024. "Optimizing SKU-Warehouse Allocations to Minimize Split Parcels in E-Commerce Environments." *Submitted to Decision Sciences*.

Zhu, Shan, Xiangpei Hu, Kai Huang, and Yufei Yuan. 2021. "Optimization of Product Category Allocation in Multiple Warehouses to Minimize Splitting of Online Supermarket Customer Orders." *European Journal of Operational Research* 290 (2): 556--71. <https://doi.org/10.1016/j.ejor.2020.08.024>.

[^1]: Forecast, not actual number

[^2]: SKU: Stock Keeping Unit

[^3]: Simple and very fast, Catalán and Fisher (2012)

[^4]: Computationally intensive with CPLEX, Zhu et al. (2021)

[^5]: Greedy Randomized Adaptive Search Procedure, Zhu et al. (2021)

[^6]: QMKP is not applicable for instance in case study
