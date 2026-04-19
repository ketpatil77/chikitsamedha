@echo off
setlocal
cd /d "%~dp0\chikitsamedha\frontend"
if not exist package.json (
  echo [ERROR] frontend folder not found.
  exit /b 1
)
where node >nul 2>&1 || (
  echo [ERROR] Node.js is required. Install Node 18+ from https://nodejs.org and retry.
  exit /b 1
)
echo [INFO] Installing UI dependencies...
call npm install
echo [INFO] Starting Vite dev server on http://127.0.0.1:5173
start "Chikitsamedha UI" cmd /c "npm run dev"
start "" http://127.0.0.1:5173
endlocal
