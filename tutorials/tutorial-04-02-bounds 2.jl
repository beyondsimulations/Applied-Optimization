# -*- coding: utf-8 -*-
# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .jl
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.17.2
#   kernelspec:
#     display_name: Julia 1.11.6
#     language: julia
#     name: julia-1.11
#     path: /Users/vlcek/Library/Jupyter/kernels/julia-1.11
# ---

# %% [markdown]
# # Tutorial IV.II - Variables and Bounds in JuMP
#
# Applied Optimization with Julia
#
# # Introduction
#
# Welcome to this beginner-friendly tutorial on variables and bounds in
# JuMP! In this lesson, we’ll explore different types of variables and how
# to set limits (or bounds) on them. Don’t worry if you’re new to
# optimization - we’ll explain everything step by step using real-world
# examples.
#
# Follow the instructions, write your code in the designated code blocks,
# and confirm your understanding with `@assert` statements. Make sure to
# have the JuMP package installed to follow this tutorial.
#
# Let’s start by loading the JuMP package:

# %%
using JuMP

# %% [markdown]
# Now, let’s create a model that we’ll use throughout this tutorial:

# %%
model = Model()
println("Great! We've created a new optimization model.")

# %% [markdown]
# ------------------------------------------------------------------------
#
# # Section 1 - Understanding Different Types of Variables
#
# In optimization problems, we often need to represent different kinds of
# decisions. JuMP allows us to use three main types of variables:
#
# 1.  **Continuous variables**: These can take any real value within a
#     range. Example: The amount of water in a reservoir (can be any
#     number, like 3.7 liters).
#
# 2.  **Integer variables**: These can only be whole numbers. Example: The
#     number of cars produced in a factory (we can’t produce half a car!).
#
# 3.  **Binary variables**: These can only be 0 or 1. Example: Whether to
#     build a new store in a location (yes = 1, no = 0).
#
# Let’s see how to create each type:

# %%
@variable(model, variableName)

# %% [markdown]
# This defines a continuous variable without any bound.

# %%
@variable(model, 0 <= variableName2 <= 1)
has_lower_bound(variableName2) && has_upper_bound(variableName2)

# %% [markdown]
# This defines a continuous variable in an interval.

# %%
@variable(model, variableName3, Bin)
is_binary(variableName3)

# %% [markdown]
# This defines a binary variable.

# %%
@variable(model, 0 <= variableName4, Int)
is_integer(variableName4)

# %% [markdown]
# This defines an integer variable.
#
# > **Note**
# >
# > Note that you will have to change `model` and `variableName` according
# > to your instance.
#
# ## Exercise 1.1 - Create Variables
#
# Now it’s your turn! Create three variables:
#
# 1.  A continuous variable called `water_amount`
# 2.  An integer variable called `cars_produced`
# 3.  A binary variable called `build_store`

# %%
# YOUR CODE BELOW
# Hint: Use the @variable macro three times, once for each variable

# %%
# Test your answer
@assert typeof(water_amount) == VariableRef && !is_integer(water_amount) && !is_binary(water_amount)
@assert typeof(cars_produced) == VariableRef && is_integer(cars_produced)
@assert typeof(build_store) == VariableRef && is_binary(build_store)
println("Excellent work! You've successfully created continuous, integer, and binary variables.")

# %% [markdown]
# ------------------------------------------------------------------------
#
# # Section 2 - Creating Variables in Containers
#
# When we have many similar variables, it’s helpful to group them
# together. JuMP allows us to use containers like arrays and matrices for
# this purpose. For example:

# %%
@variable(model, variableName5[1:20], Bin)

# %% [markdown]
# This would create a container with 20 variables. To create a set based
# on a range, we could do:

# %%
new_range = 1:100
@variable(model, variableName6[i in new_range] >= 0)

# %% [markdown]
# This would create a container with 100 continuous variables larger than
# 0. For a container with multiple dimensions:

# %%
@variable(model, variableName7[1:30, 1:30])

# %% [markdown]
# This would create a container with a matrix of continuous variables
# without any bound. Note that you will have to change `model` and
# `variableName` according to your instance.
#
# ## Exercise 2.1 - Create an Array
#
# Imagine you’re planning production for a week. Create an array
# `daily_production` with 7 non-negative variables, one for each day of
# the week.

# %%
# YOUR CODE BELOW

# %%
# Test your answer
@assert length(daily_production) == 7
@assert all(lower_bound(daily_production[i]) == 0 for i in 1:7)
println("Great job! You've created an array of 7 non-negative variables for daily production.")

# %% [markdown]
# ## Exercise 2.2 - Create a Matrix of Variables
#
# Now, imagine you’re deciding whether to stock 4 different products in 3
# different stores. Create a 3x4 matrix of binary variables called
# `stock_decision`.

# %%
# YOUR CODE BELOW

# %%
# Test your answer
@assert size(stock_decision) == (3, 4)
@assert all(is_binary(stock_decision[i,j]) for i in 1:3, j in 1:4)
println("Excellent! You've created a 3x4 matrix of binary variables for stocking decisions.")

# %% [markdown]
# ------------------------------------------------------------------------
#
# # Section 3 - Setting Bounds on Variables
#
# Often, we know that a variable can’t go below or above certain values.
# We can set these limits (called bounds) when we create the variable.
#
# For example, if a factory can produce between 100 and 500 units:
#
# ``` julia
# @variable(model, 100 <= production <= 500)
# ```
#
# Or if we know a percentage must be between 0 and 100:
#
# ``` julia
# @variable(model, 0 <= percentage <= 100)
# ```
#
# ## Exercise 3.1 - Set Bounds on a Variable
#
# Create a variable `temperature` that represents the temperature setting
# on a thermostat. It should be between 0 and 37 degrees.

# %%
# YOUR CODE BELOW

# %%
# Test your answer
@assert lower_bound(temperature) == 0
@assert upper_bound(temperature) == 37
println("Well done! You've created a variable for temperature with appropriate bounds.")

# %% [markdown]
# ------------------------------------------------------------------------
#
# # Conclusion
#
# Fantastic! You’ve completed the tutorial on advanced variables in JuMP.
# You’ve learned how to create variables in containers, manage different
# types of variables, and work with indexed variables. Continue to the
# next file to learn more.
#
# # Solutions
#
# You will likely find solutions to most exercises online. However, I
# strongly encourage you to work on these exercises independently without
# searching explicitly for the exact answers to the exercises.
# Understanding someone else’s solution is very different from developing
# your own. Use the lecture notes and try to solve the exercises on your
# own. This approach will significantly enhance your learning and
# problem-solving skills.
#
# Remember, the goal is not just to complete the exercises, but to
# understand the concepts and improve your programming abilities. If you
# encounter difficulties, review the lecture materials, experiment with
# different approaches, and don’t hesitate to ask for clarification during
# class discussions.
#
# Later, you will find the solutions to these exercises online in the
# associated GitHub repository, but we will also quickly go over them in
# next week’s tutorial. To access the solutions, click on the Github
# button on the lower right and search for the folder with today’s lecture
# and tutorial. Alternatively, you can ask ChatGPT or Claude to explain
# them to you. But please remember, the goal is not just to complete the
# exercises, but to understand the concepts and improve your programming
# abilities.
