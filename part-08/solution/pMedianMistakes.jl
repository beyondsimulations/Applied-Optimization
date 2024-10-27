import Pkg
Pkg.activate("applied_optimization")

using JuMP, HiGHS
using DelimitedFiles
using Shapefile
using Plots
using DataFrames

# Define the number of departments
p = 10

# Load the data into scope
file_directory = @__DIR__
euclidianDistances = vec(readdlm("$file_directory/euclidianDistances0510.csv",'\t'))
drivingTimes = readdlm("$file_directory/drivingTimes0510.csv",'\t')
incidentWeights = vec(readdlm("$file_directory/incidentWeights0510.csv",'\t'))

# Load the Shapefile for plotting
hexshape = DataFrame(Shapefile.Table("$file_directory/grid0510.shp"))
sort!(hexshape, :id)

# Prepare weighted driving driving times
weightedDriving = drivingTimes .* transpose(incidentWeights)

# YOUR CODE BELOW (MISTAKES START HERE)

# Prepare the model instance
Model = Model(HiGHS.Optimizer)
set_attribute(pMedianModel, "presolve", "on")
set_attribute(pMedianModel, "mip_rel_gap", 0.0)

# Define the range of the problem instance
rangeBAs = 1:2

# Define variable
@variable(pMedianModel, X[i = rangeBAs,j = rangeBAs] >= 0)

# Define objective function
@objective(pMedianModel, Min, 
    sum(weightedDriving[i,j]* X[i,j] for i in rangeBAs, j in rangeBAs)
    )

# Define the constraints
@objective(pMedianModel, 
    eachAllocated[j=rangeBAs], 
    sum(X[i,j] for i in rangeBAs) == 1
    )

@constraint(pMedianModel,
    pLocations, 
    sum(X[i,i] for i in rangeBAs) == 0
    )

@constraint(pMedianModel, 
    departmentNecessary[i=rangeBAs,j=rangeBAs],
    X[i,j] <= X[i,i]
    )

# Start optimization
optimize!(pMedianModel)

# YOUR CODE ABOVE (MISTAKES END HERE)
# Check solution
begin
    println()
    if termination_status(pMedianModel) == OPTIMAL
        println("Great, the solution is optimal.")
        println("The relative gap is $(relative_gap(pMedianModel))")
        println("The solve time (in seconds) is $(solve_time(pMedianModel))")
    elseif termination_status(pMedianModel) == TIME_LIMIT && has_values(pMedianModel)
        println("Solution is suboptimal due to a time limit, but a primal solution is available") 
    else
        error("The model was not solved correctly.") 
    end
    println("The objective value is ", objective_value(pMedianModel)) 
end

# Save the result in parameter
allAssignments = Matrix(value.(X))

# Find index of elements larger than 0
assignments = findall(allAssignments .> 0.5)

# Allocate the department to all shapes
hexshape.department = map(x->x[1], assignments)

# Set the color of all shapes to black
hexshape.color .= RGB(0/255, 0/255, 0/255)

# Isolate all department locations
departmentLocations =  unique(map(x->x[1], assignments))

# Define a different color for each department
colorDict = Dict(departmentLocations[x] => cgrad(:Pastel1_9, p, categorical = true)[x] for x in 1:p)

# Save the color of the departments
for hex in eachrow(hexshape)
    if hex.id != hex.department
        hex.color =  colorDict[hex.department]
    end
end

# Plot the shapes
plot_area = plot(hexshape.geometry, color=hexshape.color', legend=[],axis=false, ticks=false, size=(800,450))