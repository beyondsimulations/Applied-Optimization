import jupytext
from pathlib import Path

# Find all .ipynb files
for notebook_path in Path('.').rglob('*.ipynb'):
    # Read the notebook
    notebook = jupytext.read(notebook_path)

    # Define output path (same name, .py extension)
    output_path = notebook_path.with_suffix('.jl')

    # Write as percent format
    jupytext.write(notebook, output_path, fmt='py:percent')

    print(f"Converted: {notebook_path} -> {output_path}")
