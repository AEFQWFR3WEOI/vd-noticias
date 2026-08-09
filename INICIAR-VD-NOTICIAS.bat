@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js no esta instalado.
  echo Descargalo desde https://nodejs.org/ e instala la version 22 o superior.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Preparando VD Noticias por primera vez...
  call npm install
  if errorlevel 1 (
    echo No se pudo completar la instalacion.
    pause
    exit /b 1
  )
)

echo Abriendo VD Noticias en http://localhost:3000
call npm run local

if errorlevel 1 (
  echo El servidor se detuvo con un error.
  pause
)

endlocal
