import Pkg
Pkg.activate("applied_optimization")

using JuMP, Juniper, Ipopt, HiGHS
using DelimitedFiles
using LinearAlgebra

# Define transactional data
transactionalData = [
    1 1 1 0; 
    1 1 1 0; 
    1 1 0 0; 
    1 0 0 1; 
    1 0 0 1; 
    1 0 0 1; 
    1 0 0 1; 
    0 0 1 1
    ]

# Define warehouse capacities
cTaskA = [3,2]
cTaskB = [12,12]

# Create coappearance matrix
coappearance = transactionalData'*transactionalData

# Create capacity utilization
capUtilization = diag(coappearance)

# Definition of the warehouse model
ipopt = optimizer_with_attributes(Ipopt.Optimizer, "print_level" => 0)
highs = optimizer_with_attributes(HiGHS.Optimizer, "output_flag" => false)
warehouseModel = Model(
    optimizer_with_attributes(
        Juniper.Optimizer,
        "nl_solver" => ipopt,
        "mip_solver" => highs,
    ),
)

# Define problem size
nrSKUs = 1:size(coappearance,1)
nrWarehouses = 1:length(cTaskA)

# Define the decision variable
@variable(warehouseModel, X[i=nrSKUs,k=nrWarehouses],Bin)

# Define the objective function to maximize the coappearance
@NLobjective(warehouseModel, Max, sum(X[i,k] * X[j,k] * coappearance[i,j] for i in 2:nrSKUs[end], j in 1:i-1, k in nrWarehouses))

# Assign each SKU exactly once
@constraint(warehouseModel, oneWarehouse[i=nrSKUs], sum(X[i,k] for k in nrWarehouses) == 1)

# Ensure the capacity of each warehouse
@constraint(warehouseModel, capRestriction[k=nrWarehouses], sum(X[i,k] for i in nrSKUs) <= cTaskA[k])

# Ensure the capacity of each warehouse for task b
#@constraint(warehouseModel, capRestriction[k=nrWarehouses], sum(capUtilization[i] * X[i,k] for i in nrSKUs) <= cTaskB[k])

# Solve the model
optimize!(warehouseModel)

# Print the results
println(value.(X))