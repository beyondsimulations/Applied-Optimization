# Lecture VIII - Police Districting
Dr. Tobias Vlćek

# <span class="flow">Introduction</span>

## <span class="invert-font">Police Service District Planning</span>

<div class="footer">

Vlćek et al. (2024)

</div>

## Challenges

<span class="question">Question:</span> **What makes the work of
emergency services complex?**

<div class="incremental">

- Dynamic urban development
- Changing population patterns
- Resource constraints
- Need for rapid response
- Multiple stakeholder interests

</div>

## Emergency Services

<div class="columns">

<div class="column" width="40%">

<img
src="https://images.unsplash.com/photo-1532555705039-f04fd833eb21?q=80&amp;w=3264&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
style="width:85.0%" />

</div>

<div class="column" width="55%">

Emergency services address the needs of <span class="highlight">three
interest groups</span>:

- Citizens
- Service personnel
- Administrators

<span class="question">Question:</span> **What could be the objectives
of these groups?**

</div>

</div>

## Stakeholder Objectives

<div class="columns">

<div class="column" width="50%">

1.  **Citizens**
    - Fast response times
    - Reliable service coverage
2.  **Service Personnel**
    - Manageable workloads
    - Safe working conditions

</div>

<div class="column" width="50%">

3.  **Administrators**
    - Cost efficiency
    - Resource optimization

> [!NOTE]
>
> Aligning the objectives of the three interest groups is challenging.

</div>

</div>

## Emergency Service Districting

<div class="columns">

<div class="column" width="40%">

<img
src="https://images.unsplash.com/photo-1689783101576-627f2fbdb8d5?q=80&amp;w=3687&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
style="width:85.0%" />

</div>

<div class="column" width="55%">

<span class="question">Question:</span> **Why might current district
layouts be suboptimal?**

<div class="incremental">

- Many layouts <span class="highlight">date back several decades</span>
- Often designed along highways and regions (Bruce 2009)
- Extensive data **not used** for data-driven improvement

</div>

</div>

</div>

## 

<div class="r-fit-text">

How can we improve

this situation?

</div>

<div class="footer">

</div>

## The Role of Data

<div class="block">

<span class="question">Question:</span> **What data can help improve
emergency services?**

<div class="incremental">

- Historical incident patterns
- Response time analysis
- Resource utilization metrics
- Population densities and traffic patterns

</div>

</div>

. . .

> [!NOTE]
>
> Extensive data collected, but often <span class="highlight">lack of
> tools or knowledge</span> to leverage it.

## Optimization

- <span class="highlight">Operations research (OR)</span> models can
  help!
- Based on **incident records** and **geographical information**
- Improve the **response of emergency services**
- Help administrators in making **strategic decisions**
- Locate <span class="highlight">new departments</span> or
  <span class="highlight">close departments</span> (Liberatore,
  Camacho-Collados, and Vitoriano 2020)

# <span class="flow">Case Studies</span>

## Police Districting

> For an efficient and effective distribution of resources, police
> jurisdictions are divided into precincts or command districts with
> separate departments. These are further divided into patrol beats
> (D’Amico et al. 2002).

## Service Priority Extremes

- **High Priority**
  - Life-threatening situations
  - Active crimes in progress
  - Multiple unit response needed
- **Low Priority**
  - Minor incidents
  - Administrative tasks

## Case Studies

- <span class="highlight">Different urban contexts</span>
- Study of jurisdictions in
  - Germany: Large metropolitan area
  - Belgium: Large rural area
- Focus on <span class="highlight">response time optimization</span>

. . .

> [!NOTE]
>
> Part of the force patrols the streets, another part is **stationed at
> the departments**.

## Dispatching

- Dispatchers assign all CFS to vehicles from the
  <span class="highlight">corresponding districts and patrol
  areas</span>
- Officers are **familiar with the area** and are thus better prepared
  to respond appropriately (Bodily 1978)
- To cope with high demands, dispatchers can **assign vehicles from
  nearby districts or beats**

## Potential Problem

<span class="question">Question:</span> **What could be the potential
problem?**

. . .

- This can lead to a <span class="highlight">domino effect</span>
- Transferring vehicles from other districts or beats **reduces coverage
  in those locations** (Mayer 2009)
- This makes them vulnerable to missing resources when **they need
  assistance themselves**

## Overloaded Systems

- This can lead to <span class="highlight">overloaded systems!</span>
- Long dispatching delays due to **staff shortages**
- Preventive patrol hardly possible (Miller and Knoppers 1972)
- Dispatchers **constantly** draw on patrol resources
- Reduces the **response time** of emergency services

. . .

> [!WARNING]
>
> This is a **common problem** in many emergency services.

## Response Time

<div class="columns">

<div class="column" width="35%">

<img
src="https://images.beyondsimulations.com/ao/ao_police-responsetime.svg"
style="width:55.0%" />

</div>

<div class="column" width="65%">

- Central criterion to measure the <span class="highlight">effectiveness
  of emergency services</span> is the response time
- Time between a **call for aid** and the arrival at the **incident
  location**
- Low response time increases the likelihood of helping and improves
  confidence (Bodily 1978)

</div>

</div>

## Response Time Influencers

<span class="question">Question:</span> **What affects response time?**

<div class="incremental">

- Initial contact
- Information gathering
- Unit assignment
- Resource coordination
- Route to location
- Traffic conditions

</div>

# <span class="flow">Territory Design Problem</span>

## Territory Design Problem

<div class="columns">

<div class="column" width="40%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_1.svg"
style="width:90.0%" />

</div>

<div class="column" width="55%">

> Aggregation of **small geographic areas**, called basic areas (BAs),
> into geographic clusters, called districts, so that these are
> acceptable according to **pre-defined planning criteria**[^1].

</div>

</div>

## Objective

<span class="question">Question:</span> **What could be the objective?**

. . .

- <span class="highlight">Minimize the response time</span> to help
  citizens faster while **increasing the confidence in the service**

. . .

<span class="question">Question:</span> **What could be further
objectives?**

. . .

- Reallocate **only part** of the police department’s
- Compact and contiguous territories to **improve patrol**
- Prevention of **isolated departments**

## Basic Structure

<div class="columns">

<div class="column" width="25%">

<img
src="https://images.beyondsimulations.com/ao/ao_police-hex_to_centroid.svg"
style="width:85.0%" />

</div>

<div class="column" width="75%">

<span class="question">Question:</span> **How can we structure this?**

<div class="incremental">

- Model as a **digraph** with vertices and edges
- Each BA centroid becomes a **vertex**
- $\mathcal{J}$ : set of BAs, indexed by $j$
- $\mathcal{I}$ : set of potential district centres
  $(\mathcal{I} \subseteq \mathcal{J})$

</div>

</div>

</div>

## Why Hexagons?

<div class="columns">

<div class="column" width="25%">

<img
src="https://images.beyondsimulations.com/ao/ao_police-vertex_connected.svg"
style="width:70.0%" />

</div>

<div class="column" width="75%">

<span class="question">Question:</span> **Advantages of hexagons?**

<div class="incremental">

- <span class="highlight">Equal distances</span> to all neighboring
  centroids
- Reduces sampling bias from edge effects (Wang and Kwan 2018)
- Special properties that help with the enforcement of **compactness**
- Better representation of urban geography

</div>

</div>

</div>

## Response Time Components

<div class="columns">

<div class="column" width="25%">

<img
src="https://images.beyondsimulations.com/ao/ao_police-responsetime.svg"
style="width:80.0%" />

</div>

<div class="column" width="75%">

<span class="question">Question:</span> **How can we model response
time?**

<div class="incremental">

- Call length is <span class="highlight">independent</span> of territory
- Dispatch time is **difficult to model**
- Driving time can be **minimized directly**

</div>

> [!WARNING]
>
> ### Conclusion
>
> We focus on **minimizing expected driving times** between departments
> and incident locations.

</div>

</div>

# <span class="flow">Model Formulation</span>

## 

<div class="r-fit-text">

Let’s build our model

step by step!

</div>

<div class="footer">

</div>

## Key Model Components

<span class="question">Question:</span> **What could be our key model
components?**

. . .

- Basic areas (BAs) and potential department locations
- Driving times between basic areas
- Forecasted incident data
- Assignment decisions

. . .

<span class="question">Question:</span> **Which are sets, parameters,
and variables?**

## Sets and Indices

<div class="incremental">

- $\mathcal{J}$ - Set of BAs, indexed by $j$
- $\mathcal{I}$ - Set of potential district centres
  ($\mathcal{I} \subseteq \mathcal{J}$), indexed by $i$

</div>

. . .

> [!NOTE]
>
> The depot locations are a <span class="highlight">subset</span> of the
> basic areas!

## Parameters

<span class="question">Question:</span> **What parameters do we need?**

<div class="incremental">

- $p$ - Number of district centres (departments)
- $t_{i,j}$ - Expected driving times between $i$ and $j$

</div>

. . .

> [!TIP]
>
> Parameters should be carefully calibrated with real-world data!

## Decision Variable(s)?

> [!NOTE]
>
> ### We have the following sets:
>
> - BAs, indexed by $j \in \mathcal{J}$
> - Potential department locations, indexed by $i \in \mathcal{I}$

. . .

> [!IMPORTANT]
>
> ### Our objective is to:
>
> <span class="highlight">Minimize the expected response time</span> of
> the emergency services by optimizing the assignment of BAs to
> departments.

. . .

<span class="question">Question:</span> **What decisions do we need to
model?**

## Decision variable/s

- $X_{i,j}$: 1 if BA $j$ assigned to department $i$, 0 otherwise

. . .

<span class="question">Question:</span> **What is the domain of our
decision variable?**

. . .

- $X_{i,j} \in \{0,1\} \quad \forall i \in \mathcal{I}, \forall j \in \mathcal{J}$

## 

<div class="r-fit-text">

Let’s build our

objective function!

</div>

<div class="footer">

</div>

## Objective Function?

> [!IMPORTANT]
>
> ### Our objective is to:
>
> <span class="highlight">Minimize the expected response time</span> of
> the emergency services by optimizing the assignment of BAs to
> departments.

. . .

<span class="question">Question:</span> **How do we minimize response
time?**

<div class="incremental">

- We want to minimize **total driving time**
- Consider frequency of incidents in each BA
- Don’t include fixed costs (handled by constraints)

</div>

## Objective Function

<span class="question">Question:</span> **What could be our objective
function?**

. . .

$$
\text{minimize} \quad \sum_{i \in \mathcal{I}}\sum_{j \in \mathcal{J}} t_{i,j} \times X_{i,j}
$$

. . .

> [!IMPORTANT]
>
> ### Expected Driving Time
>
> - Total driving time **across all assignments**
> - Weighted by **incident frequency**
> - Considers **all possible BA-department pairs**

# <span class="flow">Constraints</span>

## Key Constraints

<div class="columns">

<div class="column" width="40%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_2.svg"
style="width:90.0%" />

</div>

<div class="column" width="55%">

<span class="question">Question:</span> **Constraints needed?**

<div class="incremental">

1.  BA must have <span class="highlight">one</span> department
2.  Limit **number of departments**
3.  Only assign **active** departments
4.  Ensure **contiguous** districts
5.  Maintain district **compactness**

</div>

</div>

</div>

## Single Assignment Constraint?

<span class="question">Question:</span> **Why do we need this
constraint?**

. . .

- Each BA must be assigned to <span class="highlight">exactly one</span>
  department
- Prevents **overlapping** jurisdictions
- Ensures **complete coverage**

. . .

> [!NOTE]
>
> ### We need the following variables:
>
> - $X_{i,j}$ - 1 if BA $j$ assigned to department $i$, 0 otherwise

## Single Assignment Constraint?

<span class="question">Question:</span> **What could the constraint look
like?**

. . .

$$
\sum_{i \in \mathcal{I}} X_{i,j} = 1 \quad \forall j \in \mathcal{J}
$$

. . .

> [!NOTE]
>
> Each BA must be assigned to exactly one department.

## Department Count Constraint?

> [!IMPORTANT]
>
> ### The goal of these constraints is to:
>
> Ensure that exactly $p$ departments are opened.

. . .

> [!NOTE]
>
> ### We need the following sets and variables:
>
> - $\mathcal{I}$ - Set of potential department locations, indexed by
>   $i$
> - $\mathcal{J}$ - Set of BAs, indexed by $j$
> - $X_{i,j}$ - 1, if BA $j$ assigned to department $i$, 0 otherwise
> - $p$ - Number of departments

## Department Count Constraint

<span class="question">Question:</span> **What could the constraint look
like?**

. . .

$$
\sum_{i \in \mathcal{I}} X_{i,i} = p
$$

. . .

<span class="question">Question:</span> **What happens if we have more
departments than potential locations?**

. . .

- We **can’t open more departments** than there are locations
- The model **will be infeasible**

## Active Department Constraint?

> [!IMPORTANT]
>
> ### The goal of these constraints is to:
>
> Ensure that each BA is assigned to an active department, e.g. a
> department that is opened and that could dispatch vehicles.

. . .

> [!NOTE]
>
> ### We need the following sets and variables:
>
> - $X_{i,j}$ - 1, if BA $j$ assigned to department $i$, 0 otherwise

<span class="question">Question:</span> **How do we ensure assignments
only to active departments?**

## Active Department Constraint

$$
X_{i,j} \leq X_{i,i} \quad \forall i \in \mathcal{I}, \forall j \in \mathcal{J}
$$

. . .

> [!NOTE]
>
> This constraint creates a **logical connection between department
> locations and BA assignments** where BAs can only be assigned to
> <span class="highlight">opened</span> departments.

## p-Median Problem

# <span class="flow">Contiguity and Compactness</span>

## Contiguity Introduction

<div class="columns">

<div class="column" width="40%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_1.svg"
style="width:85.0%" />

</div>

<div class="column" width="55%">

<span class="question">Question:</span> **Why is contiguity important?**

<div class="incremental">

- Prevents **isolated areas**
- Ensures **contiguous patrol routes**
- Maintains **operational coherence**

</div>

</div>

</div>

## What is compactness?

<div class="columns">

<div class="column" width="33%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_1.svg"
style="width:100.0%" />

</div>

<div class="column" width="34%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_2.svg"
style="width:100.0%" />

</div>

<div class="column" width="33%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_3.svg"
style="width:100.0%" />

</div>

</div>

. . .

> [!NOTE]
>
> ### Compactness
>
> Compactness has **no univocal definition**; a district is commonly
> declared compact if it is ‘somehow round-shaped and undistorted’
> (Kalcsics, Nickel, and Schröder 2005).

## Contiguity and Compactness

<div class="columns">

<div class="column" width="40%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_2.svg"
style="width:100.0%" />

</div>

<div class="column" width="60%">

<span class="question">Question:</span> **Are our resulting districts
based on the model contiguous and compact?**

<div class="incremental">

- This depends on $t_{i,j}$
- **If Euclidean distance**
  - Districts will be contiguous
  - Likely of compact shape

</div>

</div>

</div>

## <span class="invert-font">Compactness p-Median</span>

<span class="invert-font fragment">**Question:** Is this likely for
police service districting?</span>

<div class="invert-font fragment">

- No, as we minimize the driving time within a city
- Highways, Tunnels, etc.
- Multiplied by the differing number of requested cars
- This can contribute to distorted district shapes

</div>

<div class="footer">

</div>

## Contiguity Sets

<span class="highlight">Additional Set and Parameter</span>

- $e_{i,j}$ - Euclidean distance between centroids
- $\mathcal{A}_j$ - Sets of BAs adjacent to BA $j$

. . .

$$
\mathcal{N}_{i,j}=\{v \in \mathcal{A}_j | e_{i,v} < e_{i,j}\} \quad \forall i\in \mathcal{I}, \forall j\in \mathcal{J}
$$

. . .

> [!NOTE]
>
> ### The idea
>
> BAs **closer to department** $i$ than BA $j$ on euclidian distance and
> **adjacent to** $j$!

## Example A

![](https://images.beyondsimulations.com/ao/ao_police-contigous-1.svg)

## Example A

![](https://images.beyondsimulations.com/ao/ao_police-contigous-2.svg)

## Example B

![](https://images.beyondsimulations.com/ao/ao_police-contigous-3.svg)

## Example B

![](https://images.beyondsimulations.com/ao/ao_police-contigous-4.svg)

## Enforcing Contiguity

**All districts have to be contiguous**

$$
X_{i,j} \leq \sum_{v \in \mathcal{N}_{i,j}} X_{i,v} \quad \forall i \in \mathcal{I}, \forall j \in \mathcal{J} \setminus \mathcal{A}_i: i \neq j
$$

. . .

> [!IMPORTANT]
>
> ### The idea
>
> At least **one department** has to be assigned to a BA that is
> adjacent to BA $j$ and closer to department $i$!

## Contiguity and Compactness

**All districts have to be contiguous and compact**

. . .

> [!IMPORTANT]
>
> ### The idea
>
> At least **one department** has to be assigned to **two BAs** that are
> adjacent to BA $j$ and closer to department $i$!

## Comparison

<div class="columns">

<div class="column" width="33%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_1.svg"
style="width:100.0%" alt="One department" />

</div>

<div class="column" width="34%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_2.svg"
style="width:100.0%" alt="Two departments" />

</div>

<div class="column" width="33%">

<img src="https://images.beyondsimulations.com/ao/ao_police-hex_3.svg"
style="width:100.0%" alt="Up to three departments" />

</div>

</div>

. . .

> [!NOTE]
>
> ### Why does this work?
>
> Due to the constraints, there is **always a path back** to the
> department if a BA is assigned to a department!

# <span class="flow">Model Characteristics</span>

## Characteristics

<span class="question">Questions:</span> **On model characteristics**

<div class="incremental">

- Is the model formulation linear/ non-linear?
- What kind of variable domains do we have?
- What do you think, can the model be solved quickly?
- Have we prevented isolated districts?

</div>

## Model Assumptions

<span class="question">Questions:</span> **On model assumptions**

<div class="incremental">

- What assumptions have we made?
- Use Euclidean distances to approximate driving time?
- Can we rely on incident data collected by the police?

</div>

# <span class="flow">Implementation and Impact</span>

## Overview of Studies

<div class="block">

<span class="question">Question:</span> **Where did we apply our
model?**

<div class="incremental">

- Two distinct environments:
  1.  Large metropolitan area (Germany)
  2.  Rural region (Belgium)
- Different challenges and requirements
- Focus on <span class="highlight">response time optimization</span>

</div>

</div>

## <span class="invert-font">German Metropolitan Case</span>

. . .

<div class="invert-font">

- 1.8 mio incidents (2015-2019)
- ~20 department locations
- 1,596 basic areas
- Dense urban environment

</div>

. . .

<div class="invert-font">

**Goal:** Redesign districts to improve response time.

</div>

<div class="footer">

</div>

## German Metropolitan Results

<img
src="https://images.beyondsimulations.com/ao/ao_police-g3c3_small.svg"
style="width:90.0%" />

## <span class="invert-font">Belgian Rural Case</span>

. . .

<div class="invert-font">

- 50,000 incidents (2019-2020)
- 2 existing + 1 planned location
- 1,233 basic areas
- Dispersed rural setting

</div>

. . .

<div class="invert-font">

**Goal:** Optimize coverage with limited resources.

</div>

<div class="footer">

</div>

## Belgian Rural Results

<img src="https://images.beyondsimulations.com/ao/ao_police-b2c3.svg"
style="width:90.0%" />

## <span class="invert-font">Simulation Framework</span>

<span class="invert-font"><span class="question">Question:</span> **How
did we validate the results?**</span>

. . .

<div class="invert-font">

- Spatial and temporal patterns
- Shift schedules
- Priority handling
- Rush hours
- Inter-district support
- Variable driving times

</div>

## Results

- Response time <span class="highlight">reduction up to 14.52%</span>
- Better **workload distribution**
- Improved **coverage equity**
- More efficient **resource utilization**

. . .

> [!IMPORTANT]
>
> All improvements are **without additional staff**!

## Conclusions

1.  Model **adaptability** crucial
2.  **Local** context matters
3.  <span class="highlight">Stakeholder buy-in</span> essential
4.  Data quality <span class="highlight">critical</span>

. . .

> [!TIP]
>
> Success requires balancing theoretical optimization with practical
> constraints!

## Future Applications

<span class="question">Question:</span> **Where else could this approach
be useful?**

<div class="incremental">

- Other emergency services
- Different urban contexts
- Resource allocation problems
- Service territory design

</div>

. . .

> [!NOTE]
>
> The methodology is adaptable to various public service optimization
> scenarios.

## Wrap Up

> [!NOTE]
>
> ### And that’s it for todays lecture!
>
> We now have covered districting problems and are ready to start
> solving some tasks in the upcoming tutorial.

## 

<div class="r-fit-text">

Questions?

</div>

<div class="footer">

</div>

# <span class="flow">Literature</span>

## Literature I

For more interesting literature to learn more about Julia, take a look
at the [literature list](../general/literature.qmd) of this course.

## Literature II

<div id="refs" class="references csl-bib-body hanging-indent"
entry-spacing="0">

<div id="ref-Bodily1978" class="csl-entry">

Bodily, Samuel E. 1978. “Police Sector Design Incorporating Preferences
of Interest Groups for Equality and Efficiency.” *Management Science* 24
(12): 1301–13. <https://doi.org/10.1287/mnsc.24.12.1301>.

</div>

<div id="ref-Bruce2009" class="csl-entry">

Bruce, Christopher. 2009. “[Districting and Resource Allocation: A
Question of Balance]().” *A Quarterly Bulletin of Applied Geography for
the Study of Crime & Public Safety* 1 (4): 1–3.

</div>

<div id="ref-DAmico2002" class="csl-entry">

D’Amico, Steven J., Shoou-Jiun Wang, Rajan Batta, and Christopher M.
Rump. 2002. “A Simulated Annealing Approach to Police District Design.”
*Computers & Operations Research* 29 (6): 667–84.
<https://doi.org/10.1016/s0305-0548(01)00056-9>.

</div>

<div id="ref-Kalcsics2005" class="csl-entry">

Kalcsics, Jörg, Stefan Nickel, and Michael Schröder. 2005. “Towards a
Unified Territorial Design Approach — Applications, Algorithms and GIS
Integration.” *Top* 13 (1): 1–56. <https://doi.org/10.1007/BF02578982>.

</div>

<div id="ref-Liberatore2020" class="csl-entry">

Liberatore, Federico, Miguel Camacho-Collados, and Begoña Vitoriano.
2020. “Police Districting Problem: Literature Review and Annotated
Bibliography.” In *International Series in Operations Research &
Management Science: Optimal Districting and Territory Design*, edited by
Roger Z. Ríos-Mercado, 9–29. Cham: Springer International Publishing.
<https://doi.org/10.1007/978-3-030-34312-5_2>.

</div>

<div id="ref-Mayer2009" class="csl-entry">

Mayer, Allison. 2009. “[Geospatial Technology Helps East Orange Crack
down on Crime]().” *A Quarterly Bulletin of Applied Geography for the
Study of Crime & Public Safety* 1 (4): 8–10.

</div>

<div id="ref-Miller1972" class="csl-entry">

Miller, Herbert F., and Bastiaan A. Knoppers. 1972. “[Computer
Simulation of Police Dispatching and Patrol Functions]().” In
*International Symposium on Criminal Justice Information and Statistics
Systems Proceedings*, edited by Gary Cooper, 167–79. National Institute
of Justice.

</div>

<div id="ref-vlcek_police_2024" class="csl-entry">

Vlćek, Tobias, Knut Haase, Malte Fliedner, and Tobias Cors. 2024.
“Police Service District Planning.” *OR Spectrum*, February.
<https://doi.org/10.1007/s00291-024-00745-3>.

</div>

<div id="ref-Wang2018a" class="csl-entry">

Wang, Jue, and Mei-Po Kwan. 2018. “Hexagon-Based Adaptive Crystal Growth
Voronoi Diagrams Based on Weighted Planes for Service Area
Delimitation.” *ISPRS International Journal of Geo-Information* 7: 257.
<https://doi.org/10.3390/ijgi7070257>.

</div>

<div id="ref-Zoltners1983" class="csl-entry">

Zoltners, Andris A., and Prabhakant Sinha. 1983. “Sales Territory
Alignment: A Review and Model.” *Management Science* 29 (11): 1237–56.
<https://doi.org/10.1287/mnsc.29.11.1237>.

</div>

</div>

[^1]: Zoltners and Sinha (1983)
