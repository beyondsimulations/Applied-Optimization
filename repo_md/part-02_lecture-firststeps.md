# Lecture II - First Steps in Julia
Dr. Tobias Vlćek

# <span class="flow">Quick Recap on the Technical Setup</span>

## Download and Install Julia

![](https://images.beyondsimulations.com/ao/ao_julia-programming-language.png)

To prepare for the upcoming lectures, we start by installing the Julia
Programming Language and an Integrated Development Environment (IDE) to
work with Julia.

## Installing Julia

<img src="https://images.beyondsimulations.com/ao/ao_julia2.png"
data-max-width="400px" />

- Head to [julialang.org](https://julialang.org) and follow the
  instructions.

. . .

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

------------------------------------------------------------------------

# <span class="flow">Learning Julia</span>

## Julia as a Programming Language

- Following three lectures are dedicated to learning the basics
- Start with the very basics and gradually move on
- Focus in the first two lectures on the programming language
- Third lecture dedicated to <span class="highlight">Mathematical
  Optimization</span>

# <span class="flow">Working with VS Code</span>

## Notebooks in VS Code

- The easiest way is by using VS Code
- Install the Jupyter Extension
- Now, you can open `.ipynb` files
- Here you can run the code in the cells

## Downloading the Notebooks

- You will find the tutorial notebooks next to the tutorial pages
- On each page, you will find a button `Jupyter` on the right
- Click it to download the notebook and save it
- I’d recommend storing the notebooks <span class="highlight">in a
  separate directory for this course</span>

## Learning by doing

- The best way to learn a programming language is
  <span class="highlight">by doing</span>
- We will therefore solve problems the coming weeks
- The goal is to get you familiar with the language
- You can discuss the problems with your fellow students
- You can hand in your solutions to receive bonus points!

------------------------------------------------------------------------

# <span class="flow">Working with IJulia</span>

## IJulia

- IJulia is an interface between Julia and Jupyter Notebooks
- Popular tool for data analysis and visualization
- You can use IJulia to run <span class="highlight">Julia code in the
  notebooks</span>

. . .

> [!TIP]
>
> You can also copy and paste code from the notebooks into your IDE!

## Installing IJulia

- Open the VS Code IDE and start a terminal
- Start Julia by typing `julia` in the terminal
- Install IJulia by typing `]` to open the package manager
- Install IJulia by typing `add IJulia`
- Press `Enter`

## Running IJulia

``` julia
using IJulia; notebook()
```

- Start IJulia by typing the above code in the Julia prompt
- This will open a new browser window
- You can now run code in the notebooks

. . .

> [!TIP]
>
> You can also run the notebooks in VS Code, if you prefer!

------------------------------------------------------------------------

# <span class="flow">Submission of Assignments</span>

## Submission of Assignments

- You can work in groups of up to three people
- Submit the assignment via OpenOlat
- You will submit your assignment by uploading a notebook
- The assignment is due <span class="highlight">the day before the next
  tutorial</span>

. . .

> [!TIP]
>
> Don’t forget to save your notebook before uploading it to OpenOlat!

## Grading of Assignments

- Each assignment is worth 0.5 points
- You can get a maximum of 6.0 points from the assignments
- The points will be added to your exam points
- You need to pass the exam first, to receive any bonus points!

. . .

> [!NOTE]
>
> The assignments are **not** mandatory, but highly recommended!

------------------------------------------------------------------------

# <span class="flow">Five Tutorials for this Week</span>

## Topics of the Tutorials

- **Variables**: Learn how to assign values to variables
- **Vectors**: Learn how to create and manipulate vectors
- **Comparisons**: Learn how to compare values
- **Loops**: Learn how to use loops to repeat code
- **Scope**: Learn about the scope of variables

## Get started with the tutorials

- Download the first notebook and open it
- Start with the <span class="highlight">first problem and solve it step
  by step</span>
- You can find the tutorials here on the website
- <span class="highlight">You can ask questions anytime!</span>

. . .

> [!NOTE]
>
> ### And that’s it for this lecture!
>
> The remaining time we will already start working on the first
> problems.

------------------------------------------------------------------------

# <span class="flow">Literature</span>

## Literature

- Lauwens, B., & Downey, A. B. (2019). Think Julia: How to think like a
  computer scientist (First edition). O’Reilly®. [Link to the free book
  website](https://benlauwens.github.io/ThinkJulia.jl/latest/book.html).

- [Julia Documentation](https://docs.julialang.org/)

For more interesting literature to learn more about Julia, take a look
at the [literature list](../general/literature.qmd) of this course.
