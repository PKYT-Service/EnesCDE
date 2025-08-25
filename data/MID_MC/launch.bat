@echo off
cd /d "C:\e-cde\MID"
echo.
echo Lancement de l'application MID...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ".\mid.ps1"
pause
