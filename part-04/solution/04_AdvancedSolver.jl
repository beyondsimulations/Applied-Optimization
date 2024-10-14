# Advanced Solver Options with HiGHS in JuMP
# ==================================================
println()
println("Advanced Solver Options with HiGHS in JuMP")
println()

#= This Julia script is an interactive tutorial to introduce you to advanced solver 
options in HiGHS using JuMP. You'll learn about setting solver parameters to control 
the optimization process and improve performance. Follow the instructions and 
confirm your understanding with the examples. Make sure to have the JuMP package and 
the HiGHS solver installed to follow this tutorial. =#

using JuMP, HiGHS

## Section 1: Setting HiGHS Solver Options
# ---------------------------
println("Section 1: Setting HiGHS Solver Options")

#= HiGHS offers various advanced options that can be set to control the solving 
process. To change some advanced settings, we first need to create a model with 
HiGHS. =#

model = Model(HiGHS.Optimizer)

#= Different options for the HiGHS solver can be found here: https://ergo-code.github.io/HiGHS/dev/options/definitions/

Note, that some options are solver specific and some options apply to all solvers, 
as JuMP itself can work with many different solvers just by changing the model 
definition and the solver-specific options. =#

# Set options for the solver
set_optimizer_attribute(model, "presolve", "on")
# Transforms a model in an "similiar" model that might be easier or smaller in size.
set_optimizer_attribute(model, "time_limit", 60.0)
# Sets the time limit for the solver.
set_optimizer_attribute(model, "mip_rel_gap", 0.0)
# Specifies the relative gap at which the solver might abort the search.

println("HiGHS solver options set successfully!")

## Conclusion
# ---------------------------
println("Well done! You've completed the tutorial on advanced solver options with")
println("HiGHS in JuMP. You've learned how to set advanced solver options.")
println("Continue to the next file to learn more.")
