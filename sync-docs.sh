#!/bin/bash
# Sync public/ → docs/ for GitHub Pages deployment
# Run this after making changes to public/

rsync -av --delete --exclude='CNAME' public/ docs/
echo "✓ docs/ synced from public/"
