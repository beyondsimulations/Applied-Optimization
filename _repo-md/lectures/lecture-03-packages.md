---
title: Lecture III - Packages and Data Management
subtitle: Applied Optimization with Julia
author: Dr. Tobias Vlćek
format:
  revealjs:
    footer: ' {{< meta title >}} | {{< meta author >}} | [Home](lecture-03-packages.qmd)'
    output-file: lecture-03-presentation.html
---


<script src="https://cdn.jsdelivr.net/npm/requirejs@2.3.6/require.min.js" integrity="sha384-c9c+LnTbwQ3aujuU7ULEPVvgLs+Fn6fJUvIGTsuu1ZcCf11fiEubah0ttpca4ntM sha384-6V1/AdqZRWk1KAlWbKBlGhN7VG4iE/yAZcO6NZPMF8od0vukrvr0tg4qY6NSrItx" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js" integrity="sha384-ZvpUoO/+PpLXR1lu4jmpXWu80pZlYUAfxl5NsBMWOEPSjUn/6Z/hRTt8+pR6L4N2" crossorigin="anonymous" data-relocate-top="true"></script>
<script type="application/javascript">define('jquery', [],function() {return window.jQuery;})</script>


# <span class="flow">Quick Recap from last Week</span>

## Goals for Today

After this lecture, you will:

- Have <span class="highlight">refreshed the basics</span> from last week's tutorials
- Know what packages are and why we use them
- Have seen your first DataFrame
- Be ready to start this week's tutorials

## Variables and Data Types

- Variables are used to store values
- Assign a value to a variable using the `=` operator
- You can use <span class="highlight">different data types</span> for variables
- You can change the value of a variable

. . .

> **Tip**
>
> You can use the `typeof` function to check the type of a variable.

## Vectors and Matrices

- Vectors and matrices are used to store multiple values
- You can create them using the `[` and `]` operators
- Access their elements using square brackets

. . .

> **Tip**
>
> You can use the `push!` function to add elements to a vector or the `pop!` function to remove elements from a vector.

## Comparisons and Logic

- Comparisons are <span class="highlight">used to compare values</span>
- `==` checks if two values are equal
- `!=` checks if two values are not equal
- `<` and `>` check if one value is smaller or greater than the other
- `<=` and `>=` also allow the two values to be equal
- `&&` is true if <span class="highlight">both</span> conditions are true
- `||` is true if <span class="highlight">at least one</span> of two conditions is true

## Loops

- Loops are used to repeat code
- `for` loop repeats code for a fixed number of times
- `while` loop repeats code as long as a condition is true

. . .

``` julia
for product in ["apple", "banana", "cherry"]
    println("We sell: $product")
end
```

    We sell: apple
    We sell: banana
    We sell: cherry

## Conditionals

- Conditionals run code <span class="highlight">only under certain conditions</span>
- `if` executes code if a condition is true
- `elseif` checks a further condition if the previous one was false
- `else` executes code if none of the conditions were true

. . .

> **Note**
>
> Conditionals are not loops: they decide **whether** code runs, while loops decide **how often** it runs.

## Dictionaries

- Dictionaries store <span class="highlight">key-value pairs</span>, like a lookup table
- Access a value by its key using square brackets
- `keys` and `values` return all keys and values

. . .

``` julia
student_ids = Dict("Elio" => 1001, "Bob" => 1002)
println("Elio's ID: ", student_ids["Elio"])
```

    Elio's ID: 1001

. . .

> **Tip**
>
> Later in the course, we will use dictionaries to store and look up the data of our optimization models.

## Solutions from last Week

- The solutions to the tutorials are made <span class="highlight">available at the end of each week</span>
- You can access them in the project folder on GitHub
- Click on the GitHub icon (the Octocat) at the bottom right of the page

. . .

> **Tip**
>
> You can ask questions anytime in class or via email!

# <span class="flow">Packages and Data Management</span>

## Why Packages?

<span class="question">Question:</span> **Do we have to write all code ourselves?**

. . .

- Luckily not! We can use <span class="highlight">packages</span> written by others
- Packages are collections of reusable code, e.g. `DataFrames.jl` for tables or `Plots.jl` for charts
- Julia's package manager `Pkg` installs them for us:

. . .

``` julia
using Pkg
Pkg.add("DataFrames")
```

## Data Management with DataFrames

- `DataFrames.jl` stores tabular data, like a <span class="highlight">spreadsheet in code</span>

``` julia
using DataFrames
sales = DataFrame(
    product = ["apple", "banana", "cherry"],
    price = [0.50, 0.30, 2.00],
    sold = [120, 90, 30]
)
```

<div><div style = "float: left;"><span>3×3 DataFrame</span></div><div style = "clear: both;"></div></div><div class = "data-frame" style = "overflow-x: scroll;">

| Row | product |   price |  sold |
|----:|:--------|--------:|------:|
|     | String  | Float64 | Int64 |
|   1 | apple   |     0.5 |   120 |
|   2 | banana  |     0.3 |    90 |
|   3 | cherry  |     2.0 |    30 |

</div>

. . .

- This week's tutorials show how to read, write, and plot such data

# <span class="flow">Five Tutorials for this Week</span>

## Topics of the Tutorials

- **Functions**: Learn how to define and use functions
- **Packages**: Learn how to install and use packages
- **DataFrames**: Learn how to work with tabular data in Julia
- **IO**: Learn how to read and write data in Julia
- **Plots**: Learn how to create plots in Julia

## Get Started with the Tutorials

- Download this week's tutorials and start with the first one
- <span class="highlight">Remember, you can ask questions anytime!</span>

. . .

> **And that's it for this lecture!**
>
> The remaining time we will already start working on this week's tutorials.

# <span class="flow">Literature</span>

## Literature

- Lauwens, B., & Downey, A. B. (2019). Think Julia: How to think like a computer scientist (First edition). O'Reilly®. [Link to the free book website](https://benlauwens.github.io/ThinkJulia.jl/latest/book.html).

- [Julia Documentation](https://docs.julialang.org/)

For more interesting literature to learn more about Julia, take a look at the [literature list](../general/literature.qmd) of this course.
