# Guide to Packages and Package Management in Julia
# =======================================================
println()
println("Guide to Packages and Package Management in Julia")
println()

#= This interactive script serves as an in-depth guide to understanding packages and 
package management in Julia. Delve into the utilization of the package manager, the 
processes of adding, updating, and removing packages, and management of distinct 
environments. Note: While this script offers guidance, package management commands 
should be executed in Julia's REPL. =#

## Section 1: Using the Package Manager
# ------------------------------------
println("Section 1: Using the Package Manager")

#= Julia's built-in package manager, Pkg, provides a robust set of tools for 
managing packages. To utilize these tools, start by importing the Pkg module. This 
module allows you to add, update, and remove packages, and manage environments 
efficiently. Note, 'import PackageName' lets you access exported functions with 
'PackageName.function', while 'using PackageName' imports all exported names into 
the local namespace for direct access. =#

## Exercise 1.1:
# Import the Pkg module to start managing packages effectively.

# YOUR CODE BELOW
import Pkg

# YOUR CODE ABOVE
# Test your answer
try 
    Pkg.update()
catch e
    @error "The Pkg module was not imported yet! Have you used the correct syntax?"
end
println("Pkg module imported successfully and packages were updated!")

## Section 2: Adding Packages
# --------------------------
println("Section 2: Adding Packages")

#= Adding packages in Julia is straightforward using the Pkg.add("PackageName") 
function. Replace 'PackageName' with the actual package name you wish to add. =#

## Exercise 2.1: 
# Use Pkg.add() to add the Package 'DataFrames' that we will use later.

# YOUR CODE BELOW
Pkg.add("DataFrames")

# YOUR CODE ABOVE
# Test your answer
try 
    using DataFrames
catch e
    @error "Package was not added yet! Have you used the correct syntax?"
end
println("Package added successfully!")

## Section 3: Updating and Removing Packages
# -----------------------------------------
println("Section 3: Updating and Removing Packages")

#= Maintaining your Julia environment involves keeping your packages up-to-date and 
removing those that are no longer necessary. Use Pkg.update("PackageName") to update 
individual packages, or simply Pkg.update() to update all packages. To remove an 
obsolete package, use Pkg.rm("PackageName"). Remember to replace 'PackageName' with 
the actual name of the package you wish to manage. =#

println("Package management tips successfully noted!")

## Section 4: Managing Environments
# -------------------------------
println("Section 4: Managing Environments")

#= Julia environments are essential for keeping project dependencies isolated and 
organized. It's a best practice to create a new environment for each project to 
avoid conflicts between package versions. Activate a new environment with Pkg.
activate("new_environment") and add packages to it with Pkg.add("PackageName"). This 
ensures that each of your projects has a clean, dedicated set of dependencies. =#

println("Environment management explained.")

## Conclusion
# -----------
println()
println("Congratulations! You've completed the tutorial on packages and package")
println("management in Julia. These skills are important for effectively managing")
println("and utilizing external libraries. Continue to the next file to learn more.")