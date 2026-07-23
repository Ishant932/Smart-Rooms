@echo off
title SmartRoooms - Production
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js required: https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\" call npm install
if not exist "frontend\node_modules\" call npm run install:all

echo Building and starting SmartRoooms on http://localhost:5000 ...
echo.

start "" cmd /c "timeout /t 8 /nobreak >nul && node scripts/open-browser.js http://localhost:5000"

call npm run start

pause
