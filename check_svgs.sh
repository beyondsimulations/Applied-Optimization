#!/bin/bash
echo "🔍 Scanning SVG files for XML parse errors..."

errors=0
while IFS= read -r -d '' file; do
    # Validate using xmllint
    xmllint --noout "$file" 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "❌ Invalid SVG: $file"
        errors=$((errors+1))
    fi
done < <(find . -type f -name "*.svg" -print0)

if [ $errors -eq 0 ]; then
    echo "All SVG files look good!"
else
    echo "Found $errors problematic SVG file(s)"
    echo "Tip: You can try fixing them with the fix script."
fi
