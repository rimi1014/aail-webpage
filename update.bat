@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   AAIL Website Update
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] Staging changes...
git add data/publications.bib data/members.js data/news.js data/projects.js data/gallery.js

echo [2/3] Committing...
git diff --staged --quiet
if %errorlevel%==0 (
    echo   No changes detected. Nothing to commit.
    goto done
)
git commit -m "Update website content"

echo [3/3] Pushing to GitHub...
git push

echo.
echo ============================================
echo   Done! Website will update in ~2 minutes.
echo   Publications auto-convert on GitHub.
echo ============================================

:done
echo.
pause
