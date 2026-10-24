@echo off
title HackSphere Backend Server
echo ==================================================
echo   Starting HackSphere Backend Server...
echo ==================================================
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
    node server.js
) else (
    call "%~dp0node.cmd" "%~dp0server.js"
)
pause
