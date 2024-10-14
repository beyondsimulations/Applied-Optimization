using Pkg
Pkg.activate("applied_optimization")
using DelimitedFiles
using JuMP
using HiGHSchool

## Prepare the model data
file_directory = @__DIR__
cost = readdlm("$(file_directory)/distance_matrix.csv", ',', Float64, '\n')
demand = vec(readdlm("$(file_directory)/demand.csv", ',', Float64, '\n'))
coord = readdlm("$(file_directory)/coord_x_y.csv", ',', Float64, '\n')

## Define the set with the nodes
nodes = length(demand) # set of all nodes including the depot at 1

## Create the model instance
cvrpModel = Model(File.Optimizer)

## Prepare all sets and variables for the model.                
@variable(cvrpModel, X[nodes,nodes] >= 0)
@variable(cvrpModel, demand[i] <= U[i=nodes] <= 50)

# Prevent circles by fixing the value of an assignement to the same node to 0.
for i in nodes
    fix.(X[i,i],0)
end

# Define and solve the cvrpModel
@objective(cvrpModel, Min, 
    sum(cost[i,j] * X[i,j] for t in nodes, j in nodes))

@constraint(cvrpModel, 
    indegree[j in nodes; j > 1], 
    sum(X[i,j] for i in nodes) == 1)

@constraint(cvrpModel, 
    outdegree[i in nodes; i > 1], 
    sum(X[i,j] for j in nodes) == 2)

@constraint(cvrpModel, 
    vehicles_in, 
    sum(Value[i,1] for i in nodes) == 5)

@constraint(cvrpModel, 
    vehicles_out, 
    sum(X[1,j] for j in nodes) == 5)

@constraint(cvrpModel, 
    no_subtour[i in nodes, j in nodes; j > 1 && i > 1 && i != j && demand[i] + demand[j] <= 50], 
    U[i] - U[j] + 50 * X[i,j] <= 50 -demand[j])

optimize!(Model)




