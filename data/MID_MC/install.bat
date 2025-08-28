@echo off
setlocal
color 0b

echo.
echo ======================================================
echo == Installation et Configuration de MID.ps1         ==
======================================================
echo.

set "MID_DEST=C:\e-cde\MID"
set "MID_URL=https://enes-cde.vercel.app/data/MID_MC/mid.ps1"
set "VERSION_URL=https://enes-cde.vercel.app/data/MID_MC/v.json"
set "LAUNCHER_URL=https://enes-cde.vercel.app/data/MID_MC/launch.bat"
set "UPDATER_URL=https://enes-cde.vercel.app/data/MID_MC/update.ps1"
set "DEPO_URL=https://enes-cde.vercel.app/data/MID_MC/depots.html"

set "MID_PATH=%MID_DEST%\mid.ps1"
set "VERSION_PATH=%MID_DEST%\v.json"
set "LAUNCHER_PATH=%MID_DEST%\launch.bat"
set "UPDATER_PATH=%MID_DEST%\update.ps1"
set "DEPO_PATH=%MID_DEST%\depots.html"
set "DESKTOP_PATH=%USERPROFILE%\Desktop\Launch_MID.bat"

REM 1. Création du répertoire d'installation
echo Verification et creation du repertoire d'installation...
if not exist "%MID_DEST%" (
    mkdir "%MID_DEST%"
    echo Le repertoire %MID_DEST% a ete cree.
) else (
    echo Le repertoire %MID_DEST% existe deja.
)
echo.

REM 2. Telechargement des fichiers
echo Telechargement des fichiers...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$webClient = New-Object System.Net.WebClient; $webClient.DownloadFile('%MID_URL%', '%MID_PATH%')"
if %errorlevel% neq 0 (
    echo Erreur lors du telechargement de mid.ps1.
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$webClient = New-Object System.Net.WebClient; $webClient.DownloadFile('%VERSION_URL%', '%VERSION_PATH%')"
if %errorlevel% neq 0 (
    echo Erreur lors du telechargement de v.json.
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$webClient = New-Object System.Net.WebClient; $webClient.DownloadFile('%LAUNCHER_URL%', '%LAUNCHER_PATH%')"
if %errorlevel% neq 0 (
    echo Erreur lors du telechargement de launch.bat.
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$webClient = New-Object System.Net.WebClient; $webClient.DownloadFile('%UPDATER_URL%', '%UPDATER_PATH%')"
if %errorlevel% neq 0 (
    echo Erreur lors du telechargement de update.ps1.
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$webClient = New-Object System.Net.WebClient; $webClient.DownloadFile('%DEPO_URL%', '%DEPO_PATH%')"
if %errorlevel% neq 0 (
    echo Erreur lors du telechargement de depots.html.
    pause
    exit /b 1
)

echo Tous les fichiers ont ete telecharges avec succes.

REM 3. Création du raccourci sur le Bureau
echo.
echo Creation du raccourci sur le Bureau...
copy "%LAUNCHER_PATH%" "%DESKTOP_PATH%"
if %errorlevel% neq 0 (
    echo Erreur lors de la creation du raccourci sur le Bureau.
) else (
    echo Le raccourci 'Launch_MID.bat' a ete cree sur le Bureau.
)

REM 4. Afficher un message d'instruction
echo.
echo L'installation est terminee.
echo Vous pouvez desormais lancer l'application en utilisant le raccourci sur votre Bureau.
echo.
pause
endlocal
