@echo off
title HackSphere API Verification
echo ==================================================
echo   Running CRUD API Verification Tests...
echo ==================================================
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% equ 0 (
    node verifyApi.js
) else (
    call "%~dp0node.cmd" "%~dp0verifyApi.js"
)
pause
