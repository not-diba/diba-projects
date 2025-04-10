import os
import re
import shutil
import subprocess

# Set the base directory containing the SVG files
base_directory = '/Users/diba/Documents/diba/kimu_svgs/icons'

# Regex pattern to match fill="#09244B"
pattern = re.compile(r'fill="#09244B"')

# Walk through all subdirectories to find SVG files
for root, _, files in os.walk(base_directory):
    for filename in files:
        if filename.lower().endswith('.svg'):
            file_path = os.path.join(root, filename)
            
            print(f"🔍 Processing: {file_path}")

            # Run picosvg command with pipx
            result = subprocess.run(['pipx', 'run', 'picosvg', file_path], capture_output=True, text=True)
            
            if result.returncode == 0 and result.stdout:
                svg_content = result.stdout
                
                # Remove the fill attribute
                new_content = pattern.sub("", svg_content)
                
                # Save the modified SVG in the base directory
                new_file_path = os.path.join(base_directory, filename)
                with open(new_file_path, 'w', encoding='utf-8') as svg_file:
                    svg_file.write(new_content)

                print(f'✅ Converted, cleaned, and moved: {filename}')
                
                # Delete the original file after moving
                os.remove(file_path)

            else:
                print(f'❌ Failed to process: {filename}, Error: {result.stderr}')

# Optional: Clean up empty directories after moving files
for root, dirs, files in os.walk(base_directory, topdown=False):
    for d in dirs:
        dir_path = os.path.join(root, d)
        if not os.listdir(dir_path):  # Check if directory is empty
            os.rmdir(dir_path)
            print(f"🗑️ Removed empty folder: {dir_path}")

print("🎉 Processing complete!")
