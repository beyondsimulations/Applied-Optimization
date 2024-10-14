# Introduction to Vectors, Matrices, and Tuples in Julia
# =====================================================
println()
println("Introduction to Vectors, Matrices, and Tuples in Julia")
println()

#= This interactive Julia script introduces the basics of vectors, matrices, and 
tuples. Vectors and matrices are fundamental in numerical computing and data 
analysis, while tuples are essential for grouping different types of data. 
Understanding these data structures and how to manipulate them is crucial in Julia.
Follow the instructions, write your code in the designated code blocks, and 
execute the corresponding code cell. =#

## Section 1: Vectors
# ---------------------------
println("Section 1: Vectors")

#= Vectors in Julia are one-dimensional arrays used to store sequences of elements.
They're powerful for numerical operations and data handling.
Vectors are mutable, and you can add elements with push!() or pushfirst!() 
(the '!' denotes function modification of the input). Remove elements with pop!() 
or popfirst!(). Use '?' in the REPL for function details. Access elements with 
square brackets, e.g., fib[1:4]. Remember, Julia is 1-based indexed. =#

## Exercise 1.1: 
# Create a vector 'fib' with the first five Fibonacci numbers: 1, 1, 2, 3, 5

# YOUR CODE BELOW
fib = [1, 1, 2, 3, 5]

# YOUR CODE ABOVE
# Test your answer
@assert fib == [1, 1, 2, 3, 5]
println("The 'fib' vector: ", fib)

## Exercise 1.2: 
# Append the number 8 to the 'fib' vector.

# YOUR CODE BELOW
 push!(fib,8)

# YOUR CODE ABOVE
# Test your answer
@assert fib == [1, 1, 2, 3, 5, 8]
println("The 'fib' vector after appending 8: ", fib)

## Exercise 1.3: 
# Remove the first element of the 'fib' vector. 

# YOUR CODE BELOW
 popfirst!(fib)

# YOUR CODE ABOVE
# Test your answer
@assert fib == [1, 2, 3, 5, 8]
println("The 'fib' vector after removing the first element: ", fib)

## Exercise 1.4: 
# Access and save the first three elements of 'fib', to 'first_three_elements'.

# YOUR CODE BELOW
first_three_elements = fib[1:3]
 
# YOUR CODE ABOVE
# Test your answer
@assert first_three_elements == fib[1:3]
println("The first three elements of the 'fib' vector: ", first_three_elements)

## Section 2: Matrices
# ---------------------------
println("Section 2: Matrices")

#= A matrix in Julia is a 2D array, great for linear algebra and data representation.
Create matrices with square brackets, separate elements with spaces, rows with 
semicolons. Access elements with square brackets (e.g., matrix[2,2]). Add matrices 
of the same dimensions element-wise. Use the '.' syntax for element-wise operations 
(e.g., matrix = 1 .+ matrix). =#

## Exercise 2.1: 
# Create a 2x3 matrix 'my_matrix' with the values: 1 2 3; 4 5 6

# YOUR CODE BELOW
my_matrix = [1 2 3; 4 5 6]

# YOUR CODE ABOVE
# Test your answer
@assert my_matrix == [1 2 3; 4 5 6]
println("The 'my_matrix':\n", my_matrix)

## Exercise 2.2: 
# Change the 3rd column of the 2nd row to 17 by accessing and changing the element.

# YOUR CODE BELOW
my_matrix[2,3] = 17

# YOUR CODE ABOVE
# Test your answer
@assert my_matrix == [1 2 3; 4 5 17]
println("The 'my_matrix' after modification:\n", my_matrix)

## Exercise 2.3: 
#= Perform matrix addition with 'my_matrix' and 'another_matrix'. Call the 
resulting matrix 'added_matrices'. =#
another_matrix = [10 20 30; 40 50 60]

# YOUR CODE BELOW
added_matrices = my_matrix + another_matrix

# YOUR CODE ABOVE
# Test your answer
@assert added_matrices == [11 22 33; 44 55 77]
println("Result of adding 'my_matrix' and 'another_matrix':\n", added_matrices)

## Exercise 2.4: 
# Add '10' to each element in 'added_matrices'.

# YOUR CODE BELOW
added_matrices .+= 10

# YOUR CODE ABOVE
# Test your answer
@assert added_matrices == [21 32 43; 54 65 87]
println("Result of adding 10 to each element in 'added_matrices':\n", added_matrices)

## Section 3: Tuples
# ---------------------------
println("Section 3: Tuples")

#= Tuples are immutable collections used to group different types of elements. They 
are useful for functions that need to return multiple values. Create a tuple using 
parentheses and separating elements with commas. Access tuple elements with square 
brackets, e.g., tuple[1]. =#

## Exercise 3.1: 
#= Create a tuple 'my_tuple' with three elements: 4.0, your matrix 'added_matrices',
and "Hi there!". =#

# YOUR CODE BELOW
my_tuple = (4.0, added_matrices, "Hi there!")

# YOUR CODE ABOVE
# Test your answer
@assert my_tuple == (4.0, added_matrices, "Hi there!")
println("The 'my_tuple': ", my_tuple)

## Exercise 3.2: 
# Access the second element of 'my_tuple', store it in 'second_element'.

# YOUR CODE BELOW
second_element = my_tuple[2]

# YOUR CODE ABOVE
# Test your answer
@assert second_element == [21 32 43; 54 65 87]
println("The second element of 'my_tuple':\n", second_element)

## Conclusion
# ---------------------------
println()
println("Well done! You've completed the tutorial on Vectors, Matrices, and Tuples.")
println("You've learned to create, manipulate, and interact with these fundamental") 
println("data structures. Experiment with the code, try different operations, and")
println("see how Julia behaves. Continue to the next file to learn more.")