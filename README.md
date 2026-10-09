# Applied Optimization

This repository contains the lecture materials and tutorials for the course "Applied Optimization" currently taught at the University of Hamburg. The course focuses on practical optimization techniques using the Julia programming language.

## Course Overview

The course covers applied optimization methods with hands-on tutorials and real-world examples. Students learn to solve optimization problems using Julia and various optimization packages.

## Project Structure

### Content Directories

- **`lectures/`** - Course lecture materials
  - Lecture content in Quarto markdown (`.qmd`) files
  - Each renders to a reading page, a PDF and a slide deck (`*-presentation.html`) for classroom use
  - Supporting images and files

- **`tutorials/`** - Interactive tutorials and exercises
  - Step-by-step Julia tutorials in `.qmd` format
  - Hands-on exercises covering optimization concepts
  - Data files and supporting materials in `data/` and `images/`

- **`general/`** - General course information and resources

### Technical Directories

- **`helpers/`** - Post-processing automation scripts (see [Helper Functions](#helper-functions))
- **`_site/`** - Generated website output (created by Quarto)
- **`_freeze/`** - Quarto's computational cache

### Configuration Files

- **`_quarto.yml`** - Main Quarto configuration and build settings
- **`_brand.yml`** - Website branding and styling
- **`applied-optimization/`** - Julia environment (`Project.toml`, `Manifest.toml`) the tutorials run in
- **`pyproject.toml`** - Python dependencies for helper scripts (managed with uv)

## 🔧 Build Process

The project uses [Quarto](https://quarto.org/) as the main build system with automated post-processing:

1. **Render Phase**: Quarto processes `.qmd` files into HTML, creating the website in `_site/`
2. **Post-Render Phase**: Helper scripts automatically process the generated content

The build pipeline is configured in `_quarto.yml`:

```yaml
project:
  type: website
  post-render:
    - helpers/convert_pypercent.py
    - ../Lecture-Foundations/scripts/split_refs_post.py
    - ../Lecture-Foundations/scripts/create_pdf.py
```

## Helper Functions

The `helpers/` directory contains automation scripts that run after each build:

### `convert_pypercent.py`
**Purpose**: Converts Jupyter notebooks to Julia percent format

- **Input**: All `.ipynb` files in `_site/tutorials/`
- **Output**: Corresponding `.jl` files in percent format
- **Technology**: Uses Jupytext for format conversion
- **Usage**: Enables easy editing of tutorials in Julia-native format

**How it works**:
1. Finds all notebook files in the tutorials directory
2. Reads each notebook using Jupytext
3. Converts to Julia percent format (`.jl` files with `# %%` cell separators)
4. Saves the `.jl` file and deletes the notebook, so students only download the `.jl`

### Slide PDFs (shared scripts)

**Purpose**: Every render prints the revealjs decks it touched to PDF
(`?print-pdf` in headless chromium, with MathJax fonts inlined). The scripts
live in the shared standard repo, not in `helpers/`, and run as two post-render
hooks:

- `split_refs_post.py` spreads a deck's bibliography over slides of four entries
- `create_pdf.py` then writes `lecture-XX-presentation.pdf` next to the deck in
  `_site/lectures/`, linked on the lecture page as "Slides (PDF)". Photos larger
  than a slide needs are shrunk in the PDF only

- **Prerequisites**: the sibling checkout `../Lecture-Foundations`, `uv run playwright install chromium` once per machine, and rendering through `uv run`
- **A deck that cannot be printed fails the render on purpose**, as its page already links the PDF
- **One deck by hand**: after a full render, `uv run ../Lecture-Foundations/scripts/create_pdf.py _site/lectures/lecture-XX-presentation.html _site/lectures/lecture-XX-presentation.pdf`

## Getting Started

### Prerequisites

1. **Julia** 1.13 - For running computational content
2. **Python** - For helper scripts and Quarto
3. **Quarto** - For building the website

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/beyondsimulations/Applied-Optimization.git
   cd Applied-Optimization
   ```

2. Install Julia dependencies:
   ```bash
   julia --project=applied-optimization -e 'using Pkg; Pkg.instantiate()'
   ```

3. Install Python dependencies:
   ```bash
   uv sync
    ```

### Building the Site

To build the complete website with all post-processing:

```bash
uv run quarto render
```

This will:
- Render all `.qmd` files to HTML
- Execute the post-render helper scripts
- Generate PDFs and Julia files
- Create the complete website in `_site/`

To publish that build:

```bash
bash ../Lecture-Foundations/scripts/publish-gh-pages.sh
```

It publishes without rendering again and keeps the `gh-pages` branch at a single commit, so past builds of the site do not pile up in the repository. A bare `quarto publish` renders again outside `uv`, where the slide PDF hook cannot run.

### Development

For development with live preview:

```bash
uv run quarto preview
```

Note: Post-render scripts only run on full renders, not during preview mode.

## Content Creation

### Adding New Lectures

1. Create a new `.qmd` file in `lectures/` following the naming convention: `lecture-XX-topic.qmd`
2. For presentations, create a corresponding `lecture-XX-presentation.html` file
3. Add the `format-links` entry "Slides (PDF)" to the front matter, as in the other lectures
4. Run `uv run quarto render` to process and generate PDFs automatically

### Adding New Tutorials

1. Create tutorial files in `tutorials/` following the pattern: `tutorial-XX-YY-topic.qmd`
2. Include any data files in `tutorials/data/`
3. The build process will automatically generate Julia percent format versions

### Working with Julia Code

- All computational content is executed during rendering
- Julia environment is managed through `Project.toml`
- Code execution is cached by Quarto for faster subsequent builds

## Contributing

1. Fork the repository
2. Create content following the established naming conventions
3. Test your changes with `uv run quarto render`
4. Submit a pull request

## License

This project is licensed under the terms specified in the LICENSE file.

## Links

- **Course Website**: https://beyondsimulations.github.io/Applied-Optimization
- **Source Repository**: https://github.com/beyondsimulations/Applied-Optimization
- **Quarto Documentation**: https://quarto.org/
- **Julia Language**: https://julialang.org/
