# Lecture I - Welcome and Introduction
Dr. Tobias Vlćek

# <span class="flow">About this Course</span>

## About me

- **Field:** Optimizing and simulating complex systems
- **Languages:** of choice: Julia, Python and Rust
- **Interest:** Modelling, Simulations, Machine Learning
- **Teaching:** OR, Algorithms, and Programming
- **Contact:** <tobias.vlcek@uni-hamburg.de>

. . .

> [!TIP]
>
> I really appreciate active participation and interaction!

# <span class="flow">Course Structure</span>

## Lectures

- Every Tuesday between 10.15 AM and 11.45 AM
- First four lectures repeat modelling and programming
- Later lectures discuss practical problems and implementation
- Lectures are interactive → We discuss approaches!
- Communication takes place via OpenOlat and E-Mail

## Tutorials

- Tutorials every Friday between 8.15 AM and 9.45 AM
- In these tutorials we are working on assignments
- Please bring a laptop with Windows, macOS, or Linux!
- This Friday there is **no tutorial**!

## Assignments

- Based on applied problems of the lecture
- Up to 3 students can solve assignments together
- Submitted solutions earn bonus points for the exam
- Max. 0.5 point per tutorial

. . .

> [!NOTE]
>
> Bonus points only count if the mark is at least 4.0!

# <span class="flow">Course Objective</span>

## Applied Optimization

- Real-world problems can be addressed with models
- Our objective is to foster your interest in the topic
- Enable you to recognize and solve problem structures
- Includes problem understanding and implementation

## Research in Operations Research

- Part of the University of Hamburg Business School
- Aiming to solve real-world problems
- Or improving our theoretical understanding
- Publication in journals and conferences

. . .

> [!NOTE]
>
> We are also happy to supervise Bachelor and Master theses!

## National and international journals

- European Journal of OR
- Journal of the Operational Research Society
- Journal on Applied Analytics
- Management Science
- Operations Research
- OR Spectrum

# <span class="flow">Real-World Applications</span>

## <span class="invert-font">Brewery Production Planning</span>

<div class="footer">

Mickein, Koch, and Haase (2022)

</div>

## <span class="invert-font">Police Service District Planning</span>

<div class="footer">

Vlćek, Haase, Fliedner, et al. (2024)

</div>

## <span class="invert-font">Venue Seating under COVID-19</span>

<div class="footer">

Usama Dkaidik and Matthes Koch; Current research with a likely paper
submission in 2024

</div>

## <span class="invert-font">Metro Inflow Management</span>

<div class="footer">

Vlćek, Haase, Koch, et al. (2024)

</div>

## <span class="invert-font">Split-Order Minimization</span>

<div class="footer">

Vlćek and Voigt (2024)

</div>

## <span class="invert-font">Crowd Management</span>

<div class="footer">

Haase et al. (2016)

</div>

# <span class="flow">Lecture Preview</span>

## Part I

1.  Welcome and Introduction
2.  First Steps in Julia
3.  Packages and Data Management
4.  Modelling with JuMP

## Part II

5.  Beer Production Planning
6.  Minimizing Split Orders in E-Commerce
7.  Periodic Library Routing
8.  Police Districting

## Part III

9.  Safety Planning for the Islamic Pilgrimage in Mecca
10. Passenger Flow Control in Urban Rail
11. Arena Seat Planning under Distancing Rules
12. Sales Force Deployment for Teams
13. Recap and Discussion

# <span class="flow">Julia Programming Language</span>

## Choice of Programming Language

<img
src="https://images.beyondsimulations.com/ao/ao_julia-programming-language.png"
class="r-stretch" data-max-width="400px" />

. . .

<span class="question">Question:</span> Have you ever heard of Julia?

## Why Julia?

- **Designed to be:**
  - as general as Python
  - as statistics-friendly as R
  - as fast as C++!

. . .

> [!TIP]
>
> **Allows for fast data workflows**, particularly in scientific
> computing!

## Syntax

- Dynamically-typed syntax just like Python
- Similar to R, Matlab and Python - **not like C++**
- In comparison, accessible and easy to learn!
- **No need to worry about memory management!**

## JuMP

- Package for **algebraic modeling** in Julia
- Simplifies solving complex optimization problems
- Provides a high-level, user-friendly interface
- Useful for operations research and data science

. . .

> [!TIP]
>
> JuMP is an alternative to Pyomo, GAMS, and AMPL!

## Must it be a new language?

- Yes, but no need to worry!
- Julia is quite similar to Python and R
- We will learn the syntax together in the first part
- It is helpful to switch languages from time to time

# <span class="flow">Algebraic Modeling</span>

## 

<div class="r-fit-text">

Do you have

experience with

algebraic modeling?

</div>

## What is algebraic modeling?

- A “mathematical language” for optimization problems
- Allows for describing complex systems and constraints
- Based on linear algebra (Equations and Inequalities)

. . .

<div style="display: flex; justify-content: center; align-items: center; height: 300px;">

<iframe src="https://giphy.com/embed/APqEbxBsVlkWSuFpth" height="320" style frameBorder="0" class="giphy-embed" allowFullScreen>

</iframe>

</div>

## How to learn algebraic modeling?

- **Practice, practice, and practice!**
- Understand standard models and their approach
- Develop an understanding of constraints
- Understand the structure of a models solution space
- Use an available algorithms to determine solutions

## Central Questions

- What is to be decided?
- What is relevant to the decision?
- What information is given and relevant?
- What parameters (data) are needed?
- Which variables and of which type are needed?

. . .

> [!TIP]
>
> Modeling is a creative process!

## Model Components

1.  Objective function
2.  Constraints
3.  Variables

. . .

> [!NOTE]
>
> We will go through these components step by step in each lecture!

## Linear Optimization Model

<div class="columns" style="font-size: 75%;">

<div class="column" width="50%">

#### Basic Model Formulation

$$
\begin{aligned}
&\text{maximize} \quad F = \sum_{j\in \mathcal{J}} c_j \times X_j
\end{aligned}
$$

subject to

$$
\begin{aligned}
&\sum_{j\in \mathcal{J}} a_{i,j} \times X_j  \le b_i && \forall i \in \mathcal{I} \\
&X_j \ge 0 &&  \forall  j \in \mathcal{J} 
\end{aligned}
$$

</div>

<div class="column" width="50%">

#### Model Components

$$
\begin{aligned}
\mathcal{I} &: \text{set of $i \in \mathcal{I}$,}\\
\mathcal{J} &: \text{set of $j \in \mathcal{J}$,}\\
F   &: \text{Objective function variable,}\\
X_{j}   &: \text{decision variables,}\\
c_{j}   &: \text{objective function coefficients,}\\
a_{i,j} &: \text{parameters,}\\
b_{i}   &: \text{parameters}
\end{aligned}
$$

</div>

</div>

. . .

<span class="question">Question:</span> Have you ever seen something
like this before?

## What is this good for?

- <span class="highlight">Good Question!</span> A lot of things:
  - Modeling real-world problems
  - Solving complex systems
  - Optimizing resource allocation
  - Decision-making under constraints
  - Simulation and prediction

# <span class="flow">Solar Panel Transport</span>

## <span class="invert-font">Case: Solar Panel Transport</span>

## Description

A company is producing **solar panels** in Dresden and Laupheim and has
to transport them to new solar farms near Hamburg, Munich, and Berlin.
The quantities offered and demanded (truckloads) and the transport costs
per truckload in Euro are summarized in the following table.

## Transport Costs

| Origin/Destination | Hamburg | Munich | Berlin | Available |
|--------------------|---------|--------|--------|-----------|
| Dresden            | 5010    | 4640   | 1980   | 34        |
| Laupheim           | 7120    | 1710   | 6430   | 41        |
| Demand             | 21      | 17     | 29     |           |

<span class="highlight">Example</span>: A truckload from Dresden $i=1$
to Munich $j=2$ costs $c_{12}=4640$ Euro. Moreover, it is necessary to
**fulfil all customer demands**, as the contract has been signed.

## Graphical Illustration

![](https://images.beyondsimulations.com/ao/ao_transport.png)

# <span class="flow">Understanding the Problem</span>

## What are we trying?

First, we always need to understand the objectives.

. . .

<span class="question">Question:</span> What are our possible
objectives?

<span class="fragment">Minimizing the <span class="highlight">transport
costs</span> over all truckloads while <span class="highlight">meeting
the demand</span> based on the <span class="highlight">available solar
panels</span> adhering to the available panels.</span>

## 

<div class="r-fit-text">

Let’s break it down

step by step!

</div>

## Sets

Remember, sets are <span class="highlight">collections of
elements</span>

. . .

<span class="question">Question:</span> What sets are needed?

. . .

$$
\begin{aligned}
\mathcal{I} &: \text{Set of production sites, indexed by } i \text{ with } i \in \{1, \ldots, |\mathcal{I}|\}, \\
\mathcal{J} &: \text{Set of customers, indexed by } j \text{ with } j \in \{1, \ldots, |\mathcal{J}|\}.
\end{aligned}
$$

. . .

> [!TIP]
>
> We often use **plural** names for sets and a caligraphic letter, e.g.,
> $\mathcal{I}$ and $\mathcal{J}$.

## Parameters

Parameters are <span class="highlight">fixed values that are
given.</span>

. . .

<span class="question">Question:</span> What parameters are needed?

. . .

$$
\begin{aligned}
c_{i,j} &: \text{Costs per truck load for transport from } i \text{ to } j, \\
a_i &: \text{Available truck loads at } i, \\
b_j &: \text{Customer demands at } j.
\end{aligned}
$$

. . .

> [!TIP]
>
> We usually use the corresponding lower-case letter, e.g., $c$, $a$,
> and $b$.

## Decision Variable

- Decision variables are the values we are trying to find
- Here, our objective is to minimize the transport costs

. . .

<span class="question">Question:</span> What decision variables are
needed?

. . .

$$
X_{i,j} \text{Trucks that deliver panels from site } i \text{ to customer } j.
$$

. . .

> [!TIP]
>
> We use upper-case letters to distinguish variables from parameters,
> e.g., $X$.

## 

<div class="r-fit-text">

These are our

building blocks!

</div>

## Objective Function

- The objective function is the value we are trying to minimize
- Formalized as a sum of decision variables and parameters

. . .

<span class="question">Question:</span> Do you remember the objective?

## Minimizing the Transport Costs

<span class="highlight">Minimize</span> the transport costs over all
truckloads while meeting the demand based on the available solar panels
adhering to the available panels.

. . .

<span class="question">Question:</span> How can we write this down?

. . .

$$
\text{Minimize} \quad \sum_{i \in \mathcal{I}} \sum_{j \in \mathcal{J}} c_{i,j} \times X_{i,j}
$$

## Constraints

- Constraints are <span class="highlight">conditions that must be
  met</span>
- They limit the solution space!

<span class="question">Question:</span> Objective value without any
constraints?

. . .

- The value is <span class="higlight">zero</span>
- We can transport any number of panels

. . .

<span class="question">Question:</span> What constraints are needed?

## Supply Constraints

Ensure that the number of panels transported from a location does not
exceed the available panels.

. . .

<span class="question">Question:</span> How can we formalize this?

. . .

$$
\sum_{j \in \mathcal{J}} X_{i,j} \leq a_i \quad \forall i \in \mathcal{I}
$$

## Demand Constraints

Ensure that the demand of each customer is covered.

. . .

<span class="question">Question:</span> Any ideas?

. . .

$$
\sum_{i \in \mathcal{I}} X_{i,j} = b_j \quad \forall j \in \mathcal{J}
$$

## Non-negativity Constraints

Ensure no negative number of truckloads are transported.

. . .

<span class="question">Question:</span> Has anyone an idea how to write
this down?

. . .

$$
X_{i,j} \geq 0 \quad \forall i \in \mathcal{I}, \forall j \in \mathcal{J}
$$

## Transport Problem

The complete model can then be written as:

$$
\begin{aligned}
\text{Minimize} \quad F &= \sum_{i \in \mathcal{I}} \sum_{j \in \mathcal{J}} c_{i,j} \times X_{ij} \\
\text{subject to:} \quad
&\sum_{j \in \mathcal{J}} X_{i,j} \leq a_i \quad &&\forall i \in \mathcal{I} \\
&\sum_{i \in \mathcal{I}} X_{i,j} = b_j \quad &&\forall j \in \mathcal{J} \\
&X_{i,j} \geq 0 \quad &&\forall i \in \mathcal{I}, \forall j \in \mathcal{J}
\end{aligned}
$$

## Inequality Constraints

<span class="question">Question:</span> Could we replace $=$ by $\geq$
in the demand constraint?

. . .

- Yes, we could!
- We could deliver more than the demand
- But this would not happen here

. . .

<span class="question">Question:</span> Why won’t we transport more than
the demand?

- Due to the associated costs

## 

<div class="r-fit-text">

Any

questions?

</div>

# <span class="flow">Profit Maximization</span>

## Description

Unfortunately, the margins on solar panels are low. After the previous
contract has been fulfilled, the company produced the
<span class="highlight">same number of panels</span> as before. In
addition, all three customers want to order the
<span class="highlight">same number of truckloads</span> with solar
panels again. The sales volume per truckload of panels is 11,000 Euros.
The complete production of a truckload of solar panels, including
materials, costs 6,300 Euros.

## New Objective

In the new contract, the company wants to
<span class="highlight">maximize its profits</span> while the demand
does not have to be fulfilled.

. . .

<span class="question">Question:</span> What changes are necessary?

. . .

- We need to change the objective function
- We need to change some parameters

. . .

<span class="question">Question:</span> Does our decision variable
change?

. . .

- No, we still transport truckloads of solar panels

## New Parameters

$$
\begin{aligned}
p &: \text{Sales volume per truckload of solar panels,} \\
c &: \text{Production costs per truckload of solar panels.}
\end{aligned}
$$

. . .

<span class="question">Question:</span> What is the profit per truckload
of solar panels?

. . .

$$
p - c
$$

## Former Model

$$
\begin{aligned}
\text{Minimize} \quad F &= \sum_{i \in \mathcal{I}} \sum_{j \in \mathcal{J}} c_{i,j} \times X_{i,j} \\
\text{subject to:} \quad
&\sum_{j \in \mathcal{J}} X_{i,j} \leq a_i \quad &&\forall i \in \mathcal{I} \\
&\sum_{i \in \mathcal{I}} X_{i,j} \geq b_j \quad &&\forall j \in \mathcal{J} \\
&X_{i,j} \geq 0 \quad &&\forall i \in \mathcal{I}, \forall j \in \mathcal{J}
\end{aligned}
$$

## New Model

$$
\begin{aligned}
\text{Maximize} \quad F &= \sum_{i \in \mathcal{I}} \sum_{j \in \mathcal{J}} (p-c-c_{i,j}) \times X_{i,j} \\
\text{subject to:} \quad
&\sum_{j \in \mathcal{J}} X_{i,j} \leq a_i \quad &&\forall i \in \mathcal{I} \\
&\sum_{i \in \mathcal{I}} X_{i,j} \leq b_j \quad &&\forall j \in \mathcal{J} \\
&X_{i,j} \geq 0 \quad &&\forall i \in \mathcal{I}, \forall j \in \mathcal{J}
\end{aligned}
$$

## 

<div class="r-fit-text">

Do you have

any questions?

</div>

# <span class="flow">Installing Julia</span>

## Download and Install Julia

![](https://images.beyondsimulations.com/ao/ao_julia-programming-language.png)

To prepare for the upcoming lectures, we start by installing the Julia
Programming Language and an Integrated Development Environment (IDE) to
work with Julia.

## Installating Julia

<img src="https://images.beyondsimulations.com/ao/ao_julia2.png"
data-max-width="400px" />

- Head to [julialang.org](https://julialang.org) and follow the
  instructions.

> [!TIP]
>
> If you are ever asked to add something to your “PATH”, do so!

## VS Code

<img src="https://images.beyondsimulations.com/ao/ao_codium_cnl.png"
data-max-width="400px" />

- Next, we are going to install VS Code
- Alternatively, you can install VS Codium
- It is essentially VS Code but without any tracking by MS

## Installing VS Code

- Head to the website
  [code.visualstudio.com](https://code.visualstudio.com)
- OR to the webside [vscodium.com](https://vscodium.com)
- Download and install the latest release

## Verify the Installation

- Start the IDE and take a look around
- Search for the field “Extensions” on the left sidebar
- Click it and search for “Julia”
- Download and install “Julia (Julia Language Support)”

## Create a new file

- Create a new file with a “.jl” ending
- Save it somewhere on your computer
- e.g., in a folder that you will use in the course

``` julia
print("Hello World!")
```

    Hello World!

- Run the file by clicking “run” in the upper right corner
- OR by pressing “Control+Enter” or “STRG+Enter”

## Everything working?

- If the terminal opens with a `Hello World!` → perfect!
- If not, it is likely that the IDE <span class="highlight">cannot find
  the path</span> to Julia
- Try to determine the path and save it to VS Code
- After saving it, try to run the file again

> [!TIP]
>
> Don’t worry if it is not running right away. We will fix this
> together!

# <span class="flow">Starting with Julia</span>

## How to get started?

- Learning a new programming language is a daunting task
- It is best to start with some small, interactive problems
- Then, slowly increase the scope of the tasks
- We will do this <span class="highlight">together in class</span>!

> [!NOTE]
>
> **And that’s it for todays lecture!**  
> We now have covered a first introduction and are ready to start
> solving some problems in the upcoming lectures.

## 

<div class="r-fit-text">

Questions?

</div>

# <span class="flow">Literature</span>

## Literature I

For more interesting literature to learn more about Julia, take a look
at the [literature list](../general/literature.qmd) of this course.

## Literature II

<div id="refs" class="references csl-bib-body hanging-indent"
entry-spacing="0">

<div id="ref-haase2016improving" class="csl-entry">

Haase, Knut, Habib Zain Al Abideen, Salim Al-Bosta, Mathias Kasper,
Matthes Koch, Sven Müller, and Dirk Helbing. 2016. “Improving Pilgrim
Safety During the Hajj: An Analytical and Operational Research
Approach.” *Interfaces* 46 (1): 74–90.

</div>

<div id="ref-mickein2022decision" class="csl-entry">

Mickein, Markus, Matthes Koch, and Knut Haase. 2022. “A Decision Support
System for Brewery Production Planning at Feldschlösschen.” *INFORMS
Journal on Applied Analytics* 52 (2): 158–72.

</div>

<div id="ref-vlcek_police_2024" class="csl-entry">

Vlćek, Tobias, Knut Haase, Malte Fliedner, and Tobias Cors. 2024.
“Police Service District Planning.” *OR Spectrum*, February.
<https://doi.org/10.1007/s00291-024-00745-3>.

</div>

<div id="ref-vlcek_controlling_2024" class="csl-entry">

Vlćek, Tobias, Knut Haase, Matthes Koch, Lena Dolz, Anneke Weygandt, and
Jan Pape. 2024. “Controlling Passenger Flows into Metro Systems to
Mitigate Overcrowding During Large-Scale Events.” *Submitted to
Transportation Science*.

</div>

<div id="ref-vlcek_optimizing_2024" class="csl-entry">

Vlćek, Tobias, and Guido Voigt. 2024. “Optimizing SKU-Warehouse
Allocations to Minimize Split Parcels in E-Commerce Environments.”
*Submitted to Decision Sciences*.

</div>

</div>
