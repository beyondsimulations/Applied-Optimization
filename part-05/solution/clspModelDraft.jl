import Pkg
Pkg.activate("applied_optimization")

using JuMP, HiGHS
using DelimitedFiles
using DataFrames
using Plots
using StatsPlots
plotly()

# Load the data
file_directory = @__DIR__
availableTime = readdlm("$file_directory/availabletime.csv",',',header = true)[1]
bottlingTime = readdlm("$file_directory/bottlingtime.csv",',',header = true)[1]
demandCustomers = readdlm("$file_directory/demand.csv",',',header = true)[1]
setupTime = readdlm("$file_directory/setuptime.csv",',',header = true)[1]

# Prepare the model instance
lotsizeModel = Model(HiGHS.Optimizer)
set_attribute(lotsizeModel, "presolve", "on")
set_time_limit_sec(lotsizeModel, 60.0)

# Define all necessary parameters not loaded yet

# Prepare your data below as required for the modelling instance

# Create your variables below. Please name them productBottled for the binary variable, productQuantity for the
# production quantity and WarehouseStockPeriodEnd for the wrehouse stock at the end of each period.

# Define the objective function below

# Define all necessary constraints for the model

# Implement the solve statement for your model instance
optimize!(lotsizeModel)

# If you name your variables as stated above, the following should create
# the production and warehouse plots for you.
productionResults = DataFrame(
    period = String[],
    product = String[],
    productBottled = Bool[],
    productQuantity=Int[],
    WarehouseStockPeriodEnd=Int[]
    )
for i in axes(setupTime,1)
    for t in axes(availableTime,1)
        push!(productionResults,(
            period = t,
            product = i,
            productBottled = value(Yit[i,t])>0.5 ? true : false,
            productQuantity = ceil(Int,value(Xit[i,t])),
            WarehouseStockPeriodEnd = ceil(Int,value(Wit[i,t])),
        ))
    end
end

sort!(productionResults,[:period, :product])

p = groupedbar(productionResults.period, productionResults.productQuantity, group=productionResults.product, 
               ylabel="Production Quantity", xlabel="Period", size=(1200,600),
               palette = :Pastel1_6, legend=:outertopright)

p = groupedbar(productionResults.period, productionResults.WarehouseStockPeriodEnd, group=productionResults.product, 
               ylabel="Warehouse", xlabel="Period", size=(1200,600),
               palette = :Pastel1_6, legend=:outertopright)
    
    