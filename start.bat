@echo off
REM Master Barber - Full Stack Startup Script (Windows)
REM Starts both backend (Go) and frontend (React) servers

setlocal enabledelayedexpansion

set PROJECT_ROOT=%~dp0
set BACKEND_DIR=%PROJECT_ROOT%backend
set FRONTEND_DIR=%PROJECT_ROOT%frontend

cls
echo.
echo 🚀 Master Barber - Full Stack Startup
echo =====================================
echo.

REM Check if backend directory exists
if not exist "%BACKEND_DIR%" (
    echo ❌ Backend directory not found at %BACKEND_DIR%
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "%FRONTEND_DIR%" (
    echo ❌ Frontend directory not found at %FRONTEND_DIR%
    pause
    exit /b 1
)

REM Check if Go is installed
where go >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Go is not installed
    echo    Install from: https://golang.org/doc/install
    pause
    exit /b 1
)

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo    Install from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

echo ✅ Prerequisites checked
echo.

REM Check backend .env
echo Checking backend configuration...
if not exist "%BACKEND_DIR%\.env" (
    echo ⚠️  Backend .env file not found
    if exist "%BACKEND_DIR%\.env.example" (
        echo    Creating from example...
        copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
        echo    ⚠️  Please update backend\.env with your Supabase credentials!
    )
)
echo ✅ Backend configuration ready
echo.

REM Check frontend dependencies
echo Checking frontend dependencies...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo    Installing npm packages...
    cd /d "%FRONTEND_DIR%"
    call npm install --silent
    cd /d "%PROJECT_ROOT%"
)
echo ✅ Frontend dependencies ready
echo.

REM Start backend in new window
echo Starting backend server...
cd /d "%BACKEND_DIR%"
start "Master Barber - Backend" cmd /k call run.sh
echo ✅ Backend started
echo.

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo Starting frontend server...
cd /d "%FRONTEND_DIR%"
start "Master Barber - Frontend" cmd /k npm run dev
echo ✅ Frontend started
echo.

REM Display startup information
echo =====================================
echo ✨ Both servers are running!
echo =====================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5175
echo.
echo Open your browser to: http://localhost:5175
echo.
echo Close the backend and frontend windows to stop the servers.
echo.
pause
