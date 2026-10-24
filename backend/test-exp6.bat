@echo off
title HackSphere Experiment 6 Verification
echo ==================================================
echo   Running Experiment 6 Auth & Roles API Tests...
echo ==================================================
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
    node verifyExp6.js
) else (
    call "%~dp0node.cmd" "%~dp0verifyExp6.js"
)
pause
