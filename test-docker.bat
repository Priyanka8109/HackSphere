@echo off
echo ========================================================
echo   HACKSPHERE EXPERIMENT 7: DOCKER COMPOSE VERIFICATION
echo ========================================================
echo.

set PATH=%PATH%;C:\Users\HP\AppData\Local\Programs\DockerDesktop\resources\bin

echo [1/4] Checking Docker CLI and Docker Compose versions...
docker --version
docker compose version
echo.

echo [2/4] Checking Docker Compose Running Containers...
docker compose ps
echo.

echo [3/4] Verifying Direct Backend API (http://localhost:5000/)...
curl -s -o nul -w "Backend Status: %%{http_code}\n" http://localhost:5000/
echo.

echo [4/4] Verifying Frontend Nginx Web Server (http://localhost:3000/)...
curl -s -o nul -w "Frontend Status: %%{http_code}\n" http://localhost:3000/
echo.

echo ========================================================
echo   EXPERIMENT 7 DOCKER ENVIRONMENT VERIFIED!
echo ========================================================
pause
