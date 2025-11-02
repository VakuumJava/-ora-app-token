#!/bin/bash

# Cleanup script for production code

# 1. Remove console.log (but keep console.error for errors)
find app lib components -name "*.ts" -o -name "*.tsx" | while read file; do
  sed -i '' 's/console\.log.*//g' "$file"
done

# 2. Remove .catch(console.error) patterns and replace with proper error handling
find app lib components -name "*.ts" -o -name "*.tsx" | while read file; do
  sed -i '' 's/\.catch(console\.error)/.catch(err => logger.error("Error", {}, err))/g' "$file"
done

# 3. Clean up empty lines created by deletions
find app lib components -name "*.ts" -o -name "*.tsx" | while read file; do
  sed -i '' '/^[[:space:]]*$/N;/^\n$/!P;D' "$file"
done

echo "✅ Cleanup complete"
