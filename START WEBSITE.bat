@echo off
title SmartRoooms - Live Website
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  ERROR: Node.js is not installed.
  echo  Download from https://nodejs.org and run again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies — first time only, please wait...
  call npm install
  call npm run install:all
)

echo Stopping any old servers on ports 5000 and 5173...
node scripts\free-ports.js >nul 2>nul

echo.
echo  ==========================================
echo    SmartRoooms - Opening in your browser
echo    URL: http://localhost:5173
echo  ==========================================
echo.
echo  Keep this window open while using the site.
echo  Close this window to stop the website.
echo.

npm run dev

pause
