#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
: "${PORT:=8000}"
python -m pip show fastapi >/dev/null 2>&1 || pip install -r requirements.txt
python -m uvicorn chikitsamedha.backend.app:app --host 127.0.0.1 --port "$PORT"
