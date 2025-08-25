@echo off
setlocal
color 0b

:MENU
cls
echo.
echo ======================================================
echo == Choisissez une option:                           ==
======================================================
echo.
echo 1. Lancer l'application MID
echo 2. Lancer la mise a jour
echo 3. Quitter
echo.
set /p "CHOIX=Entrez votre choix (1, 2 ou 3): "

if "%CHOIX%"=="1" goto LANCE_MID
if "%CHOIX%"=="2" goto LANCE_UPDATE
if "%CHOIX%"=="3" goto FIN

echo Choix invalide. Veuillez reessayer.
pause
goto MENU

:LANCE_MID
echo.
echo Lancement de l'application MID...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "C:\e-cde\MID\mid.ps1"
goto FIN

:LANCE_UPDATE
echo.
echo Lancement de la mise a jour de l'application...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "C:\e-cde\MID\update.ps1"
goto FIN

:FIN
echo.
echo Termine.
pause
endlocal
exit
