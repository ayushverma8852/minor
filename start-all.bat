@echo off
title InterviewPrep AI - Full Stack Launcher
echo ==========================================================
echo   Starting InterviewPrep AI Full-Stack Platform
echo ==========================================================
echo.

echo Cleaning up any previous processes on ports 8080, 8000, 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
timeout /t 1 >nul
echo Ports verified and ready.
echo.

echo [1/3] Launching Python FastAPI AI Microservice (Port 8000)...
start "InterviewPrep AI - AI Microservice (8000)" cmd /k "cd /d "%~dp0ai-service" && .\venv\Scripts\activate && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Launching Spring Boot Backend (Port 8080)...
start "InterviewPrep AI - Java Backend (8080)" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=dev""

echo [3/3] Launching React Frontend (Port 5173)...
start "InterviewPrep AI - React Frontend (5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==========================================================
echo   All 3 services are launching in their own windows!
echo   - Frontend:        http://localhost:5173
echo   - Backend API:     http://localhost:8080/api/health
echo   - AI Microservice: http://localhost:8000/docs
echo ==========================================================
echo.
echo Waiting 5 seconds and opening your default browser...
timeout /t 5 >nul
start http://localhost:5173
