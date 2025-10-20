---
title: Tutorial IV.I - Introduction to Mathematical Optimization with JuMP and HiGHS
subtitle: Applied Optimization with Julia
---


# Introduction

Welcome to this beginner-friendly tutorial on mathematical optimization using JuMP and the HiGHS solver in Julia! Don't worry if these terms sound unfamiliar -- we'll explain everything step by step.

In this tutorial, you'll learn how to:

1.  Set up a simple optimization problem
2.  Define variables and constraints
3.  Create an objective function
4.  Solve the problem and interpret the results

We'll use a real-world example to make these concepts more relatable. Imagine you're managing a small factory that produces two types of products. Your goal is to maximize profit while working within certain limitations. This is exactly the kind of problem that mathematical optimization can solve!

## What is JuMP?

JuMP (Julia for Mathematical Programming) is a powerful tool that helps us describe optimization problems in a way that computers can understand and solve. Think of it as a translator between your business problem and the mathematical solver.

## What is HiGHS?

HiGHS is an open-source solver that can find solutions to the optimization problems we describe using JuMP. It's like a very smart calculator that can handle complex problems quickly and efficiently.

## Our Example Problem

Let's break down our factory management problem:

-   You produce two products: Product A and Product B
-   Each product gives you a different profit:
    -   Product A: 100 profit per unit
    -   Product B: 150 profit per unit
-   You have two departments: Cutting and Finishing
-   Each product requires different amounts of time in each department:
    -   Product A: 2 hours in Cutting, 4 hours in Finishing
    -   Product B: 4 hours in Cutting, 3 hours in Finishing
-   You have limited time available in each department:
    -   Cutting: 40 hours total
    -   Finishing: 60 hours total

Your goal is to decide how many of each product to make to maximize your total profit, while not exceeding the available time in each department.

## Setting Up

First, we need to install and load the necessary packages. If you haven't already installed JuMP and HiGHS, run the following code:

``` julia
import Pkg
Pkg.activate("applied-optimization")
Pkg.add(["JuMP","HiGHS"])
```

Now, let's load these packages:

``` julia
using JuMP, HiGHS
```

<pre><span class="ansi-bright-red-fg ansi-bold">┌ </span><span class="ansi-bright-red-fg ansi-bold">Error: </span>Error during loading of extension SpecialFunctionsExt of ColorVectorSpace, use `Base.retry_load_extensions()` to retry.

<span class="ansi-bright-red-fg ansi-bold">│ </span>  exception =

<span class="ansi-bright-red-fg ansi-bold">│ </span>   1-element ExceptionStack:

<span class="ansi-bright-red-fg ansi-bold">│ </span>   ArgumentError: Package SpecialFunctionsExt [997ecda8-951a-5f50-90ea-61382e97704b] is required but does not seem to be installed:

<span class="ansi-bright-red-fg ansi-bold">│ </span>    - Run `Pkg.instantiate()` to install all recorded dependencies.

<span class="ansi-bright-red-fg ansi-bold">│ </span>   

<span class="ansi-bright-red-fg ansi-bold">│ </span>   Stacktrace:

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [1] <span class="ansi-bold">__require_prelocked</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">pkg</span>::Base.PkgId, <span class="ansi-bright-black-fg">env</span>::Nothing<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2587</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [2] <span class="ansi-bold">_require_prelocked</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">uuidkey</span>::Base.PkgId, <span class="ansi-bright-black-fg">env</span>::Nothing<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2465</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [3] <span class="ansi-bold">_require_prelocked</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">uuidkey</span>::Base.PkgId<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2459</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [4] <span class="ansi-bold">run_extension_callbacks</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">extid</span>::Base.ExtensionId<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:1579</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [5] <span class="ansi-bold">run_extension_callbacks</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">pkgid</span>::Base.PkgId<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:1616</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [6] <span class="ansi-bold">run_package_callbacks</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">modkey</span>::Base.PkgId<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:1432</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [7] <span class="ansi-bold">_require_search_from_serialized</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">pkg</span>::Base.PkgId, <span class="ansi-bright-black-fg">sourcepath</span>::String, <span class="ansi-bright-black-fg">build_id</span>::UInt128, <span class="ansi-bright-black-fg">stalecheck</span>::Bool; <span class="ansi-bright-black-fg">reasons</span>::Dict<span class="ansi-bright-black-fg">{String, Int64}</span>, <span class="ansi-bright-black-fg">DEPOT_PATH</span>::Vector<span class="ansi-bright-black-fg">{String}</span><span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2106</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [8] <span class="ansi-bold">_require_search_from_serialized</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:1981</span><span class="ansi-bright-black-fg"> [inlined]</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>     [9] <span class="ansi-bold">__require_prelocked</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">pkg</span>::Base.PkgId, <span class="ansi-bright-black-fg">env</span>::String<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2599</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [10] <span class="ansi-bold">_require_prelocked</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">uuidkey</span>::Base.PkgId, <span class="ansi-bright-black-fg">env</span>::String<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2465</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [11] <span class="ansi-bold">macro expansion</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2393</span><span class="ansi-bright-black-fg"> [inlined]</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [12] <span class="ansi-bold">macro expansion</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">lock.jl:376</span><span class="ansi-bright-black-fg"> [inlined]</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [13] <span class="ansi-bold">__require</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">into</span>::Module, <span class="ansi-bright-black-fg">mod</span>::Symbol<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2358</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [14] <span class="ansi-bold">require</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">into</span>::Module, <span class="ansi-bright-black-fg">mod</span>::Symbol<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2334</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [15] <span class="ansi-bold">eval</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">m</span>::Module, <span class="ansi-bright-black-fg">e</span>::Any<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Core</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">boot.jl:489</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [16] <span class="ansi-bold">include_string</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">mapexpr</span>::typeof(REPL.softscope), <span class="ansi-bright-black-fg">mod</span>::Module, <span class="ansi-bright-black-fg">code</span>::String, <span class="ansi-bright-black-fg">filename</span>::String<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-bright-black-fg">Base</span> <span class="ansi-bright-black-fg">./</span><span style="text-decoration:underline" class="ansi-bright-black-fg">loading.jl:2843</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [17] <span class="ansi-bold">softscope_include_string</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">m</span>::Module, <span class="ansi-bright-black-fg">code</span>::String, <span class="ansi-bright-black-fg">filename</span>::String<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-magenta-fg">SoftGlobalScope</span> <span class="ansi-bright-black-fg">~/.julia/packages/SoftGlobalScope/u4UzH/src/</span><span style="text-decoration:underline" class="ansi-bright-black-fg">SoftGlobalScope.jl:65</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [18] <span class="ansi-bold">execute_request</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">socket</span>::ZMQ.Socket, <span class="ansi-bright-black-fg">msg</span>::IJulia.Msg<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-cyan-fg">IJulia</span> <span class="ansi-bright-black-fg">~/.julia/packages/IJulia/eenvU/src/</span><span style="text-decoration:underline" class="ansi-bright-black-fg">execute_request.jl:81</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [19] <span class="ansi-bold">eventloop</span><span class="ansi-bold">(</span><span class="ansi-bright-black-fg">socket</span>::ZMQ.Socket<span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-cyan-fg">IJulia</span> <span class="ansi-bright-black-fg">~/.julia/packages/IJulia/eenvU/src/</span><span style="text-decoration:underline" class="ansi-bright-black-fg">eventloop.jl:14</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>    [20] <span class="ansi-bold">(::IJulia.var"#waitloop##2#waitloop##3")</span><span class="ansi-bold">(</span><span class="ansi-bold">)</span>

<span class="ansi-bright-red-fg ansi-bold">│ </span>   <span class="ansi-bright-black-fg">    @</span> <span class="ansi-cyan-fg">IJulia</span> <span class="ansi-bright-black-fg">~/.julia/packages/IJulia/eenvU/src/</span><span style="text-decoration:underline" class="ansi-bright-black-fg">eventloop.jl:58</span>

<span class="ansi-bright-red-fg ansi-bold">└ </span><span class="ansi-bright-black-fg">@ Base loading.jl:1589</span>
</pre>

Great! We're now ready to start building our optimization model.

------------------------------------------------------------------------

# Section 1 - Defining an Optimization Model

The first step in solving an optimization problem is to create a model. This model will contain all the information about our problem: the variables, constraints, and objective.

In JuMP, we create a model like this:

``` julia
model = Model(HiGHS.Optimizer)
println("Optimization model created successfully!")
```

    Optimization model created successfully!

Let's break this down:
- `Model()` creates a new optimization model
- `HiGHS.Optimizer` tells JuMP to use the HiGHS solver for this model

Think of this as creating a blank canvas where we'll paint our optimization problem.

------------------------------------------------------------------------

# Section 2 - Adding Variables

Now that we have our model, we need to define our variables. In our factory problem, the variables represent the quantities of Product A and Product B that we want to produce.

In JuMP, we use the `@variable` macro to define variables. Here's the general syntax:

``` julia
@variable(model_name, variable_name, [additional_properties])
```

Where:

-   `model_name` is the name of your JuMP model
-   `variable_name` is what you want to call your variable
-   `[additional_properties]` can include bounds or variable types

For example, to create a continuous variable that's greater than or equal to 0:

``` julia
@variable(model_name, variable_name >= 0)
```

This defines a continuous variable that's equal to or larger than 0.

## Exercise 2.1 - Create Variables

Now it's your turn! Create two continuous variables equal to or larger than 0 called `productA` and `productB` that represent the number of units produced in our problem for our model `model`.

``` julia
# YOUR CODE BELOW
```

<details class="code-fold">
<summary>Code</summary>

``` julia
# Test your answer
@assert @isdefined productA
@assert typeof(productA) == VariableRef
@assert has_upper_bound(productA) == false
@assert has_lower_bound(productA) == true
@assert lower_bound(productA) == 0
@assert @isdefined productA
@assert typeof(productB) == VariableRef
@assert has_upper_bound(productB) == false
@assert has_lower_bound(productB) == true
@assert lower_bound(productB) == 0
println("Variables added to the model successfully!")
```

</details>

------------------------------------------------------------------------

# Section 3 - Adding Constraints

Constraints are conditions that limit the possible values of the variables in our optimization problem. In JuMP, we use the `@constraint` macro to define these constraints.

The general syntax for adding a constraint is:

``` julia
@constraint(model_name, constraint_name, constraint_expression)
```

Where:

-   `model_name` is the name of your JuMP model
-   `constraint_name` is a label you give to the constraint (optional, but useful for reference)
-   `constraint_expression` is the mathematical expression of the constraint

For example:

``` julia
constraint(model_name, constraint_name, 4 * variable_name <= 100)
```

This defines a constraint that ensures, that the variable `variable_name` can maximally be 25. Note, that you will have to change `model_name`, `constraint_name` and `variable_name` according to your instance.

## Exercise 3.1 - Create Constraints

Create two constraints based on the on the Cutting and Finishing department hours of the problem description in this tutorial. Call the first constraint `cutting_constraint` and the second constraint `finishing_constraint`.

``` julia
# YOUR CODE BELOW
```

<details class="code-fold">
<summary>Code</summary>

``` julia
# Test your answer
@assert is_valid(model, cutting_constraint)
@assert is_valid(model, finishing_constraint)
println("Constraints added to the model successfully!")
println("Note, that only the existence of these constraints was checked!")
println("The optimization later will show, whether the formulation was correct.")
```

</details>

------------------------------------------------------------------------

# Section 4 - Defining the Objective Function

The objective function represents the goal of our optimization problem - what we want to maximize or minimize. In JuMP, we use the `@objective` macro to define this function.

The general syntax for defining an objective function is:

``` julia
@objective(model_name, optimization_direction, objective_expression)
```

Where:

-   `model_name` is the name of your JuMP model
-   `optimization_direction` is either `Max` for maximization or `Min` for minimization
-   `objective_expression` is the mathematical expression of the objective function

For example:

``` julia
@objective(model_name, Max, 2*variableA + 3*variableB)
```

This defines an objective function that maximizes something based on the values of `variableA` and `variableB`.

## Exercise 4.1 - Create the Objective Function

Create the objective function based on the problem description of this tutorial. The objective is to maximize profit based on the values of `productA` and `productB`.

``` julia
# YOUR CODE BELOW
```

<details class="code-fold">
<summary>Code</summary>

``` julia
# Test your answer
@assert typeof(objective_function(model)) == AffExpr
println("An objective function defined successfully!")
println("The optimization later will show, whether the formulation was correct.")
```

</details>

------------------------------------------------------------------------

# Section 5 - Solving the Model

Now that we have defined our variables, constraints, and objective function, we're ready to solve the optimization model. Here's how to do it step by step:

1.  Solve the model:

``` julia
optimize!(model)
```

1.  Check the status of the solution:

``` julia
termination_status(model)
```

1.  If the solution is optimal, we can retrieve the optimal values of our variables and the objective function. If the time limit is reached, we can check whether a primal solution is available. We do so by checking whether the model has values.

``` julia
begin
    if termination_status(model) == OPTIMAL
        println("Solution is optimal")
    elseif termination_status(model) == TIME_LIMIT && has_values(model)
        println("Solution is suboptimal due to a time limit,
            but a primal solution is available")
    else
        error("The model was not solved correctly.")
    end
    println("Objective value = ", objective_value(model))
end
```

We can then get the values of the variables as follows:

``` julia
println("Product A quantity: $(value(productA))")
println("Product B quantity: $(value(productB))")
```

Let's break this down:

-   `optimize!(model)` tells JuMP to solve our model
-   `termination_status(model)` checks if we found an optimal solution
-   `objective_value(model)` gives us the maximum profit we can achieve
-   `value(productA)` and `value(productB)` tell us how many of each product we should produce

> **Note**
>
> The values might be slightly off due to the nature of floating-point numbers in computers.

The following code block tests whether the solution is correct or whether you have made a mistake in the formulation of the problem.

``` julia
# Test your answer
@assert termination_status(model) == MOI.OPTIMAL "Sorry, something didn't work out as the model status is $termination_status(model)".
println("Solution: Product A = ", val_productA, ", Product B = ", val_productB)
@assert value(productA) ≈ 12 atol=1e-4 "Although you have a solution, val_productA should be 12 not $val_productA"
@assert value(productB) ≈ 4 atol=1e-4 "Although you have a solution, val_productB should be 4 not $val_productB"
println("You have solved the model correctly!")
```

------------------------------------------------------------------------

# Conclusion

Excellent! You've completed the tutorial on mathematical optimization with JuMP and HiGHS. You've learned how to define optimization models, add variables and constraints, define an objective function, and solve the model. Continue to the next file to learn more.

# Solutions

You will likely find solutions to most exercises online. However, I strongly encourage you to work on these exercises independently without searching explicitly for the exact answers to the exercises. Understanding someone else's solution is very different from developing your own. Use the lecture notes and try to solve the exercises on your own. This approach will significantly enhance your learning and problem-solving skills.

Remember, the goal is not just to complete the exercises, but to understand the concepts and improve your programming abilities. If you encounter difficulties, review the lecture materials, experiment with different approaches, and don't hesitate to ask for clarification during class discussions.
