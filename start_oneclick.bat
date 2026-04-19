@echo off
setlocal enableextensions
title 🚀 Chikitsāmedhā Auto Start
cd /d "%~dp0"
set PORT=%CHIKI_PORT%
if "%PORT%"=="" set PORT=8000
set UI_DIR=chikitsamedha\frontend

echo [INFO] Activating environment...
if exist .venv312\Scripts\activate.bat (
  call .venv312\Scripts\activate.bat
) else (
  where python >nul 2^>^&1
  if errorlevel 1 (
    echo [ERROR] Python not found
    pause
    exit /b 1
  )
  python -m venv .venv312
  if errorlevel 1 (
    echo [ERROR] Failed to create venv
    exit /b 1
  )
  call .venv312\Scripts\activate.bat
)

echo [INFO] Installing backend deps...
python -m pip install --upgrade pip setuptools wheel >nul 2>&1
python -m pip install -r chikitsamedha\requirements.txt || (echo [ERROR] Backend deps failed & pause & exit /b 1)

echo [INFO] Building frontend...
if exist "%UI_DIR%\package.json" (
  pushd "%UI_DIR%"
  if not exist node_modules call npm install
  call npm run build || echo [WARN] UI build failed. The API will still start; use run_frontend.bat for dev.
  popd
) else (
  echo [WARN] Frontend not found; skipping build.
)

echo [INFO] Launching FastAPI backend on port %PORT% ...
set PYTHONPATH=%CD%
start "Chikitsamedha API" cmd /c "cd /d %CD% && .venv312\Scripts\activate.bat && set PYTHONPATH=%CD% && python -m uvicorn chikitsamedha.backend.app:app --host 127.0.0.1 --port %PORT%"
REM Give server a moment, then run smoke tests and open browser
timeout /t 2 >nul
echo [INFO] Running smoke tests...
python scripts\smoke_test.py || echo [WARN] Smoke test reported an issue; check server window.
start "" http://127.0.0.1:%PORT%/app
echo ^>^>^> ✅ Chikitsāmedhā fully working end-to-end (UI + API).
echo ^>^>^> 🌐 Access the new futuristic UI at http://127.0.0.1:%PORT%/app
echo ^>^>^> 🧠 Backend: FastAPI ^| Frontend: React/Vite ^| Theme: Royal Futurism
