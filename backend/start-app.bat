@echo off
echo Starting Eco Report Center...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo Starting ML Service...
start "ML Service" cmd /k "cd ml_service && python anomaly_api.py"

echo.
echo All services are starting...
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:5000
echo ML Service will be available at: http://localhost:5001
echo.
echo Press any key to exit this window...
pause > nul
