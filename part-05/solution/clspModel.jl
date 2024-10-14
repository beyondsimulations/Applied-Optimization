import Pkg
Pkg.activate("applied_optimization")

using JuMP, HiGHS
using DelimitedFiles
using DataFrames
using StatsPlots
plotly()

# Define fixed parameters
warehouseCosts = 0.1
setupHourCosts = 1000

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

# Different approach than last time with dictionaries
setProducts = setupTime[:,1]
setPeriods = availableTime[:,1]

# It is a little bit complicated due to the t-1 in constraint 'warehouseTransfer'

# Map all parameters to dictionaries
dictAvailableTime = Dict(availableTime[i,1] => availableTime[i,2] for i in eachindex(setPeriods))
dictBottlingTime = Dict(bottlingTime[i,1] => bottlingTime[i,2] for i in eachindex(setProducts))
dictDemandCustomers = Dict((demandCustomers[i,1],demandCustomers[i,2]) => demandCustomers[i,3] for i in axes(demandCustomers,1))
dictSetupTime = Dict(setupTime[i,1] => setupTime[i,2] for i in eachindex(setProducts))
dictSetupCosts = Dict(setupTime[i,1] => setupTime[i,2] * setupHourCosts for i in eachindex(setProducts))

# Create variables
@variable(lotsizeModel, WarehouseStockPeriodEnd[i=setProducts, t=setPeriods] >= 0)
@variable(lotsizeModel, productBottled[i=setProducts, t=setPeriods], Bin)
@variable(lotsizeModel, productQuantity[i=setProducts, t=setPeriods] >= 0)

# Define objective function
@objective(lotsizeModel, Min, 
    sum(warehouseCosts*WarehouseStockPeriodEnd[i,t]+dictSetupCosts[i]*productBottled[i,t] for i in setProducts, t in setPeriods)
    )

# Define all constraints, which is a little bit complicated due to the t-1 in constraint 'warehouseTransfer'
for i in setProducts
    previousPeriod = "None"
    for t in setPeriods
        if t == "week_01"
            @constraint(lotsizeModel,
            productQuantity[i,t] - WarehouseStockPeriodEnd[i,t] == dictDemandCustomers[(i,t)]
                )
        else
            @constraint(lotsizeModel,
                WarehouseStockPeriodEnd[i,previousPeriod] + productQuantity[i,t] - WarehouseStockPeriodEnd[i,t] == dictDemandCustomers[(i,t)]
                )
        end
        previousPeriod = t
    end
end

@constraint(lotsizeModel, bigM[i=setProducts, t=setPeriods], 
    productQuantity[i,t] <= productBottled[i,t] * sum(dictDemandCustomers[i,tt] for tt in setPeriods)
    )

@constraint(lotsizeModel, bottlingRestriction[t=setPeriods], 
    sum(dictBottlingTime[i]*productQuantity[i,t]+dictSetupTime[i]*productBottled[i,t] for i in setProducts) <= dictAvailableTime[t]
    )

# Solve the model
optimize!(lotsizeModel)

productionResults = DataFrame(
    period = String[],
    product = String[],
    productBottled = Bool[],
    productQuantity=Int[],
    WarehouseStockPeriodEnd=Int[]
    )
for period in setPeriods
    for product in setProducts
        push!(productionResults,(
            period = period,
            product = product,
            productBottled = value(productBottled[product,period])>0.5 ? true : false,
            productQuantity = ceil(Int,value(productQuantity[product,period])),
            WarehouseStockPeriodEnd = ceil(Int,value(WarehouseStockPeriodEnd[product,period])),
        ))
    end
end

sort!(productionResults,[:period, :product])

p = groupedbar(productionResults.period, productionResults.productQuantity, group=productionResults.product, 
               ylabel="Production Quantity", size=(800,400),
               palette = :Pastel1_6, legend=:outertopright, xrotation = 90)
display(p)

p = groupedbar(productionResults.period, productionResults.WarehouseStockPeriodEnd, group=productionResults.product, 
               ylabel="Warehouse", size=(800,400),
               palette = :Pastel1_6, legend=:outertopright, xrotation = 90)
display(p)