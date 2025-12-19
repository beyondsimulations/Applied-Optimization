# -*- coding: utf-8 -*-
# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .jl
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.17.3
#   kernelspec:
#     display_name: Julia-AO 1.12.0
#     language: julia
#     name: julia-ao-1.12
#     path: /Users/vlcek/Library/Jupyter/kernels/julia-ao-1.12
# ---

# %% [markdown]
# # Tutorial X - Intermission: Exam Preparation
#
# Applied Optimization with Julia
#
# # Introduction
#
# This tutorial is another short intermission to give you an idea of the
# structure of the exam. You can hand in your answers at the end to
# receive half a **bonus point**, if at least 75 % of the answers are
# correct and you describe your work clearly. If you have any questions or
# suggestions on how to improve the structure of the exam, please ask
# them.
#
# The exam is just meant to be a **tool** to check your understanding of
# the material and to give you a chance to show your skills. It is not
# meant to be a stressful event or a punishment. If you have followed the
# course and put in the effort, you should be able to pass the exam with a
# good grade.
#
# > **Tip**
# >
# > As some of these tasks are difficult to answer on a computer, you can
# > hand in your answer scanned or written digitally on an iPad or Laptop.
#
# ------------------------------------------------------------------------
#
# # Part I
#
# ## 1.a (6 Points)
#
# As temperatures rise due to global warming, so does the demand for ice
# cream. The ice cream company was amazed by your transportation plan from
# the lecture and asked if you could help with their production plan.
#
# The company wants to optimize its production to keep up with the
# customer demand. To do so, they offer different flavors of ice cream
# that are made and stored in a warehouse. Each flavor has a unique
# production time per unit of ice cream and no setup time for the
# production. In the first period, the company has 100 units of each
# flavor in storage at the start of the period.
#
# Furthermore, each setup of a different flavor costs a fixed amount of
# money identical for all flavors and periods, while the ice cream storage
# costs in the warehouse are different for each flavor but identical for
# all periods. These storage costs occur at the end of each period per
# unit of ice cream for all units not sold to cover the varying demand per
# flavor and period.
#
# Each period matches a shift length of a certain number of hours,
# identical for all periods. The objective is to minimize the total cost
# of production and storage while satisfying all demands and production
# capacities.
#
# Define all sets, parameters and variables required to model the problem
# described above. Select a suitable notation of your choice. Make sure to
# explicitly state in your notation which elements are sets, parameters
# and variables.
#
# > **Tip**
# >
# > Note that the problem does not have to be modeled yet!

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 1.b (3 Points)
#
# Please define the objective function to model the described problem
# based on your defined notation.
#
# > **Tip**
# >
# > If you need additional sets, parameters or variables that are not yet
# > defined, please define them as well.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 1.c (6 Points)
#
# Please define all necessary constraints and the variable ranges to model
# the described problem based on your notation.
#
# > **Tip**
# >
# > If you need additional sets, parameters or variables that are not yet
# > defined, please define them as well.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 1.d (2 Points)
#
# Is the model formulation a nonlinear problem with continuous variables?
#
# Please explain your answer briefly.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 1.e (9 Points)
#
# Due to the success of the companies, workers demand higher wages and a
# compensation for working overtime. Your task is to extend the model to
# reflect this new situation. In the future, each worked hour in a period
# has a fixed cost per shift hour, identical for all periods. If the
# production time in one period exceeds the shift-length, workers have to
# work overtime. For each hour working overtime, the fixed costs per hour
# are 50% higher than usual. Furthermore, more than an additional time of
# a half a shift length is not allowed due to legal reasons.
#
# How can you expand your model to reflect this new situation? Write down
# all additional or modified sets, parameters, variables, constraints and
# the objective function while describing each with a few words.
#
# > **Tip**
# >
# > Note, that you only need to write down new and modified elements!

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 1.f (4 points)
#
# What assumptions are made in the model that might not hold in the real
# world?
#
# Please describe at least two assumptions with a 1-3 sentences and
# explain briefly why they might not hold.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# # Part II
#
# ## 2.a (6 Points)
#
# Throughout the course, we covered several different optimization
# problems. For one of the following two problems, briefly:
#
# -   Describe the main objective of the problem (2 points)
# -   Describe two key assumptions of the model (2 points per assumption)
#
# Choose from:
#
# -   Transportation Problem (Solar Panel Transport)
# -   Split Order Minimization Problem (E-Commerce)

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 2.b (4 Points)
#
# You are trying to solve the capacitated vehicle routing problem with
# more than 500 customers and 10 vehicles. Unfortunately, your computer is
# not able to handle the problem. What could you try to solve the problem
# instead?
#
# Please describe one approach to adress the problem and describe the
# advantages and disadvantages of the approach in a few sentences.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 2.c (3 Points)
#
# Suppose you aim to improve the shifts of workers in a hospital. As the
# administration finds it difficult to find new workers, they want to
# optimize the shifts of the current workers to improve their
# satisfaction. What potential objective could be used in an objective
# function?
#
# Please describe the objective function and explain why it would be a
# good choice for the problem.
#
# > **Tip**
# >
# > You don’t need to write any code or mathematical model here!

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 2.d (2 Points)
#
# What is the purpose of a solver used in Mathematical Programming?
#
# Please describe the answer in your own words in 2-3 sentences.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# # Part III
#
# ## 3.a (3 Points)
#
# Create a JuMP variable with the following properties: A continuous
# variable `Production[t,p]` for time periods $t \in 1:T$ and products
# $p \in 1:P$ which must be non-negative and has an upper bound stored in
# parameter `capacity[t,p]`. All parameters (`T`, `P`, `capacity`) are
# already defined, the model is not created yet.
#
# Specify the definition of the variable in correct Julia syntax.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 3.b (3 Points)
#
# Write JuMP code to implement the following constraint:
#
# $$\sum_{f \in F} Y_{f,z} \leq 1 \quad \forall z \in Z$$
#
# Assume variables `Y` is already defined as binary variables and the sets
# `F` and `Z` are already defined as well. The model is also already
# created.
#
# Specify the definition of the constraint in correct Julia syntax.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 3.c (2 Points)
#
# You are given the following JuMP code with a constraint that is not
# correctly implemented.
#
# ``` julia
# @constraint(sum(X[i,j] for i in 1:10, j in 1:5) == 10)
# ```
#
# Please explain why the constraint is not correctly implemented and how
# it can be fixed.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 3.d (2 Points)
#
# What is the difference between a tuple and an array (vector) in Julia?
#
# Please describe the difference in a 1-3 sentences.

# %% [raw] raw_mimetype="typst"
# #pagebreak()

# %% [markdown]
# ------------------------------------------------------------------------
#
# ## 3.e (5 Points)
#
# You are given the following code in Julia:

# %%
mySet = 1:8
vectorA = ["Hello", "World"]
for i in mySet
    if i <= 2
        println(vectorA[i])
    elseif i <= 4
        println(vectorA[i-2])
    elseif i > 6 && i <= 8
        println("This is $i")
    elseif i == 9
        break
    else
        println("Hi $i")
    end
end

# %% [markdown]
# Please write down the output of the code.

# %% [raw] raw_mimetype="typst"
# #pagebreak()
