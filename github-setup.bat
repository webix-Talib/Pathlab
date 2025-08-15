@echo off
echo.
echo ==========================================
echo   HIND PATH LAB - GITHUB PAGES SETUP
echo ==========================================
echo.
echo Preparing files for GitHub Pages deployment...
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git is not installed. You can still upload manually via GitHub web interface.
    echo.
    goto manual
)

echo Git detected! Initializing repository...
echo.

REM Initialize git repository
git init

REM Add all files
git add .

REM Initial commit
git commit -m "Initial commit: Hind Path Lab website"

echo.
echo ==========================================
echo   Repository initialized!
echo ==========================================
echo.
echo Next steps:
echo 1. Go to github.com and create new repository
echo 2. Name it: hindpathlab-website
echo 3. Copy the remote URL
echo 4. Run: git remote add origin YOUR_REPO_URL
echo 5. Run: git push -u origin main
echo.
goto end

:manual
echo ==========================================
echo   Manual Upload Instructions
echo ==========================================
echo.
echo 1. Go to github.com
echo 2. Sign up with altaf9373@gmail.com
echo 3. Create new repository: hindpathlab-website
echo 4. Upload all files from this folder
echo 5. Enable GitHub Pages in Settings
echo.

:end
echo ==========================================
echo   Ready for GitHub Pages!
echo ==========================================
echo.
pause
