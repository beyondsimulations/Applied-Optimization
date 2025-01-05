import os
import subprocess

def convert_all_pdfs_to_svgs(input_folder, output_folder):
    # Ensure the output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Iterate over all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith('.pdf'):
            input_pdf_path = os.path.join(input_folder, filename)
            output_svg_path = os.path.join(output_folder, f"ao_arena-{os.path.splitext(filename)[0]}.svg")

            # Call pdf2svg for each PDF file with the -p option to preserve page size
            subprocess.run(['pdf2svg', input_pdf_path, output_svg_path, '1'])

# Example usage
input_folder = '/Users/tvlcek/Desktop/img'
output_folder = '/Users/tvlcek/Desktop/img'
convert_all_pdfs_to_svgs(input_folder, output_folder)
