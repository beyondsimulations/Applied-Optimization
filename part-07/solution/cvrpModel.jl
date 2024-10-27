using Pkg
Pkg.activate("applied_optimization")

using DelimitedFiles
using JuMP
using HiGHS
using Plots

## Prepare the model data
file_directory = @__DIR__
cost = readdlm("$(file_directory)/distance_matrix.csv", ',', Float64, '\n')
demand = vec(readdlm("$(file_directory)/demand.csv", ',', Float64, '\n'))
coord = readdlm("$(file_directory)/coord_x_y.csv", ',', Float64, '\n')

## Define the set with the nodes
nodes = 1:length(demand) # all nodes including the depot at 1

## Create the model instance
cvrpModel = Model(HiGHS.Optimizer)
set_attribute(cvrpModel, "presolve", "on")
set_attribute(cvrpModel, "time_limit", 300.0)
set_attribute(cvrpModel, "mip_rel_gap", 0.0)

## Define additional input data for the capacity and the vehicles
capacity = 50   # vehicle capacity with equal capacity for all vehicles
vehicles = 2    # number of vehicles

## Manipulate the distance matrix to represent costs
cost = 4 .* 5 .* 0.6 .* cost
cost[1,:] .+= 450

## Prepare all sets and variables for the model. 
# Note, please name the decision variable X for the plotting to work.                
@variable(cvrpModel, X[nodes,nodes], Bin)       # 1, if arc from node to node exists
@variable(cvrpModel, demand[i] <= U[i=nodes] <= capacity)   # current capacity usage at node

# Prevent circles by fixing the value of an assignement to the same node to 0.
for i in nodes
    fix.(X[i,i],0)
end

# Define the objective function to minimize the driving time
@objective(cvrpModel, Min, 
    sum(cost[i,j] * X[i,j] for i in nodes, j in nodes)
    )

# Define all additional constraints required
@constraint(cvrpModel, 
    indegree[j in nodes; j > 1], 
    sum(X[i,j] for i in nodes) == 1
    )

# Ensure that the vehicle exits a node
@constraint(cvrpModel, 
    outdegree[i in nodes; i > 1], 
    sum(X[i,j] for j in nodes) == 1
    )

# Every vehicle arrives again at the depot
@constraint(cvrpModel, 
    vehicles_in, 
    sum(X[i,1] for i in nodes) == vehicles
    )

# Every vehicle leaves the depot (can be left out!)
@constraint(cvrpModel, 
    vehicles_out, 
    sum(X[1,j] for j in nodes) == vehicles
    )

# Eliminate subtours & keep capacity
@constraint(cvrpModel, 
    no_subtour[i in nodes, j in nodes; j > 1 && i > 1 && i != j && demand[i] + demand[j] <= capacity], 
    U[i] - U[j] + capacity * X[i,j] <= capacity -demand[j]
    )

## Solve the model and export the results into a binary matrix
optimize!(cvrpModel)

begin
    println()
    if termination_status(cvrpModel) == OPTIMAL
        println("Great, the solution is optimal.")
        println("The relative gap is $(relative_gap(cvrpModel))")
        println("The solve time (in seconds) is $(solve_time(cvrpModel))")
    elseif termination_status(cvrpModel) == TIME_LIMIT && has_values(cvrpModel)
        println("Solution is suboptimal due to a time limit, but a primal solution is available") 
    else
        error("The model was not solved correctly.") 
    end
    println("The objective value is ", objective_value(cvrpModel)) 
end

## The following part extracts the results to plot the tours and requires no changes
@assert size(X) == (15,15) "Have you defined the decision variable X?"
Routes = zeros(Bool,length(nodes),length(nodes))
for i in axes(X,1), j in axes(X,2)
    if value(X[i,j]) >= 0.5
        Routes[i,j] = true
    end
end

## Visualize the results
fig = plot()
connections = findall(Routes -> !iszero(Routes), Routes)
for conn in connections
    xx = [coord[conn[1],1]; coord[conn[2],1]]
    yy = [coord[conn[1],2]; coord[conn[2],2]]
    plot!(fig, xx, yy, color=:red, label="")
end
scatter!(fig, coord[1:1,1], coord[1:1,2], marker=:octagon, label="Central Library", color=:black, markersize=12)
scatter!(fig, coord[2:end,1], coord[2:end,2], marker=:circle, label="Libraries", color=:gray )
display(fig)

