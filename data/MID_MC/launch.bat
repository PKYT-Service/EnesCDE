@echo off
cd /d "C:\e-cde\MID"
echo.
echo Lancement du gestionnaire MID...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; ./launch.ps1"
pause
