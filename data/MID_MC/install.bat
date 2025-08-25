@echo off
setlocal
color 0b

echo.
echo ======================================================
echo == Installation et Configuration de MID.ps1         ==
echo ======================================================
echo.

set "MID_DEST=C:\e-cde\MID"
set "PS1_URL=https://enes-cde.vercel.app/data/MID_MC/mid.ps1"
set "V_URL=https://enes-cde.vercel.app/data/MID_MC/v.json"
set "PS1_PATH=%MID_DEST%\mid.ps1"
set "JSON_PATH=%MID_DEST%\config.json"
set "DESKTOP_PATH=%USERPROFILE%\Desktop"
set "LAUNCH_BAT_NAME=Launch_MID.bat"

REM 1. Créer le dossier C:\e-cde\MID s'il n'existe pas
echo Verification du repertoire d'installation...
if not exist "%MID_DEST%" (
    echo Le repertoire %MID_DEST% n'existe pas. Creation...
    mkdir "%MID_DEST%"
    goto :INSTALL_FULL
) else (
    echo Le repertoire %MID_DEST% existe deja.
)

REM 2. Verifier l'existence des fichiers PS1 et JSON
echo.
echo Verification des fichiers de l'application...
if not exist "%PS1_PATH%" (
    echo Fichier mid.ps1 manquant.
    goto :INSTALL_FULL
)
if not exist "%JSON_PATH%" (
    echo Fichier config.json manquant.
    goto :INSTALL_FULL
)

REM 3. Comparer la version locale avec la version en ligne
echo.
echo Verification de la version de l'application...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
    "try { ^
        $web_version_str = (Invoke-WebRequest -Uri '%V_URL%' -UseBasicParsing).Content; ^
        $web_version_obj = $web_version_str | ConvertFrom-Json; ^
        $local_version_obj = (Get-Content '%JSON_PATH%' | ConvertFrom-Json); ^
        if ($web_version_obj.app -ne $local_version_obj.app) { ^
            Write-Host 'Une nouvelle version est disponible. Suppression des anciens fichiers...' -ForegroundColor Yellow; ^
            Remove-Item -Path '%PS1_PATH%', '%JSON_PATH%' -Force -ErrorAction Stop; ^
            Write-Host 'Ancienne version supprimee.' -ForegroundColor Green; ^
            Exit 1; ^
        } else { ^
            Write-Host 'Votre version est a jour.' -ForegroundColor Green; ^
            Exit 0; ^
        } ^
    } catch { ^
        Write-Host 'Impossible de verifier la version en ligne. Lancement de la version locale.' -ForegroundColor Red; ^
        Exit 0; ^
    }"

if %errorlevel% neq 0 (
    goto :INSTALL_FULL
) else (
    goto :CREATE_LAUNCHER
)

:INSTALL_FULL
echo.
echo Lancement de l'installation complete...
REM Telecharger les deux fichiers PS1 et JSON
echo Telechargement de mid.ps1...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%PS1_URL%' -OutFile '%PS1_PATH%'"
if %errorlevel% neq 0 (
    echo.
    echo Erreur lors du telechargement de mid.ps1. Verifiez votre connexion.
    pause
    exit /b 1
) else (
    echo Telechargement de mid.ps1 reussi.
)

echo Telechargement de config.json...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%V_URL%' -OutFile '%JSON_PATH%'"
if %errorlevel% neq 0 (
    echo.
    echo Erreur lors du telechargement de config.json. Verifiez votre connexion.
    pause
    exit /b 1
) else (
    echo Telechargement de config.json reussi.
)

:CREATE_LAUNCHER
REM Creer le fichier .bat de lancement sur le Bureau
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
