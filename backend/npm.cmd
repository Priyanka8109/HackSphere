@echo off
setlocal
set SCRIPT_DIR=%~dp0

if "%1"=="" goto help
if "%1"=="start" goto start
if "%1"=="run" goto run
goto pass_through

:start
call "%SCRIPT_DIR%node.cmd" "%SCRIPT_DIR%server.js"
goto end

:run
if "%2"=="start" goto start
if "%2"=="dev" goto start
if "%2"=="verify" (
    call "%SCRIPT_DIR%node.cmd" "%SCRIPT_DIR%verifyApi.js"
    goto end
)
if "%2"=="verify:exp5" (
    call "%SCRIPT_DIR%node.cmd" "%SCRIPT_DIR%verifyExp5.js"
    goto end
)
if "%2"=="verify:exp6" (
    call "%SCRIPT_DIR%node.cmd" "%SCRIPT_DIR%verifyExp6.js"
    goto end
)
goto pass_through

:pass_through
call "%SCRIPT_DIR%node.cmd" %*
goto end

:help
echo HackSphere backend commands:
echo   npm start       - Starts the backend server (node server.js)
echo   npm run dev     - Starts the backend server
echo   npm run verify  - Runs automated CRUD API verification tests
goto end

:end
