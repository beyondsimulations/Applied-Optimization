---
title: Lecture II - First Steps in Julia
subtitle: Applied Optimization with Julia
author: Dr. Tobias Vlćek
format:
  revealjs:
    footer: ' {{< meta title >}} | {{< meta author >}} | [Home](lecture-02-firststeps.qmd)'
    output-file: lecture-02-presentation.html
---


# <span class="flow">Quick Recap on the Technical Setup</span>

## Goals for Today

After this lecture, you will have:

- A <span class="highlight">working Julia and VS Code setup</span> on your computer
- Made your first Git commit
- Learned how to submit assignments and earn bonus points
- Started with the first tutorials

## Download and Install Julia

<img src="https://images.beyondsimulations.com/ao/ao_julia-programming-language.png" data-fig-alt="The Julia programming language logo" />

To prepare for the upcoming lectures, we start by installing the Julia Programming Language and an Integrated Development Environment (IDE) to work with Julia.

## Installing Julia

<img src="https://images.beyondsimulations.com/ao/ao_julia2.png" data-fig-alt="Screenshot of the Julia download page" width="400" />

- Head to [julialang.org](https://julialang.org) and follow the instructions.

. . .

> **Tip**
>
> If you are ever asked to add something to your "PATH", do so!

## VS Code

<img src="https://images.beyondsimulations.com/ao/ao_codium_cnl.png" data-fig-alt="The VS Codium logo" width="400" />

- Next, we are going to install VS Code
- Alternatively, you can install VS Codium
- It is essentially VS Code but without any tracking by Microsoft

## Installing VS Code

- Head to the website [code.visualstudio.com](https://code.visualstudio.com)
- OR to the website [vscodium.com](https://vscodium.com)
- Download and install the latest release

## Verify the Installation

- Start the IDE and take a look around
- Search for the field "Extensions" on the left sidebar
- Click it and search for "Julia"
- Download and install "Julia (Julia Language Support)"

## Create a New File

- Create a new file with a ".jl" ending
- Save it somewhere on your computer
- e.g., in a folder that you will use in the course

``` julia
println("Hello World!")
```

    Hello World!

## Run the File

- Run the file by clicking "run" in the upper right corner
- OR by pressing `Ctrl+Enter` --- labelled `Strg` on German keyboards
- On macOS it is `Ctrl+Enter` or `Cmd+Enter`, depending on your keybindings[^1]

## Everything Working?

- If the terminal opens with a `Hello World!` → perfect!
- If not, it is likely that the IDE <span class="highlight">cannot find the path</span> to Julia
- Try to determine the path and save it to VS Code
- After saving it, try to run the file again

> **Tip**
>
> Don't worry if it is not running right away. We will fix this together!

# <span class="flow">Learning Julia</span>

## Julia as a Programming Language

- The following three lectures are dedicated to learning the basics
- Start with the very basics and gradually move on
- Focus in the first two lectures on the programming language
- Third lecture dedicated to <span class="highlight">Mathematical Optimization</span>

## A First Taste of Julia

<span class="question">Question:</span> **What will your savings be worth in 10 years?**

. . .

``` julia
savings = 1000       # Euros in your account
interest_rate = 0.03 # 3% interest per year
value = savings * (1 + interest_rate)^10
println("Value after 10 years: ", round(value; digits=2))
```

    Value after 10 years: 1343.92

. . .

- Don't worry if this looks new --- you will be able to <span class="highlight">read and write</span> code like this after the tutorials!

# <span class="flow">Working with VS Code and Julia</span>

## Notebooks in VS Code

- The easiest way to work on the tutorials is by using VS Code
- For detailed instructions, just open the [first tutorial](../tutorials/tutorial-02-01-variables.qmd)
- It explains step-by-step how to use `.jl` or `.ipynb` files as notebooks

. . .

> **Note**
>
> If you use `.jl` files, you can also put them under version control with Git, as you will see later in this lecture.

## Downloading the Notebooks

- You will find the tutorial notebooks next to the tutorial pages
- On each page, you will find a button `Julia` on the right
- Click it to download the `jl` file and save it
- If `.jl` files do not work for you, you can also click on `Jupyter`
- This will download an `.ipynb` file which you can use directly as notebook
- I'd really recommend storing the files <span class="highlight">in a separate directory for this course</span>

## Learning by Doing

- The best way to learn a programming language is <span class="highlight">by doing</span>
- We will therefore solve problems the coming weeks
- The goal is to get you familiar with the language
- You can discuss the problems with your fellow students
- You can hand in your solutions to receive bonus points!

# <span class="flow">Working with Git</span>

## What is Git?

- Git is a **version control system** that tracks changes in your code
- Can be used for collaboration and keeping track of your work
- Allows you to save "snapshots" of your project at different stages
- You can always go back to previous versions if something goes wrong
- No need to create files like `tutorial_v1.jl` and `tutorial_v2.jl`

## Installing Git

- Head to [git-scm.com](https://git-scm.com) and download Git
- Follow the installation instructions on the website for your OS

> **Tip**
>
> If you have any questions, feel free to ask!

## Git Extension in VS Code

- VS Code has **built-in Git support**!
- Look for the **"Source Control"** icon in the left sidebar (looks like a branch)
- For enhanced features, install the [GitGraph extension](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)

. . .

> **Tip**
>
> Git is not required for the course, but strongly recommended: once you get used to it, it becomes invaluable, especially if you are working with a lot of code!

## Initialize a Repository

- Open your project folder (of our lecture) in VS Code
- Click on "Source Control" in the left sidebar
- Click "Initialize Repository" button
- Your folder is now a Git repository!

. . .

> **Tip**
>
> You can also synchronize your repository with GitHub or other hosting services. Then, your code is saved in a remote location, making it accessible from anywhere and allowing collaboration with others.

## Making Your First Commit

- Make changes to your files (e.g., work on a tutorial `.jl` file)
- Go to Source Control panel
- You'll see your changes listed under "Changes"
- Click the "+" next to files to **stage** them
- Add a commit message describing your changes
- Click the checkmark ✓ to **commit**

## Viewing History

- Use the "Git Graph" extension for a visual representation
- Click the "Git Graph" button in the Source Control panel
- See your commit history as a branching diagram

. . .

> **Tip**
>
> Start using Git from day one! Even for small projects, it's a good habit to develop.

# <span class="flow">Assignments & Grading</span>

## Submission of Assignments

- You can work in groups of up to three people
- Submit the assignment via Moodle
- You will submit your assignment by uploading a notebook
- The assignment is due <span class="highlight">the day before the next tutorial</span>

. . .

> **Tip**
>
> Don't forget to save your notebook before uploading it to Moodle!

## Grading of Assignments

- Each assignment is worth 0.5 points
- You can get a maximum of 6.0 points from the assignments
- The points will be added to your exam points
- You need to pass the exam first, to receive any bonus points!

. . .

> **Note**
>
> The assignments are **not** mandatory, but highly recommended!

# <span class="flow">Five Tutorials for this Week</span>

## Topics of the Tutorials

- **Variables**: Learn how to assign values to variables
- **Vectors**: Learn how to create and manipulate vectors
- **Comparisons**: Learn how to compare values
- **Loops**: Learn how to use loops to repeat code
- **Dictionaries**: Learn how to store and look up key-value pairs

. . .

> **Note**
>
> Dictionaries will become important later: they are how we will store and look up the data of our optimization models.

## Get Started with the Tutorials

- Download the first notebook and open it
- Start with the <span class="highlight">first problem and solve it step by step</span>
- You can find the [tutorials](../tutorials/tutorial-02-01-variables.qmd) here on the website
- <span class="highlight">You can ask questions anytime!</span>

. . .

> **And that's it for this lecture!**
>
> The remaining time we will already start working on the first problems.

# <span class="flow">Literature</span>

## Literature

- Lauwens, B., & Downey, A. B. (2019). Think Julia: How to think like a computer scientist (First edition). O'Reilly®. [Link to the free book website](https://benlauwens.github.io/ThinkJulia.jl/latest/book.html).

- [Julia Documentation](https://docs.julialang.org/)

For more interesting literature to learn more about Julia, take a look at the [literature list](../general/literature.qmd) of this course.

[^1]: Strictly speaking, this executes the current line or cell. For longer files, use the command "Julia: Execute active File in REPL".
