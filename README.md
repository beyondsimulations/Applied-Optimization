# Applied Optimization

This repository contains the lecture materials and tutorials for the course "Applied Optimization" currently taught at the University of Hamburg. The course focuses on practical optimization techniques using the Julia programming language.

## Course Overview

The course covers applied optimization methods with hands-on tutorials and real-world examples. Students learn to solve optimization problems using Julia and various optimization packages.

## 📁 Project Structure

### Content Directories

- **`lectures/`** - Course lecture materials
  - Lecture content in Quarto markdown (`.qmd`) files
  - Rendered HTML versions for web viewing
  - Presentation slides (`*-presentation.html`) for classroom use
  - Supporting images and files

- **`tutorials/`** - Interactive tutorials and exercises
  - Step-by-step Julia tutorials in `.qmd` format
  - Hands-on exercises covering optimization concepts
  - Data files and supporting materials in `data/` and `images/`

- **`general/`** - General course information and resources

### Technical Directories

- **`helpers/`** - Post-processing automation scripts (see [Helper Functions](#-helper-functions))
- **`_site/`** - Generated website output (created by Quarto)
- **`_repo-md/`** - Processed markdown files (created by helper scripts)
- **`_freeze/`** - Quarto's computational cache
- **`site_libs/`** - Website dependencies and libraries

### Configuration Files

- **`_quarto.yml`** - Main Quarto configuration and build settings
- **`_brand.yml`** - Website branding and styling
- **`Project.toml`** - Julia project dependencies
- **`Pipfile`** - Python dependencies for helper scripts
- **`jupytext.toml`** - Jupytext configuration for notebook conversion

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
    - helpers/convert_qmd_to_md.py
    - helpers/create_pdf.py
```

## 🛠 Helper Functions

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
4. Saves alongside original notebooks

### `convert_qmd_to_md.py`
**Purpose**: Extracts and organizes rendered markdown files

- **Input**: All `.md` files in `_site/`
- **Output**: Organized copy in `_repo-md/` maintaining directory structure
- **Usage**: Creates a clean markdown repository for version control or external processing

**How it works**:
1. Recursively finds all `.md` files in the rendered site
2. Recreates the directory structure in `_repo-md/`
3. Moves files while preserving relative paths
4. Provides organized markdown output separate from HTML site

### `convert-pdf.py`
**Purpose**: Converts PDF files to SVG format (manual use)

- **Input**: PDF files in specified directory
- **Output**: SVG files with naming convention
- **Technology**: Uses `pdf2svg` command-line tool
- **Usage**: Manual execution for converting diagrams or figures

## Getting Started

### Prerequisites

1. **Julia** - For running computational content
2. **Python** - For helper scripts and Quarto
3. **Quarto** - For building the website
4. **Node.js** - For Playwright browser automation

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/beyondsimulations/Applied-Optimization.git
   cd Applied-Optimization
   ```

2. Install Julia dependencies:
   ```bash
   julia --project=. -e 'using Pkg; Pkg.instantiate()'
   ```

3. Install Python dependencies:
   ```bash
   pip install pipenv
   pipenv install
   pipenv shell
   ```

4. Install Playwright browsers:
   ```bash
   playwright install chromium
   ```

### Building the Site

To build the complete website with all post-processing:

```bash
quarto render
```

This will:
- Render all `.qmd` files to HTML
- Execute the post-render helper scripts
- Generate PDFs, Julia files, and organized markdown
- Create the complete website in `_site/`

### Development

For development with live preview:

```bash
quarto preview
```

Note: Post-render scripts only run on full renders, not during preview mode.

## 📚 Content Creation

### Adding New Lectures

1. Create a new `.qmd` file in `lectures/` following the naming convention: `lecture-XX-topic.qmd`
2. For presentations, create a corresponding `lecture-XX-presentation.html` file
3. Run `quarto render` to process and generate PDFs automatically

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
3. Test your changes with `quarto render`
4. Submit a pull request

## License

This project is licensed under the terms specified in the LICENSE file.

## 🔗 Links

- **Course Website**: https://beyondsimulations.github.io/Applied-Optimization
- **Source Repository**: https://github.com/beyondsimulations/Applied-Optimization
- **Quarto Documentation**: https://quarto.org/
- **Julia Language**: https://julialang.org/
