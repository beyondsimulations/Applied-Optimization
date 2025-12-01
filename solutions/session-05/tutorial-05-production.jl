# -*- coding: utf-8 -*-
# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .jl
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.17.2
#   kernel_info:
#     name: julia
#   kernelspec:
#     display_name: Julia 1.10.6
#     language: julia
#     name: julia-1.10
# ---

# %% [markdown]
# # Tutorial V - Production Planning in Breweries
#
# Applied Optimization with Julia
#
# # 1. Modelling the CLSP
#
# Implement the CLSP from the lecture in Julia. Before we start, let’s
# load the necessary packages and data.

# %%
using JuMP, HiGHS
using CSV
using DelimitedFiles
using DataFrames
using Plots
using StatsPlots
import Pkg; Pkg.add("PlotlyBase")
plotly() # This will create interactive plots later on

# %% [markdown]
# > **Tip**
# >
# > If you haven’t installed the packages yet, you can do so by running
# > `using Pkg` first and then `Pkg.add("JuMP")`, `Pkg.add("HiGHS")`,
# > `Pkg.add("DataFrames")`, `Pkg.add("Plots")`, and
# > `Pkg.add("StatsPlots")`.
#
# Now, let’s load the data. The weekly demand in bottles $d_{i,t}$, the
# available time at the bottling plant in hours $a_t$, the time required
# to bottle each beer in hours $b_i$, and the setup time in hours $g_i$
# are provided as CSV files.

# %%
# Get the directory of the current file
file_directory = "$(@__DIR__)/data"

# Load the data about the available time at the bottling plant
availableTime = CSV.read("$file_directory/availabletime.csv", DataFrame)
println("Number of periods: $(nrow(availableTime))")
println("First 5 rows of available time per period:")
println(availableTime[1:5, :])

# %%
# Load the data about the bottling time for each beer
bottlingTime = CSV.read("$file_directory/bottlingtime.csv", DataFrame)
println("Number of beers: $(nrow(bottlingTime))")
println("Bottling time per beer:")
println(bottlingTime)

# %%
# Load the data about the setup time for each beer
setupTime = CSV.read("$file_directory/setuptime.csv", DataFrame)
println("Setup time per beer:")
println(setupTime)

# %%
# Load the data about the weekly demand for each beer
demandCustomers = CSV.read("$file_directory/demand.csv", DataFrame)
println("First 5 rows of demand per beer:")
println(demandCustomers[1:5, :])

# %% [markdown]
# Consider in your implementation, that **each hour of setup** is
# associated with a cost of 1000 Euros, and the inventory holding cost for
# unsold bottles at the end of each period is 0.1 Euro per bottle.
# Implement **both parameters** for the cost of setup and the inventory
# holding cost in the model. Call them `setupHourCosts` and
# `warehouseCosts`.

# %%
# YOUR CODE BELOW
setupHourCosts = 1000
warehouseCosts = 0.1

# %% [markdown]
# Next, you need to prepare the given data for the model. Create a
# dictionary for the available time, bottling time, and setup time. Call
# them `dictAvailableTime`, `dictBottlingTime`, and `dictSetupTime`.

# %%
# Prepare the data for the model
dictDemand = Dict((row.beer_type,row.period) => row.demand for row in eachrow(demandCustomers))

# YOUR CODE BELOW
dictAvailableTime = Dict(row.period => row.available_capacity for row in eachrow(availableTime))
dictBottlingTime = Dict(row.beer_type => row.bottling_time for row in eachrow(bottlingTime))
dictSetupTime = Dict(row.beer_type => row.setup_time for row in eachrow(setupTime))


# %% [markdown]
# Next, we define the model instance for the CLSP.

# %%
# Prepare the model instance
lotsizeModel = Model(HiGHS.Optimizer)
set_attribute(lotsizeModel, "presolve", "on")
set_time_limit_sec(lotsizeModel, 60.0)

# %% [markdown]
# Now, create your variables. Please name them `productBottled` for the
# binary variable, `productQuantity` for the production quantity and
# `WarehouseStockPeriodEnd` for the warehouse stock at the end of each
# period. We will use these names later in the code to plot the results.

# %%
# YOUR CODE BELOW
@variable(lotsizeModel, productBottled[i=keys(dictBottlingTime), t=keys(dictAvailableTime)], Bin)
@variable(lotsizeModel, productQuantity[i=keys(dictBottlingTime), t=keys(dictAvailableTime)] >= 0)
@variable(lotsizeModel, WarehouseStockPeriodEnd[i=keys(dictBottlingTime), t=keys(dictAvailableTime)] >= 0)


# %% [markdown]
# Next, define the objective function.

# %%
# YOUR CODE BELOW
@objective(lotsizeModel, Min, 
    sum(setupHourCosts*dictSetupTime[i]*productBottled[i,t] + warehouseCosts*WarehouseStockPeriodEnd[i,t] for i in keys(dictBottlingTime), t in keys(dictAvailableTime))
    )

# %% [markdown]
# Now, we need to define all necessary constraints for the model. Start
# with the demand/inventory balance constraint.
#
# > **Tip**
# >
# > The first period is special, as it does not have a previous period.
# > Furthermore, we are working with strings as variable references, thus
# > we cannot use `t-1` directly as in the lecture. To address this, we
# > could collect and sort all keys and then use their indices to address
# > the previous period. For example, `all_periods[t-1]` would then be the
# > previous period, if we index t just as a range from
# > `2:length(all_periods)`.

# %%
# Get the first period and all periods
first_period = first(sort(collect(keys(dictAvailableTime))))
all_periods = sort(collect(keys(dictAvailableTime)))


# %% [markdown]
# With these, we can now define the demand/inventory balance constraint.
# As this is the first constraint and might be a bit tricky, the solution
# is already given below.

# %%
@constraint(lotsizeModel, 
    # Inventory balance constraints for periods after first period
    demandBalance[i=keys(dictBottlingTime), t=2:length(all_periods)],
    WarehouseStockPeriodEnd[i,all_periods[t-1]] + productQuantity[i,all_periods[t]] - WarehouseStockPeriodEnd[i,all_periods[t]] == dictDemand[i,all_periods[t]]
    )

# %% [markdown]
# Next, we need to ensure that we setup the production for a beer type
# only if we bottle the type at least once.

# %%
# YOUR CODE BELOW
@constraint(lotsizeModel, 
    setupRestriction[i=keys(dictBottlingTime), t=keys(dictAvailableTime)],
    productQuantity[i,t] <= productBottled[i,t] * sum(dictDemand[i,tt] for tt in keys(dictAvailableTime))
    )


# %% [markdown]
# Last, we need to define the constraint that limits the production
# quantity to the number of bottles that can be bottled within the
# available time.

# %%
# YOUR CODE BELOW
@constraint(lotsizeModel, 
    bottlingRestriction[t=keys(dictAvailableTime)],
    sum(dictBottlingTime[i]*productQuantity[i,t]+dictSetupTime[i]*productBottled[i,t] for i in keys(dictBottlingTime)) <= dictAvailableTime[t]
    )

# %% [markdown]
# Finally, implement the solve statement for your model instance.

# %%
# YOUR CODE BELOW
optimize!(lotsizeModel)

# %% [markdown]
# Now, unfortunately we cannot assert the value of the objective function
# perfectly here as we have to abort the computation due to the time limit
# and everybody is likely getting different results. The solution for the
# first task will likely be in the <span class="highlight">range of
# 600,000 to 700,000</span>. If your model is solved within seconds, your
# formulation is not correct.
#
# The following code creates production and warehouse plots for you. Use
# it to verify and visualize your solution in the following tasks.
#
# > **Note**
# >
# > The creation of the dataframes and the plots is implemented inside of
# > a function, as we will need to use it multiple times in the following
# > tasks.

# %%
# Create the production results
function create_production_results()
    # Create a DataFrame to store the results
    productionResults = DataFrame(
        period = String[],
        product = String[],
        productBottled = Bool[],
        productQuantity=Int[],
        WarehouseStockPeriodEnd=Int[]
    )

    # Populate the DataFrame with the results
    for i in keys(dictSetupTime)
        for t in keys(dictAvailableTime)
            push!(
                productionResults,(
                period = t,
                product = i,
                productBottled = value(productBottled[i,t])>0.5 ? true : false,
                productQuantity = ceil(Int,value(productQuantity[i,t])),
                WarehouseStockPeriodEnd = ceil(Int,value(WarehouseStockPeriodEnd[i,t])),
                )
            )
        end
    end

    sort!(productionResults,[:period, :product])
    return productionResults
end

# Create the production plot
function create_production_plot(productionResults)
    p = groupedbar(
        productionResults.period, 
        productionResults.productQuantity, 
        group=productionResults.product, 
        ylabel="Production Quantity (Bottles)",
        xlabel="Period",
        title="Production Schedule by Beer Type",
        size=(1200,600),
        palette = :Set3,
        legend=:outertopright,
        xrotation = 45,   
        legendtitle="Beer Type",
        bar_width=0.7,    
        grid=false,       
        dpi=300           
    )
    return p
end

# Create the warehouse stock plot
function create_warehouse_plot(productionResults)
    p = groupedbar(
        productionResults.period, 
        productionResults.WarehouseStockPeriodEnd, 
        group=productionResults.product,
        ylabel="Warehouse Stock", 
        xlabel="Period",
        title="Warehouse Stock",
        size=(1200,600),
        palette = :Set3,  
        legend=:outertopright,
        xrotation = 45,   
        legendtitle="Beer Type",
        bar_width=0.7,    
        grid=false,       
        dpi=300           
    )
    return p
end



# %% [markdown]
# The following code creates the production plot.

# %%
productionResults = create_production_results()
p = create_production_plot(productionResults)

# %% [markdown]
# The following code creates the warehouse stock plot.

# %%
productionResults = create_production_results()
p = create_warehouse_plot(productionResults)

# %% [markdown]
# Next, we calculate the setup and inventory costs for each period and
# store them in a DataFrame. This should also work for you, if you
# followed the previous name instructions.

# %%
# Calculate costs per period
function create_cost_results()
    costResults = DataFrame(
        period = String[],
        setup_costs = Float64[],
        inventory_costs = Float64[]
    )

    for t in sort(collect(keys(dictAvailableTime)))
        # Calculate setup costs for this period
        period_setup_costs = sum(
            setupHourCosts * dictSetupTime[i] * value(productBottled[i,t]) 
            for i in keys(dictBottlingTime)
        )
        
        # Calculate inventory costs for this period
        period_inventory_costs = sum(
            warehouseCosts * value(WarehouseStockPeriodEnd[i,t]) 
            for i in keys(dictBottlingTime)
        )
        
        push!(costResults, (
            period = t,
            setup_costs = period_setup_costs,
            inventory_costs = period_inventory_costs
        ))
    end

    # Stack the cost columns
    stacked_costs = stack(costResults, [:setup_costs, :inventory_costs], 
                         variable_name="Cost_Type", value_name="Cost")
    return stacked_costs
end

# Create the cost plot
function create_cost_plot(stacked_costs)
    p = groupedbar(
        stacked_costs.period,
        stacked_costs.Cost,
        group=stacked_costs.Cost_Type,
        ylabel="Costs (€)",
        xlabel="Period",
        title="Setup and Inventory Costs per Period",
        size=(1200,600),
        palette=:Set2,
        legend=:outertopright,
        xrotation=45,
        legendtitle="Cost Type",
        bar_width=0.7,
        grid=false,
        dpi=300
    )
    return p
end

# %% [markdown]
# The following code calls the setup and inventory costs plot.

# %%
stacked_costs = create_cost_results()
p = create_cost_plot(stacked_costs)

# %% [markdown]
# # 2. Initial Warehouse Stock
#
# The model currently sets the initial warehouse stock levels without any
# restrictions. Modify your model to incorporate an initial stock for
# **all types of beer of zero** at the beginning of the initial planning
# period. To solve this task, you can simply extend the previous model by
# these additional constraints in the cell below. Afterwards, you can
# re-run the optimization.

# %%
# YOUR CODE BELOW
@constraint(lotsizeModel, 
    # Special case for first period (no previous inventory)
    demandBalanceFirst[i=keys(dictBottlingTime)],
    productQuantity[i,first_period] - WarehouseStockPeriodEnd[i,first_period] == dictDemand[i,first_period]
)
optimize!(lotsizeModel)

# %% [markdown]
# The objective value should now be higher, as the solution space is
# smaller than before and the initial stock is zero for all beer types.
# You can check the plots for the production and warehouse stock to verify
# this.

# %%
productionResults = create_production_results()
p = create_production_plot(productionResults)

# %%
productionResults = create_production_results()
p = create_warehouse_plot(productionResults)

# %%
stacked_costs = create_cost_results()
p = create_cost_plot(stacked_costs)

# %% [markdown]
# # 3. Scheduled Repair
#
# Unfortunately, the bottling plant has to undergo maintenance in periods
# `"week_10"` and `"week_11"`. Extend your model to prevent any production
# in those two periods. Again, to solve this task, you can simply extend
# the previous model by these additional constraints in the cell below.
# Afterwards, you can re-run the optimization.

# %%
# YOUR CODE BELOW
# Prevent production during maintenance weeks
@constraint(lotsizeModel,
    maintenanceRestriction[i=keys(dictBottlingTime), t=["week_10", "week_11"]],
    productQuantity[i,t] == 0
)
optimize!(lotsizeModel)

# %% [markdown]
# Again, the objective value should be higher, because the solution space
# is smaller. You can check the plots for the production and warehouse
# stock to verify whether the production is zero in the maintenance
# periods.

# %%
productionResults = create_production_results()
p = create_production_plot(productionResults)

# %%
productionResults = create_production_results()
p = create_warehouse_plot(productionResults)

# %%
stacked_costs = create_cost_results()
p = create_cost_plot(stacked_costs)

# %% [markdown]
# # 4. Production Schedule Analysis
#
# Analyze the production schedule outlined in section 2 of this tutorial.
# Is the workload **distributed evenly** across all time periods? Provide
# a rationale for your assessment. Please answer in the following cell.
# Note, that `#=` and `=#` are a comment delimiter for multiline comments.
# You can write whatever you want between them and the code will not be
# executed.

# %%
# YOUR REASONING BELOW
#=
No, the workload is not distributed evenly across all time periods. As we start with an empty warehouse, we first have to produce a lot of beer in the first few periods. This is why we see such high production numbers in the first periods. Furthermore, we see that the model tries to end with an empty warehouse, as the last periods have very low production numbers. This is natural, as we want to avoid any leftover bottles at the end of the planning horizon as they come with additional costs.
=#

# %% [markdown]
# Based on the production data from the final period, calculate the ending
# inventory levels for each type of beer. Discuss any significant
# findings. Compute the ending inventory levels for each type of beer in
# the following cell. You can name the DataFrame however you want.

# %%
# YOUR CODE BELOW
# Get the last period
last_period = last(sort(collect(keys(dictAvailableTime))))

# Create a DataFrame to show ending inventory for each beer type
ending_inventory = DataFrame(
    beer_type = String[],
    ending_inventory = Int[]
)

# Calculate ending inventory for each beer type
for i in keys(dictBottlingTime)
    inventory = ceil(Int, value(WarehouseStockPeriodEnd[i,last_period]))
    push!(ending_inventory, (beer_type = i, ending_inventory = inventory))
end

# Sort by beer type and display results
sort!(ending_inventory, :beer_type)
println("Ending Inventory Levels:")
println(ending_inventory)

# Calculate total ending inventory
total_inventory = sum(ending_inventory.ending_inventory)
println("\nTotal Ending Inventory: $total_inventory bottles")


# %% [markdown]
# # 5. Biannual Bottling Strategy
#
# Reflecting on a scenario where the company schedules its bottling
# operations **biannually** using the current method: identify and discuss
# potential pitfalls of this strategy. Offer at least one actionable
# suggestion for enhancing the efficiency or effectiveness of the
# production planning process.
#
# Your answer goes here.

# %%
# YOUR ANSWER BELOW
#=
This methood is not optimal, as we start with an empty warehouse and have to produce a lot of beer in the first few periods. At the end of the planning horizon, the warehouse is empty again, wrovementhich is not optimal, as we start with an empty warehouse again in our next planning horizon. It would be better to ensure a rolling horzion strategy, where we replan in a shorter time frame. Furthermore, we should add further constraints to avoid empty warehouse stock at the end of the planning horizon (at least if the demand pattern or seasonality does not change).
=#
