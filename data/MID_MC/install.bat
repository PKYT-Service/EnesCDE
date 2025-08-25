@echo off
setlocal
color 0b

echo.
echo ======================================================
echo == Installation du Lanceur MID sur le Bureau      ==
======================================================
echo.

set "MID_DEST=C:\e-cde\MID"
set "LAUNCHER_PS1_URL=https://enes-cde.vercel.app/data/MID_MC/launch.ps1"
set "LAUNCHER_BAT_URL=https://enes-cde.vercel.app/data/MID_MC/launch.bat"
set "LAUNCHER_PS1_PATH=%MID_DEST%\launch.ps1"
set "LAUNCHER_BAT_PATH=%MID_DEST%\launch.bat"
set "DESKTOP_BAT_PATH=%USERPROFILE%\Desktop\Launch_MID.bat"

REM 1. Creation du repertoire d'installation
echo Verification et creation du repertoire d'installation...
if not exist "%MID_DEST%" (
    mkdir "%MID_DEST%"
    echo Le repertoire %MID_DEST% a ete cree.
) else (
    echo Le repertoire %MID_DEST% existe deja.
)
echo.

REM 2. Telechargement des fichiers
echo Telechargement des scripts de lancement...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%LAUNCHER_PS1_URL%' -OutFile '%LAUNCHER_PS1_PATH%'"
if %errorlevel% neq 0 (
    echo.
    echo Erreur lors du telechargement du script PS1. Verifiez votre connexion.
    pause
    exit /b 1
) else (
    echo Telechargement du lanceur PS1 reussi.
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%LAUNCHER_BAT_URL%' -OutFile '%LAUNCHER_BAT_PATH%'"
if %errorlevel% neq 0 (
    echo.
    echo Erreur lors du telechargement du script BAT. Verifiez votre connexion.
    pause
    exit /b 1
) else (
    echo Telechargement du lanceur BAT reussi.
)

REM 3. Deplacer le lanceur BAT sur le bureau
echo.
echo Creation du raccourci sur le Bureau...
copy "%LAUNCHER_BAT_PATH%" "%DESKTOP_BAT_PATH%"
if %errorlevel% neq 0 (
    echo Erreur lors de la creation du raccourci sur le Bureau.
) else (
    echo Le raccourci 'Launch_MID.bat' a ete cree sur le Bureau.
)

REM 4. Afficher un message d'instruction
echo.
echo L'installation est terminee.
echo Vous pouvez maintenant utiliser le fichier 'Launch_MID.bat' sur votre Bureau.
echo Double-cliquez dessus pour lancer l'application.
echo.
pause
endlocal
