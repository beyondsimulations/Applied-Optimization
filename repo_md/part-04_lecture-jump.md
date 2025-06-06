# Lecture IV - Modelling with JuMP
Dr. Tobias Vlćek

# <span class="flow">Quick Recap from last Week</span>

## Functions

- Functions are reusable blocks of code
- Define functions using the `function` keyword
- Functions can take arguments and return values
- Use `return` to specify the output of a function

. . .

> [!TIP]
>
> You can create anonymous functions using the `->` syntax for quick,
> one-off operations.

## Packages

- Packages extend Julia’s functionality
- Use `using Pkg` to access package management
- Install packages with `Pkg.add("PackageName")`
- Import packages with `using PackageName` or `import PackageName`

## DataFrames

- DataFrames are used for working with tabular data
- Create DataFrames using the `DataFrame` constructor
- Access columns using dot notation or square brackets
- Perform operations on columns and rows

. . .

> [!TIP]
>
> Use `describe(df)` to get a quick summary of your DataFrame.

## Input/Output (IO)

- IO operations allow reading from and writing to files
- Reading and writing CSV files can be done with the `CSV` package
- Use `CSV.read()` to read a CSV file into a DataFrame
- Use `CSV.write()` to write a DataFrame to a CSV file

## Plots

- Plotting in Julia is done through packages like Plots.jl
- Create basic plots with functions like `plot()`, `scatter()`, `bar()`
- Customize plots with attributes like `title`, `xlabel`, `ylabel`

. . .

> [!TIP]
>
> Explore different plot types and in the long term even backends for
> various output formats and interactivity.

## Solutions from last Week

- The tutorials from last week will again be
  <span class="highlight">available on Friday</span>
- You can access them in the project folder on Github
- Click on the little cat icon on the bottom right

. . .

> [!TIP]
>
> <span class="highlight">You can ask questions anytime in class or via
> email!</span>

------------------------------------------------------------------------

# <span class="flow">Five Tutorials for this Week</span>

## Topics of the Tutorials

- **JuMP**: Learn how to use JuMP to define optimization problems
- **Variable Bounds**: Learn how to set variable bounds
- **Constrains**: Learn how to add constraints to your model
- **Advanced Modeling**: Learn how to model more complex problems
- **Transport Problem**: Learn how to solve a transportation problem

## Get started with the tutorials

- Download this weeks tutorials and start with the first one
- <span class="highlight">Remember, you can ask questions
  anytime!</span>

. . .

> [!NOTE]
>
> ### And that’s it for this lecture!
>
> The remaining time we will already start working on the problems of
> the fourth lecture. From next week, we will start with different
> optimizations problems and topics, that we address together in the
> course.

------------------------------------------------------------------------

# <span class="flow">Literature</span>

## Literature

- Lauwens, B., & Downey, A. B. (2019). Think Julia: How to think like a
  computer scientist (First edition). O’Reilly®. [Link to the free book
  website](https://benlauwens.github.io/ThinkJulia.jl/latest/book.html).

- [Julia Documentation](https://docs.julialang.org/)

For more interesting literature to learn more about Julia, take a look
at the [literature list](../general/literature.qmd) of this course.
