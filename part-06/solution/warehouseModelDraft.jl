import Pkg
Pkg.activate("applied_optimization")

using JuMP, Juniper, Ipopt, HiGHS
using DelimitedFiles
using LinearAlgebra

# Definition of the warehouse model ti apply a non-linare solver
ipopt = optimizer_with_attributes(Ipopt.Optimizer, "print_level" => 0)
highs = optimizer_with_attributes(HiGHS.Optimizer, "output_flag" => false)
warehouseModel = Model(
    optimizer_with_attributes(
        Juniper.Optimizer,
        "nl_solver" => ipopt,
        "mip_solver" => highs,
    ),
)

# Define the transactional data from the lecture

# Define the warehouse capacities

# Create the coappearance matrix

# Compute the capacity utilization of each product

# Define the decision variable

# Define the objective function to maximize the coappearance

# Define the constraints necessary for the model

# Solve the model with a solve statement
