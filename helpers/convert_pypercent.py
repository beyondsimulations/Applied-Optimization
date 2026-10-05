import jupytext
from pathlib import Path

# Convert every rendered notebook to a .jl percent file, then remove the
# notebook: .ipynb is only the conversion input, students download the .jl.
for notebook_path in Path('_site/tutorials').rglob('*.ipynb'):
    # Read the notebook
    notebook = jupytext.read(notebook_path)

    # Define output path (same name, .jl extension)
    output_path = notebook_path.with_suffix('.jl')

    # Write as percent format
    jupytext.write(notebook, output_path, fmt='py:percent')
    notebook_path.unlink()

    print(f"Converted: {notebook_path} -> {output_path} (notebook removed)")
