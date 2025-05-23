# Tutorial IX - Safety Planning for the Islamic Pilgrimage in Mecca


# Introduction

The Hajj, one of the world’s largest religious gatherings, presents
fascinating and very important optimization challenges. During this
annual pilgrimage to Mecca, millions of Muslims perform sacred rituals,
including the symbolic stoning of the devil. Your task is to create an
efficient scheduling system that ensures both safety and spiritual
fulfillment for all pilgrims.

## The challenge

You’re responsible for scheduling 15 pilgrim groups
$\mathcal{S} \in \{g1,g2,...,g15\}$ across 6 time periods
$\mathcal{T} \in \{t1,t2,...,t6\}$ for the Jamarat ritual.

The groups $\mathcal{S}$ reside in two different camps
$\mathcal{C} \in \{A,B\}$. The first 6 groups are in camp A while the
other groups are in camp B. Each camp has only one path
$\mathcal{P} \in \{A-S-A,B-S-B\}$ and both paths have only one resource
$\mathcal{R}$, the stoning of the devil.

The capacity of the stoning is 10,000 pilgrims per period and there is
no period offset between the stoning and the capacity utilization. Each
group can stone the devil in any period $t$.

To constrain the fluctuation of the resource utilization $\sigma$ was
set to 0.3 while the first period is not constrained. Consider that the
number of pilgrims per group $s$ and the penalty value $f_{s,t}$ are
given.

------------------------------------------------------------------------

# 1. Problem Identification

You’ll need to create an optimization model that:

1.  Keeps everyone safe by respecting capacity limits
2.  Maintains steady flow between periods
3.  Maximizes pilgrim satisfaction by considering their time preferences

<div class="callout-attention">

The model can be simplified when compared to the full model from the
lecture in several ways!

</div>

Please illustrate possible simplifications in a few sentences in the
cell below and document the key sets, parameters, and decision variables
needed and which elements we can eliminate and why.

> [!TIP]
>
> To solve this task, it can be helpful to work with paper and pen to
> sketch the problem, and get a better understanding.

``` julia
#=



=#
```

------------------------------------------------------------------------

# 2. Implementing the Model

Now, implement and solve the problem defined in the previous task. This
time, a draft is not available and you have to implement everything
yourself. Note, that the number of pilgrims per group $s$ and the
penalty value $f_{s,t}$ are provided as CSV files. You can find them in
the `data` folder of this lectures folder in the Github repository.

## Load the Data

Start by loading the data into the notebook for the number of pilgrims
per group and the penalty value per group per period.

``` julia
# YOUR CODE BELOW
```

## Define all Sets, Parameters and Variables

Please define all sets, parameters and variables you are going to use in
the following cell. Make sure to read the task above carefully, as the
problem can be modelled much simpler than the full model from the
lecture, due to certain properties of the problem.

``` julia
# YOUR CODE BELOW
```

## Define the Model

Define the objective function and all constraints of the model in the
following cell.

``` julia
# YOUR CODE BELOW
```

## Solve the Model

Solve the model and print the results. What is the total dissatisfaction
with the resulting timetable?

``` julia
# YOUR CODE BELOW
```

> [!TIP]
>
> If you end up with an objective value of approximately 7, you have
> likely found the optimal solution to the problem.

------------------------------------------------------------------------

## Analyze the Results

Plot the utilization of the resource by using the `Plots` package.

``` julia
# YOUR CODE BELOW
```

Finally, reflect in a few sentences on the simplifications you made to
the model and how they affected the solution.

``` julia
#=



=#
```

------------------------------------------------------------------------

# Solutions

You will likely find solutions to most exercises online. However, I
strongly encourage you to work on these exercises independently without
searching explicitly for the exact answers to the exercises.
Understanding someone else’s solution is very different from developing
your own. Use the lecture notes and try to solve the exercises on your
own. This approach will significantly enhance your learning and
problem-solving skills.

Remember, the goal is not just to complete the exercises, but to
understand the concepts and improve your programming abilities. If you
encounter difficulties, review the lecture materials, experiment with
different approaches, and don’t hesitate to ask for clarification during
class discussions.

Later, you will find the solutions to these exercises online in the
associated GitHub repository, but we will also quickly go over them in
next week’s tutorial. To access the solutions, click on the Github
button on the lower right and search for the folder with today’s lecture
and tutorial. Alternatively, you can ask ChatGPT or Claude to explain
them to you. But please remember, the goal is not just to complete the
exercises, but to understand the concepts and improve your programming
abilities.
