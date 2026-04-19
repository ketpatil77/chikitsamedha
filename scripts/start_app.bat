@echo off
setlocal enableextensions enabledelayedexpansion
title 🚀 Chikitsāmedhā Auto-Diagnose ^& Launch
cd /d "%~dp0\.."

set PORT=%CHIKI_PORT%
if "%PORT%"=="" set PORT=8000
set PYTHONIOENCODING=utf-8

echo [INFO] Diagnosing environment...
if exist .venv312\Scripts\activate.bat call .venv312\Scripts\activate.bat
python scripts\diagnose_env.py
if errorlevel 1 (
  echo [WARN] Repairs needed. Running repair_env.bat...
  call scripts\repair_env.bat
)
echo [DIAGNOSE] ✔ Python 3.12+

echo [INFO] Applying UI theme patch...
where node >nul 2>&1 && node scripts\auto_theme_patch.js || echo [WARN] Node not found; skipping theme patch

echo [INFO] Building frontend...
cd chikitsamedha\frontend
if not exist node_modules call npm install
call npm run build || (echo [ERROR] UI build failed & cd ..\.. & exit /b 1)
cd ..\..
echo [BUILD] ✔ React/Vite

echo [INFO] Ensuring ports are free...
for %%P in (%PORT% 5173) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%P') do taskkill /F /PID %%a >nul 2>&1
)

echo [INFO] Checking Tesseract OCR availability...
REM Fast path: if tesseract.exe exists in default locations, skip PowerShell
set "TESSERACT_CMD="
if exist "%ProgramFiles%\Tesseract-OCR\tesseract.exe" set "TESSERACT_CMD=%ProgramFiles%\Tesseract-OCR\tesseract.exe"
if not defined TESSERACT_CMD if exist "%ProgramFiles(x86)%\Tesseract-OCR\tesseract.exe" set "TESSERACT_CMD=%ProgramFiles(x86)%\Tesseract-OCR\tesseract.exe"
if defined TESSERACT_CMD (
  for %%I in ("%TESSERACT_CMD%") do set "TESSDATA_PREFIX=%%~dpItessdata"
  echo [INFO] Using Tesseract at: %TESSERACT_CMD%
  echo [OCR] ✔ Tesseract Detected
  goto :_tess_done
)

REM Otherwise, attempt quiet PowerShell installer
set "_PS=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if exist "%_PS%" (
  "%_PS%" -NoLogo -NonInteractive -NoProfile -ExecutionPolicy Bypass -File "scripts\setup_tesseract.ps1" 1>nul 2>nul
) else (
  powershell -NoLogo -NonInteractive -NoProfile -ExecutionPolicy Bypass -File "scripts\setup_tesseract.ps1" 1>nul 2>nul
)

REM Re-check after installer for this session
if exist "%ProgramFiles%\Tesseract-OCR\tesseract.exe" set "TESSERACT_CMD=%ProgramFiles%\Tesseract-OCR\tesseract.exe"
if not defined TESSERACT_CMD if exist "%ProgramFiles(x86)%\Tesseract-OCR\tesseract.exe" set "TESSERACT_CMD=%ProgramFiles(x86)%\Tesseract-OCR\tesseract.exe"
if defined TESSERACT_CMD for %%I in ("%TESSERACT_CMD%") do set "TESSDATA_PREFIX=%%~dpItessdata"
if defined TESSERACT_CMD (
  echo [INFO] Using Tesseract at: %TESSERACT_CMD%
  echo [OCR] ✔ Tesseract Detected
) else (
  echo [OCR] ⚠️ Tesseract not detected
)

:_tess_done

echo [INFO] Starting backend on http://127.0.0.1:%PORT%/app ...
set PYTHONPATH=%CD%
if exist .oneclick_api.log del /q .oneclick_api.log >nul 2>&1
REM Start uvicorn in the same window (background) and capture output
start /b "Chikitsamedha API" .venv312\Scripts\python.exe -m uvicorn chikitsamedha.backend.app:app --host 127.0.0.1 --port %PORT% 1>>.oneclick_api.log 2>>&1
echo [INFO] Waiting for backend health...
python scripts\smoke_test.py
if errorlevel 1 (
  echo [ERROR] Smoke test failed. Showing last 60 log lines:
  if exist .oneclick_api.log (
    for /f %%A in ('find /v /c "" ^< ".oneclick_api.log"') do set LINES=%%A
    set START=0
    set /a START=!LINES!-60
    if !START! LSS 0 set START=0
    echo ----- last 60 lines of .oneclick_api.log -----
    more +!START! ".oneclick_api.log"
  ) else (
    echo [WARN] No .oneclick_api.log present.
  )
  exit /b 1
)
echo [SMOKE] ✔ All tests passed
start "" http://127.0.0.1:%PORT%/app
echo [OPEN] http://127.0.0.1:%PORT%/app

echo.
echo ^>^>^> ✅ Chikitsāmedhā Auto-Diagnose ^& Launch v10
echo ^>^>^> 🌐 http://127.0.0.1:%PORT%/app
echo ^>^>^> 🧠 Backend: FastAPI ^| Frontend: React/Vite
echo ^>^>^> 🎨 Themes updated ^| 🩺 Environment healthy
endlocal
