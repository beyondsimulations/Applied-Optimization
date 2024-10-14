# Exploration of Variable Scopes in Julia
# ============================================
println()
println("Exploration of Variable Scopes in Julia")
println()

#= This interactive Julia script is a look on variable scopes in Julia. Understand 
the intricacies of local and global scopes, comprehend the significance of 'local'
and 'global' keywords, and discern the scope behaviors in different contexts. Follow
the structured instructions, implement your code in the designated blocks, and 
affirm your comprehension with @assert statements. =#

## Section 1: The Local and Global Scope
# -------------------------------------
println("Section 1: The Local and Global Scope")

#= In Julia, variables within a function or a loop are encapsulated in a local 
scope, meaning their visibility and lifespan are confined to that block of code. 
Variables declared in the main body of a script are in the global scope, making them 
accessible and modifiable across your entire program. We have seen this in the 
previous tutorial on Loops, where we have created scope blocks with let ... end to 
prevent us from creating global variables. =#

## Exercise 1.1: 
# Experiment with Local Variables in a Loop

# Try to execude the following block of code:
println("Defining a local variable within a loop:")
for i in 1:3
    loop_variable = i
    println("Inside the loop, loop_variable is: ", loop_variable)
end
println("Outside the loop, loop_variable is: ", loop_variable)

#= Note: Attempting to access loop_variable here should result in an error because 
its scope is local to the loop. Can you come up with a way to solve this issue? 
Extend the code above to allow the execution of the code. =#

# Test your answer
@assert loop_variable == 3
println("Now, the loop works and the value of the 'loop_variable' is: ", loop_variable)

## Exercise 1.2: 
# Experiment with Local Variables in a Nested Loop

# Try to execude the following block of code:
println("Defining a local variable within a loop:")
for i in 1:3
    nestedloop_variable = 0
    for j in 1:3
        nestedloop_variable = i * 3
        println("Inside the nested loop, loop_variable is: ", nestedloop_variable)
    end
end
println("Outside the nested loop, loop_variable is: ", nestedloop_variable)

#= Note: Attempting to access nestedloop_variable here should result in an error 
because its scope is only accessible in the first loop, where it is defined, and the 
second loop below. Can you come up with a way to solve this issue? Extend the code 
above to allow the execution of the code. =#

# Test your answer
@assert nestedloop_variable == 9
println("Now, the loop works and the value of the 'nestedloop_variable' is: ", loop_variable)

## Section 2: Working with `global` and `local` Keywords
# ---------------------------------------------------
println("Section 3: Working with `global` and `local` Keywords")

#= Use 'global' to designate a global variable inside a local scope. Conversely, 'local' 
explicitly defines a local variable, particularly in contexts where global inference 
might occur. =#

## Exercise 2.1: 
#= Experiment with Local Variables in a Potentially Global Context Using `local`
The objective is to redefine the value of 'explicit_local_variable' to "end" within 
the following loop. =#

# Try to execude the following block of code.
explicit_local_variable = "start"
println("At the start of the loop, explicit_local_variable is: ", explicit_local_variable)
for i in 1:3
    local explicit_local_variable = "end"
    println("Inside the loop, explicit_local_variable is: ", explicit_local_variable)
end
println("Outside the loop, explicit_local_variable is: ", explicit_local_variable)

#= Note: Without any changes, explicit_local_variable is local to the loop, hence not 
changed outside. Can you come up with a way to change it inside the loop? Do so by 
changing the code above in the loop. =#

# Test your answer
@assert explicit_local_variable == "end" "Currently, the value of 
    'explicit_local_variable' is $explicit_local_variable."

## Conclusion
# -----------
println()
println("Great You've just navigated through the variable scopes in Julia.")
println("Use this knowledge to create precise, robust, and efficient programs.")
println("Continue to the next file to learn more.")