# -*- coding: utf-8 -*-
# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .jl
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.17.3
#   kernel_info:
#     name: julia
#   kernelspec:
#     display_name: Julia
#     language: julia
#     name: julia
# ---

# %% [markdown]
# # Tutorial IX - Safety Planning for the Islamic Pilgrimage in Mecca
#
# Applied Optimization with Julia
#
# # Introduction
#
# The Hajj, one of the world’s largest religious gatherings, presents
# fascinating and very important optimization challenges. During this
# annual pilgrimage to Mecca, millions of Muslims perform sacred rituals,
# including the symbolic stoning of the devil. Your task is to create an
# efficient scheduling system that ensures both safety and spiritual
# fulfillment for all pilgrims.
#
# ## The challenge
#
# You’re responsible for scheduling 15 pilgrim groups
# $\mathcal{S} = \{g1,g2,...,g15\}$ across 6 time periods
# $\mathcal{T} = \{t1,t2,...,t6\}$ for the Jamarat ritual.
#
# The groups $\mathcal{S}$ reside in two different camps
# $\mathcal{C} = \{A,B\}$. The first 6 groups are in camp A while the
# other groups are in camp B. Each camp has only one path
# $\mathcal{P} = \{A-S-A,B-S-B\}$, where A-S-A means camp A → stoning site
# → camp A (and likewise for B), and both paths have only one resource
# $r \in \mathcal{R}$, the stoning of the devil.
#
# The capacity of the stoning site is 10,000 pilgrims per period and there
# is no period offset between the stoning and the capacity utilization.
# Each group can stone the devil in any period $t$.
#
# To constrain the fluctuation of the resource utilization, $\sigma$
# (i.e. $\sigma_r$ from the lecture) was set to 0.3, while the first
# period is not constrained. Consider that the number of pilgrims per
# group, $n_s$, and the penalty value $f_{s,t}$ are given.
#
# ------------------------------------------------------------------------
#
# # 1. Problem Identification
#
# You’ll need to create an optimization model that:
#
# 1.  Keeps everyone safe by respecting capacity limits
# 2.  Maintains steady flow between periods
# 3.  Maximizes pilgrim satisfaction by considering their time preferences
#
# > **Important**
# >
# > The model can be simplified when compared to the full model from the
# > lecture in several ways!
#
# Please illustrate possible simplifications in a few sentences in the
# cell below and document the key sets, parameters, and decision variables
# needed and which elements we can eliminate and why. Write your answer as
# plain text inside the comment block, i.e. between `#=` and `=#`.
#
# > **Tip**
# >
# > To solve this task, it can be helpful to work with paper and pen to
# > sketch the problem and get a better understanding.

# %%
#=



=#

# %% [markdown]
# ------------------------------------------------------------------------
#
# # 2. Implementing the Model
#
# Now, implement and solve the problem defined in the previous task. This
# time, a draft is not available and you have to implement everything
# yourself. Note that the number of pilgrims per group, $n_s$, and the
# penalty value $f_{s,t}$ are provided as CSV files.
#
# ## Load the Data
#
# Start by loading the data into the notebook for the number of pilgrims
# per group and the penalty value per group per period.
#
# > **Tip**
# >
# > In both files, the first column contains the group names (g1 to g15).
# > You may want to drop it or use it as row labels. The penalty file is a
# > matrix with one row per group and one column per period.

# %%
# YOUR CODE BELOW


# %% [markdown]
# ## Define all Sets, Parameters and Variables
#
# Please define all sets, parameters and variables you are going to use in
# the following cell. Make sure to read the task above carefully, as the
# problem can be modelled much simpler than the full model from the
# lecture, due to certain properties of the problem.

# %%
# YOUR CODE BELOW



# %% [markdown]
# ## Define the Model
#
# Define the objective function and all constraints of the model in the
# following cell.

# %%
# YOUR CODE BELOW



# %% [markdown]
# ## Solve the Model
#
# Solve the model and print the results. What is the total dissatisfaction
# with the resulting timetable?

# %%
# YOUR CODE BELOW


# %% [markdown]
# > **Tip**
# >
# > If you end up with an objective value of approximately 7.03, you have
# > found the optimal solution to the problem.
#
# ------------------------------------------------------------------------
#
# ## Analyze the Results
#
# First, sum the group sizes by each group’s preferred period, i.e. the
# period with the lowest penalty value. Where do the time preferences
# cluster, and what would happen without the model? Compare the resulting
# loads to the capacity of 10,000 pilgrims per period.

# %%
# YOUR CODE BELOW


# %% [markdown]
# Next, plot the utilization of the resource by using the `Plots` package.
# Then, take a closer look at your plot: Does the capacity bind in any
# period? Is the fluctuation limit $\sigma = 0.3$ active between any two
# periods? Which groups were pushed away from their preferred period?

# %%
# YOUR CODE BELOW


# %% [markdown]
# Finally, reflect in a few sentences on the simplifications you made to
# the model and how they affected the solution.

# %%
#=



=#

# %% [markdown]
# ------------------------------------------------------------------------
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
