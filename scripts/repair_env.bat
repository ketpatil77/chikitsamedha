@echo off
setlocal
cd /d "%~dp0\.."
if exist .venv312\Scripts\activate.bat call .venv312\Scripts\activate.bat
echo [INFO] Upgrading pip/setuptools/wheel...
python -m pip install --upgrade pip setuptools wheel
echo [INFO] Installing backend dependencies...
python -m pip install -r chikitsamedha\requirements.txt
echo [INFO] Installing frontend dependencies...
cd chikitsamedha\frontend
call npm install
call npm audit fix --force
cd ..\..
endlocal
