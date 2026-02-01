@echo off
title Smart Factory Control Tower

echo =====================================
echo SMART FACTORY CONTROL TOWER - STARTUP
echo =====================================

echo Starting backend...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

echo Waiting backend startup...
timeout /t 6

echo Starting factory simulator...
start cmd /k "cd simulator && python auto_factory_simulator.py"

echo.
echo System started.
echo Open index.html to view dashboard.
pause
