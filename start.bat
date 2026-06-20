@echo off
title ATM Doc Verify — Full Stack
echo.
echo  ==========================================
echo   Document Verification — Full Stack Start
echo  ==========================================
echo.
echo  [1/2] Starting FastAPI backend on :8001 ...
start "Backend (FastAPI :8001)" cmd /k "cd /d %~dp0doc_verify && python run.py"

echo  [2/2] Starting Vite frontend on :5173 ...
start "Frontend (Vite :5173)" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo  Both servers are starting in separate windows.
echo  Frontend → http://localhost:5173
echo  Backend  → http://localhost:8001
echo  API Docs → http://localhost:8001/docs
echo.
pause
