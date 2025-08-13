#!/usr/bin/env python3
"""
Clean Julia Script Generator

This script takes a Jupytext-generated Julia percent format file and creates
a clean version without Jupyter metadata that works properly in VS Code and
other editors.

Usage:
    python clean_julia_script.py input_file.jl [output_file.jl]
"""

import sys
import re
from pathlib import Path


def clean_julia_script(input_file, output_file=None):
    """
    Clean a Julia percent format file by removing Jupyter metadata.

    Args:
        input_file: Path to the input .jl file
        output_file: Path to the output .jl file (optional)
    """
    input_path = Path(input_file)

    if output_file is None:
        # Create output filename by adding '_clean' before the extension
        output_path = input_path.with_name(f"{input_path.stem}_clean{input_path.suffix}")
    else:
        output_path = Path(output_file)

    print(f"Reading from: {input_path}")
    print(f"Writing to: {output_path}")

    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove the Jupyter metadata block at the beginning
        # This includes everything from the first # -*- line to the # --- line
        lines = content.split('\n')
        cleaned_lines = []
        skip_metadata = False

        for i, line in enumerate(lines):
            # Start skipping from the first metadata line
            if line.startswith('# -*- coding:') or line.startswith('# ---'):
                skip_metadata = True
                continue

            # Stop skipping after the metadata block ends
            if skip_metadata and line.strip() == '# ---':
                skip_metadata = False
                continue

            # Skip jupyter metadata lines
            if skip_metadata and (line.startswith('#   ') or line.startswith('# jupyter:')):
                continue

            # Don't skip regular lines
            if not skip_metadata:
                cleaned_lines.append(line)

        # Join the cleaned lines
        cleaned_content = '\n'.join(cleaned_lines)

        # Add a clean header
        header = '''# Julia Tutorial - Variables and Types
#
# This is a Julia script in percent format that can be run in:
# - VS Code with the Julia extension
# - Any text editor with cell-by-cell execution
# - Julia REPL by including the file
#
# To run in VS Code:
# 1. Install the Julia extension
# 2. Open this file
# 3. Use Ctrl+Enter (Cmd+Enter on Mac) to run cells
# 4. Or use the "Julia: Execute Code Cell" command

'''

        # Write the cleaned content
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(header + cleaned_content)

        print(f"✅ Successfully created clean Julia script: {output_path}")
        return str(output_path)

    except Exception as e:
        print(f"❌ Error processing file: {e}")
        return None


def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python clean_julia_script.py input_file.jl [output_file.jl]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    if not Path(input_file).exists():
        print(f"Error: Input file '{input_file}' does not exist.")
        sys.exit(1)

    result = clean_julia_script(input_file, output_file)

    if result:
        print("\nThe cleaned Julia script should now work properly in VS Code!")
        print("\nTo use it:")
        print("1. Open the file in VS Code")
        print("2. Make sure the Julia extension is installed")
        print("3. Use Ctrl+Enter (or Cmd+Enter on Mac) to run code cells")
        print("4. Or run the entire script with 'include(\"filename.jl\")' in Julia REPL")
    else:
        print("Failed to create clean Julia script.")
        sys.exit(1)


if __name__ == "__main__":
    main()
