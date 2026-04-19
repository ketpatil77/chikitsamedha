@echo off
setlocal
set PORT=%CHIKI_PORT%
if "%PORT%"=="" set PORT=8000
"%~dp0..\.venv312\Scripts\python.exe" "%~dp0smoke_test.py"
if errorlevel 1 (
  echo [ERROR] Smoke test failed on port %PORT%.
  exit /b 1
)
endlocal
