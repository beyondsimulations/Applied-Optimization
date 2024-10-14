# Advanced Variables and Bounds in JuMP
# ==================================================
println()
println("Advanced Variables and Bounds in JuMP")
println()

#= This Julia script is an interactive tutorial to introduce you to advanced 
variable handling in JuMP. You'll learn about creating variables in containers, 
managing different types of variables, and working with indexed variables. Follow 
the instructions, write your code in the designated code blocks, and confirm your 
understanding with @assert statements. Make sure to have the JuMP package installed 
to follow this tutorial. =#

using JuMP

#= Now, we need a model. As we don't solve anything in this tutorial, we don't 
need to add the solver and can solely define the abstract model. =#
new_model = Model()

## Section 1: Managing Different Types of Variables
# ---------------------------
println("Section 1: Managing Different Types of Variables")

#= JuMP allows creating continuous, integer, and binary variables. For example:

@variable(model, variableName)    
This defines a continuous variable without any bound.

@variable(model, 0 <= variableName <= 1) 
This defines a continuous variable in an interval.

@variable(model, 0 <= variableName, Bin) 
This defines a binary variable.

@variable(model, 0 <= variableName, Int) 
This defines an integer variable. Note that you will have to change 'modelName' 
and 'variableName' according to your instance. =#

## Exercise 1.1: 
#= Create continuous, integer, and binary variables. Create three different 
variables of different types without any additional bound: 'continuous_var' as a 
continuous variable for 'new_model', 'integer_var' as an integer variable for 
'new_model', and 'binary_var' as a binary variable for 'new_model'. =#

# YOUR CODE BELOW
@variable(new_model, continuous_var)
@variable(new_model, integer_var, Int)
@variable(new_model, binary_var, Bin)

# YOUR CODE ABOVE
# Test your answer
@assert typeof(continuous_var) == VariableRef && typeof(integer_var) == VariableRef
@assert typeof(binary_var) == VariableRef
println("Continuous, integer, and binary variables created successfully!")

## Section 2: Creating Variables in Containers
# ---------------------------
println("Section 2: Creating Variables in Containers")

#= If we need to define larger models, creating each variable manually can become 
impossible. JuMP supports creating variables in containers like arrays, sets, 
dictionaries, and matrices. For example:

@variable(modelName, variableName[1:20], Bin)
This would create a container with 20 variables. To create a set based on a range, 
we could do:

new_range = 1:100
@variable(modelName, variableName[i in new_range] >= 0)
This would create a container with 100 continuous variables larger than 0. For a 
container with multiple dimensions:

@variable(modelName, variableName[1:30, 1:30])
This would create a container with a matrix of continuous variables without any 
bound. Note that you will have to change 'modelName' and 'variableName' according to 
your instance. =#

## Exercise 2.1:
#= Create an array 'X' for 'new_model' containing 8 variables with non-negative 
lower bounds. =#

# YOUR CODE BELOW
@variable(new_model, X[1:8] >= 0)

# YOUR CODE ABOVE
# Test your answer
@assert length(X) == 8 && all(lower_bound(X[i]) == 0 for i in 1:8)
println("Array of variables created successfully!")

## Exercise 2.2:
#= Create a matrix 'Y' for 'new_model' containing binary variables with a size 
of 3 x 3. =#

# YOUR CODE BELOW
@variable(new_model, Y[1:3, 1:3], Bin)

# YOUR CODE ABOVE
# Test your answer
@assert size(Y, 1) == 3 && size(Y, 2) == 3
@assert all(has_lower_bound(Y[i, j]) == false for i in 1:3, j in 1:3)
@assert all(has_upper_bound(Y[i, j]) == false for i in 1:3, j in 1:3)
println("Matrix of variables created successfully!")

## Exercise 2.3: 
#= Create indexed variables based on a set. Create variables 'W' indexed by set 
N of size 1, 2, ..., 6 with non-negative lower bounds. =#

# YOUR CODE BELOW
N = 1:6
@variable(new_model, W[i in N] >= 0)

# YOUR CODE ABOVE
# Test your answer
@assert length(W) == 6 && all(lower_bound(W[i]) == 0 for i in N)
println("Indexed variables created successfully!")

## Conclusion
# ---------------------------
println()
println("Fantastic! You've completed the tutorial on advanced variables in JuMP.")
println("You've learned how to create variables in containers, manage different")
println("types of variables, and work with indexed variables.")
println("Continue to the next file to learn more.")