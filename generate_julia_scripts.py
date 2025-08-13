#!/usr/bin/env python3
"""
Script to automatically generate Julia percent format files from Quarto documents.

This script:
1. Finds all .qmd files with Julia engine
2. Renders them to .ipynb format using Quarto
3. Converts the notebooks to Julia percent format using Jupytext
4. Places the .jl files alongside the original .qmd files

Usage:
    python generate_julia_scripts.py [directory]

If no directory is specified, it processes the current directory recursively.
"""

import os
import subprocess
import sys
import glob
import re
from pathlib import Path


def find_julia_qmd_files(directory="."):
    """Find all .qmd files that use Julia engine."""
    julia_files = []

    # Find all .qmd files recursively
    qmd_pattern = os.path.join(directory, "**", "*.qmd")
    qmd_files = glob.glob(qmd_pattern, recursive=True)

    for qmd_file in qmd_files:
        try:
            with open(qmd_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if it's a Julia document by looking for 'engine: julia'
            if re.search(r'^engine:\s*julia\s*$', content, re.MULTILINE):
                julia_files.append(qmd_file)
                print(f"Found Julia document: {qmd_file}")

        except Exception as e:
            print(f"Warning: Could not read {qmd_file}: {e}")

    return julia_files


def render_to_notebook(qmd_file):
    """Render a .qmd file to .ipynb using Quarto."""
    print(f"Rendering {qmd_file} to notebook...")

    try:
        result = subprocess.run(
            ["quarto", "render", qmd_file, "--to", "ipynb"],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"Successfully rendered {qmd_file}")
        return True

    except subprocess.CalledProcessError as e:
        print(f"Error rendering {qmd_file}: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return False


def convert_to_julia_percent(ipynb_file, output_dir):
    """Convert .ipynb to Julia percent format using Jupytext."""
    print(f"Converting {ipynb_file} to Julia percent format...")

    try:
        # Run jupytext to convert to Julia percent format
        result = subprocess.run(
            ["pipenv", "run", "jupytext", "--to", "jl:percent", ipynb_file],
            capture_output=True,
            text=True,
            check=True
        )

        # The output file will be in the same directory as the input
        ipynb_path = Path(ipynb_file)
        jl_file = ipynb_path.with_suffix('.jl')

        # Move the .jl file to the desired output directory
        output_file = Path(output_dir) / jl_file.name

        if jl_file.exists():
            # Copy to output directory
            import shutil
            shutil.copy2(jl_file, output_file)
            print(f"Created Julia script: {output_file}")
            return str(output_file)
        else:
            print(f"Warning: Expected output file {jl_file} not found")
            return None

    except subprocess.CalledProcessError as e:
        print(f"Error converting {ipynb_file}: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return None


def find_generated_notebook(qmd_file):
    """Find the generated .ipynb file for a given .qmd file."""
    qmd_path = Path(qmd_file)

    # Check common locations where Quarto might place the output
    possible_locations = [
        # Same directory as .qmd
        qmd_path.with_suffix('.ipynb'),
        # In _site directory
        Path('_site') / qmd_path.with_suffix('.ipynb'),
        # In _site with relative path
        Path('_site') / qmd_path.relative_to('.').with_suffix('.ipynb') if qmd_path.is_absolute() else Path('_site') / qmd_path.with_suffix('.ipynb')
    ]

    for location in possible_locations:
        if location.exists():
            print(f"Found generated notebook: {location}")
            return str(location)

    print(f"Warning: Could not find generated notebook for {qmd_file}")
    print(f"Checked locations: {[str(loc) for loc in possible_locations]}")
    return None


def main():
    """Main function to process all Julia .qmd files."""
    # Get directory from command line argument or use current directory
    directory = sys.argv[1] if len(sys.argv) > 1 else "."

    print(f"Processing directory: {os.path.abspath(directory)}")

    # Find all Julia .qmd files
    julia_files = find_julia_qmd_files(directory)

    if not julia_files:
        print("No Julia .qmd files found.")
        return

    print(f"Found {len(julia_files)} Julia documents to process.")

    # Process each file
    success_count = 0
    for qmd_file in julia_files:
        print(f"\n--- Processing {qmd_file} ---")

        # Render to notebook
        if not render_to_notebook(qmd_file):
            continue

        # Find the generated notebook
        ipynb_file = find_generated_notebook(qmd_file)
        if not ipynb_file:
            continue

        # Convert to Julia percent format
        qmd_dir = os.path.dirname(qmd_file)
        jl_file = convert_to_julia_percent(ipynb_file, qmd_dir)

        if jl_file:
            success_count += 1
            print(f"✅ Successfully processed {qmd_file}")
        else:
            print(f"❌ Failed to process {qmd_file}")

    print(f"\n=== Summary ===")
    print(f"Processed {success_count}/{len(julia_files)} files successfully.")

    if success_count > 0:
        print("\nGenerated Julia percent format files can be used in:")
        print("- VS Code with Julia extension")
        print("- PyCharm with Julia plugin")
        print("- Any text editor for manual execution")
        print("- Direct inclusion in Julia projects")


if __name__ == "__main__":
    main()
