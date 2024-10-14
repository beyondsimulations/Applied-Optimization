import Pkg
Pkg.activate("applied_optimization")

using JuMP, HiGHS
using DelimitedFiles

task = "2a"

# Define fixed parameters
revenue = 11000
varCosts = 6300

# Load the data
file_directory = @__DIR__
available = readdlm("$file_directory/available-panels.csv",',',header = true)[1][:,2]
requested = readdlm("$file_directory/panel-demand.csv",',',header = true)[1][:,2]
loadCosts = readdlm("$file_directory/cost.csv",',',header = true)[1]

# Define the size of the problem instance
nrSuppliers = length(available)
nrCustomers = length(requested)

# Prepare the travel travel costs
travelCosts = zeros(Int,nrSuppliers,nrCustomers)
for j in 1:nrCustomers
    for i in 1:nrSuppliers
        current_cell = (j-1) * nrSuppliers + i
        travelCosts[i,j] = loadCosts[current_cell,3]
    end
end

# Create model instance
transport_model = Model(HiGHS.Optimizer)

# Define variable
@variable(transport_model, X[i = 1:nrSuppliers,j = 1:nrCustomers] >= 0)

if task == "2a"
    # Define objective
    @objective(transport_model, Min, 
        sum(travelCosts[i,j]* X[i,j] for i in 1:nrSuppliers, j in 1:nrCustomers)
        )
else
    # Define objective
    @objective(transport_model, Max, 
        sum((revenue-varCosts-travelCosts[i,j])* X[i,j] for i in 1:nrSuppliers, j in 1:nrCustomers)
        )
end

# Define the constraints
@constraint(transport_model, 
    restrictAvailable[i=1:nrSuppliers], 
    sum(X[i,j] for j in 1:nrCustomers) <= available[i]
    )

if task == "2a"
    @constraint(transport_model,
        restrictDemand[j=1:nrCustomers], 
        sum(X[i,j] for i in 1:nrSuppliers) >= requested[j]
        )
else
    @constraint(transport_model,
        restrictDemand[j=1:nrCustomers], 
        sum(X[i,j] for i in 1:nrSuppliers) <= requested[j]
        )
end

if task == "2c"
    @constraint(transport_model, 
        equalDeliveries[i=1:nrSuppliers,v=1:nrSuppliers; i < v],
        sum(X[i,j] for j in 1:nrCustomers) - sum(X[v,j] for j in 1:nrCustomers) == 0
        )
end

# Start optimization
optimize!(transport_model)

# Save the result in parameter
transport = value.(X)

# Assert solution
allsame(x) = all(y -> y == first(x), x)
@assert all(vec(sum(transport,dims=1)) .<= requested)
@assert all(vec(sum(transport,dims=2)) .<= available)
if task == "2c"
    @assert allsame(vec(sum(transport,dims=2)))
end