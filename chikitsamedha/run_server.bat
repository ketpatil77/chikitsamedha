@echo off
setlocal
REM Ensure CWD is repo root so 'chikitsamedha' package is importable
cd /d "%~dp0\.."
set PORT=%CHIKI_PORT%
if "%PORT%"=="" set PORT=%1
if "%PORT%"=="" set PORT=8000
if exist .venv312\Scripts\activate.bat call .venv312\Scripts\activate.bat
set PYTHONPATH=%CD%
python -m pip show fastapi >nul 2>&1 || python -m pip install -r chikitsamedha\requirements.txt
python -m uvicorn chikitsamedha.backend.app:app --host 127.0.0.1 --port %PORT%
endlocal
