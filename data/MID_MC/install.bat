@echo off
setlocal
color 0b

echo.
echo ======================================================
echo == Installation et Configuration de MID.ps1         ==
echo ======================================================
echo.

set "MID_DEST=C:\e-cde\MID"
set "URL=https://enes-cde.vercel.app/data/MID_MC/mid.ps1"
set "DESKTOP_PATH=%USERPROFILE%\Desktop"
set "LAUNCH_BAT_NAME=Launch_MID.bat"

REM 1. Créer le dossier C:\e-cde\MID s'il n'existe pas
echo Verification et creation du repertoire d'installation...
if not exist "%MID_DEST%" (
    mkdir "%MID_DEST%"
    echo Le repertoire %MID_DEST% a ete cree.
) else (
    echo Le repertoire %MID_DEST% existe deja.
)

REM 2. Télécharger le fichier mid.ps1
echo.
echo Telechargement de mid.ps1...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%URL%' -OutFile '%MID_DEST%\mid.ps1'"
if %errorlevel% neq 0 (
    echo.
    echo Erreur lors du telechargement. Verifiez votre connexion internet ou l'URL.
    pause
    exit /b 1
) else (
    echo Telechargement reussi.
)

REM 3. Créer le fichier .bat de lancement sur le Bureau
echo.
echo Creation du fichier de lancement sur le Bureau...
(
    echo @echo off
    echo cd /d "%MID_DEST%"
    echo echo.
    echo echo Lancement du gestionnaire MID...
    echo powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; ./mid.ps1"
    echo pause
) > "%DESKTOP_PATH%\%LAUNCH_BAT_NAME%"

echo.
echo Le fichier "%LAUNCH_BAT_NAME%" a ete cree sur le Bureau.
echo L'installation est terminee.
echo.
pause
endlocal
