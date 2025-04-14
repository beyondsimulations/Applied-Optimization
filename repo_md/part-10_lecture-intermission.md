# Lecture X - Intermission: Exam Preparation
Dr. Tobias Vlćek

# <span class="flow">Intermission</span>

## Today’s lecture

- Today’s lecture is a **little bit different**
- Manage your expectations
- Give you a **better idea** of what to expect from the exam
- We will go through **some examples together!**

## Exam’s structure

- Exam consists of **three parts**
- Free modelling, questions, Julia coding
- Each point corresponds to <span class="highlight">approximately 1
  minute of work</span>

. . .

> [!IMPORTANT]
>
> You can take a **handwritten** DIN A4 sheet of paper with you!

## Exam Preparation Checklist

> [!TIP]
>
> ### Before starting the exam:
>
> - [ ] Review modeling notation conventions
> - [ ] Practice writing sets, parameters, and variables
> - [ ] Review common constraint patterns
> - [ ] Practice Julia syntax
> - [ ] Prepare your DIN A4 cheat sheet

------------------------------------------------------------------------

# <span class="flow">Part I</span>

## 1.a (6 Points)

A company that ships ice cream wants to maximize their profit. It can do
that by transporting its different sorts of ice cream from their only
production facility to several supermarkets.

Each delivered sort of ice cream makes the ice cream company a different
profit per unit. The transportation costs per truckload are totally
negligible as is the routing, as all supermarkets are located very close
to each other. The company should maximally deliver the agreed number of
units of each ice cream sort to each individual supermarket.

To do so, the company owns one truck which has a fixed total capacity
for a number of units of ice cream. Note, that each unit of ice cream
consumes a different amount of space in the truck! The required space
for each unit of ice cream is given for each sort. The optimal number of
units from each sort to ship to each supermarket should be computed by
the model.

Define all sets, parameters and variables required to model the problem
described above. Select a suitable notation of your choice. Make sure to
explicitly state in your notation which elements are sets, parameters
and variables.

> [!TIP]
>
> Note that the problem does not have to be modeled yet!

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 1.b (2 Points)

Please define the objective function to model the described problem
based on your defined notation.

> [!TIP]
>
> If you need additional sets, parameters or variables that are not yet
> defined, please define them as well.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 1.c (4 Points)

Please define all necessary constraints and the variable ranges to model
the described problem based on your notation.

> [!TIP]
>
> If you need additional sets, parameters or variables that are not yet
> defined, please define them as well.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 1.d (2 Points)

Is the model formulation a linear problem with binary variables?

Please explain your answer briefly.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 1.e (8 Points)

The supermarkets are furious because the company doesn’t always deliver
the agreed truckloads of ice cream. Therefore, they want to penalize the
company in the future, if it delivers less than the agreed amount. For
each demand of a supermarket that could not be fulfilled, the company
will have to pay a one-time fee for the ice-cream sort.

How can you expand your model to reflect this new situation? Write down
all additional or modified sets, parameters, variables, constraints and
the objective function while describing each with a few words.

> [!TIP]
>
> Note, that you only need to write down new and modified elements!

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 1.f (8 Points)

Next to the production facility of the ice cream company sits a company
that sells frozen fish. Due to declining fish stocks in the ocean, the
company does not need all of its trucks. It offers to rent their trucks
for a certain price to the ice cream company so it can transport more
ice cream. These trucks have twice the capacity of the truck currently
in use by the ice cream company.

How can you expand your model to reflect this new situation? Write down
all additional or modified Sets, parameters, variables, constraints and
the objective function while describing each with a few words.

> [!TIP]
>
> Note, that you only need to write down new and modified elements! If
> you haven’t solved the previous task, work with the model defined
> before.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

# <span class="flow">Part II</span>

## 2.a (3 Points)

What is the goal of the Territory Design Problem (Districting Problem)?

Please answer in 2-3 sentences.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 2.b (3 Points)

<div class="columns">

<div class="column" width="50%">

| $t_{mi}$ | A   | B   | C   | D   |
|----------|-----|-----|-----|-----|
| 1        | 0   | 0   | 1   | 1   |
| 2        | 1   | 0   | 1   | 0   |
| 3        | 1   | 0   | 0   | 1   |
| 4        | 1   | 0   | 1   | 1   |
| 5        | 1   | 1   | 0   | 1   |
| 6        | 1   | 1   | 0   | 1   |

</div>

<div class="column" width="50%">

Please compute the coappearance matrix that results from these
transactions.

</div>

</div>

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 2.c (2 Points)

Briefly explain in 2-3 sentences what a global optimum in an
optimization problem is.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 2.d (3 Points)

Name three optimization problems, e.g. Knapsack Problem.

You are welcome to answer this question in bullet points.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 2.e (4 Points)

Explain briefly in 2-3 sentences what so-called “Big-M” constraints can
be used for in mathematical modeling.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

# <span class="flow">Part III</span>

## Hints

> [!NOTE]
>
> ### Programming Tips
>
> - Pay attention to variable names and consistency
> - Check for proper package imports
> - Verify array indexing
> - Remember to use the correct comparison operators
> - Make sure to use proper JuMP syntax

## 3.a (7 Points)

The following Julia code contains seven errors. Highlight the errors in
the code and briefly describe what would need to be done to correct
them.

> [!NOTE]
>
> Assume that all variables containing data are loaded correctly,
> e.g. availablePanels and requestedPanels are already defined.

``` julia
# Load the necessary packages
using JuMP
using HiGHS

# Define the size of the problem instance
nrSuppliers = length(availablePanels)
nrCustomers = length(requestedPanels)

# Create model instance
transport = Model(HiGHS.Optimizer)

# Define variable
@variable(transport_model, X[i = nrSuppliers,j = 1:nrCustomers], Bin)

# Define objective
@objective(transport_model, Max, 
    sum(travelCosts[i,j]* X[i] for i in 1:nrSuppliers, j in 1:nrCustomers)
    )
# Define the constraints
@constraint(transport_model, 
    restrictAvailable[i=1:nrSuppliers], 
    sum(X[i,j] for j in 1:nrCustomers) <= available[i]
    )
@constraint(transport_model,
    restrictDemand[j=1:nrCustomers], 
    sum(X[i,j] for i in 1:nrSuppliers) === requested[j]
    )
# Start optimization
start_optimization(transport_model)
```

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 3.b (4 Points)

In an optimization model, the following equations are given:

$$
\sum_{m\in \mathcal{M}} 7 * U_{gm} * T_m - \sum_{k \in \mathcal{K}} R_k \leq D_g \quad \forall g \in \mathcal{G}
$$

Please **define the equations in correct Julia syntax**.

> [!NOTE]
>
> Assume that all required sets, variables, and parameters have already
> been defined.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 3.c (2 Points)

For an optimization model the following binary variable is supposed to
be created:

$X_{i,j}$ where $i \in \{1,2,...,10\}$ and $j \in \{1,2,...,5\}$.

Specify the definition of the variable in correct Julia syntax.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

## 3.d (2 Points)

What is the difference between a linear and a nonlinear problem? Please
describe the difference in a few sentences.

``` julia
# Your answer here
|
|
|
|
|
|
|
|
|
|
|
|
|
|
```

------------------------------------------------------------------------

# <span class="flow">Wrap Up</span>

## Key Takeaways

> [!IMPORTANT]
>
> ### Remember
>
> - Time management is crucial
> - Read questions carefully
> - Describe your work clearly
> - Use your cheat sheet strategically
> - Double-check your answers if time permits

## The end

> [!NOTE]
>
> ### And that’s it for todays lecture!
>
> We now have covered the structure of the exam and you have a better
> idea of what to expect from the exam. In our upcoming tuorial, we will
> go through some additional examples and practice tasks.

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
