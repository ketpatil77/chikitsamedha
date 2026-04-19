$ErrorActionPreference = 'Stop'
$port = if ($env:CHIKI_PORT) { $env:CHIKI_PORT } else { 8000 }
$py = Join-Path $PSScriptRoot '..\.venv312\Scripts\python.exe'
& $py (Join-Path $PSScriptRoot 'smoke_test.py')
if ($LASTEXITCODE -ne 0) { throw "Smoke test failed on port $port" }
