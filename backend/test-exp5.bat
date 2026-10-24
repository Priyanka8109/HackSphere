@echo off
title HackSphere Experiment 5 Verification
echo ==================================================
echo   Running Experiment 5 Security & Auth API Tests...
echo ==================================================
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
    node verifyExp5.js
) else (
    call "%~dp0node.cmd" "%~dp0verifyExp5.js"
)
pause
