@echo off
echo.
echo ==========================================
echo   HIND PATH LAB - WEBSITE DEPLOYMENT
echo ==========================================
echo.
echo Creating deployment package...
echo.

REM Create deployment folder
if not exist "deployment" mkdir deployment

REM Copy all files except this script and deployment folder
robocopy . deployment /E /XD deployment .git node_modules /XF deploy.bat *.log DEPLOYMENT-GUIDE.md

echo.
echo Files copied to deployment folder!
echo.
echo Next steps:
echo 1. Go to the 'deployment' folder
echo 2. Select all files (Ctrl+A)
echo 3. Right-click and create a ZIP file
echo 4. Upload the ZIP to your hosting provider
echo.
echo ==========================================
echo   Ready for deployment!
echo ==========================================
echo.
pause
