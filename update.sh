#!/bin/bash
echo ""
echo "============================================"
echo "  AAIL Website Update"
echo "============================================"
echo ""

cd "$(dirname "$0")"

echo "[1/3] Staging changes..."
git add data/publications.bib data/members.js data/news.js data/projects.js data/gallery.js

echo "[2/3] Committing..."
if git diff --staged --quiet; then
    echo "  No changes detected. Nothing to commit."
    exit 0
fi
git commit -m "Update website content"

echo "[3/3] Pushing to GitHub..."
git push

echo ""
echo "============================================"
echo "  Done! Website will update in ~2 minutes."
echo "  Publications auto-convert on GitHub."
echo "============================================"
echo ""
