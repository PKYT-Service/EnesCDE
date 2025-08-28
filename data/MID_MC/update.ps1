# update.ps1
# Gère la vérification et la mise à jour de l'application

$MID_DEST = "C:\e-cde\MID"
$MID_URL = "https://enes-cde.vercel.app/data/MID_MC/mid.ps1"
$VERSION_URL = "https://enes-cde.vercel.app/data/MID_MC/v.json"
$LAUNCHER_URL = "https://enes-cde.vercel.app/data/MID_MC/launch.bat"
$UPDATER_URL = "https://enes-cde.vercel.app/data/MID_MC/update.ps1"
$DEPO_URL = "https://enes-cde.vercel.app/data/MID_MC/depots.html"

$MID_PATH = Join-Path $MID_DEST "mid.ps1"
$VERSION_PATH = Join-Path $MID_DEST "v.json"
$LAUNCHER_PATH = Join-Path $MID_DEST "launch.bat"
$UPDATER_PATH = Join-Path $MID_DEST "update.ps1"
$DEPO_PATH = Join-Path $MID_DEST "depots.html"

function Write-Log($message, [string]$type = "INFO") {
    $timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
    $logEntry = "$timestamp - [$type] - $message"
    Add-Content -Path (Join-Path $MID_DEST "update.log") -Value $logEntry
}

# Vérification de la mise à jour
Write-Host "Verification d'une nouvelle version de l'application..."
Write-Log "Verification d'une nouvelle version de l'application."

$isOutdated = $false

try {
    $web_version = (Invoke-WebRequest -Uri $VERSION_URL -UseBasicParsing | ConvertFrom-Json).app
    if (-not (Test-Path $VERSION_PATH)) {
        Write-Host "Fichier de version locale manquant. Mise a jour requise." -ForegroundColor Yellow
        $isOutdated = $true
    } else {
        $local_version = (Get-Content $VERSION_PATH | ConvertFrom-Json).app
        if ($web_version -ne $local_version) {
            Write-Host "Nouvelle version disponible. Telechargement..." -ForegroundColor Yellow
            $isOutdated = $true
        } else {
            Write-Host "Votre version est a jour." -ForegroundColor Green
        }
    }
} catch {
    Write-Host "Erreur lors de la verification de la version en ligne. Impossible de continuer." -ForegroundColor Red
    Write-Log "Erreur lors de la verification de la version en ligne." -type "ERREUR"
    exit
}

# Installation ou mise à jour si nécessaire
if ($isOutdated) {
    Write-Host ""
    Write-Host "Lancement de la mise a jour..."
    Write-Log "Lancement de la mise a jour."
    
    # Liste des fichiers a mettre a jour
    $filesToUpdate = @{
        "mid.ps1"    = $MID_URL
        "v.json"     = $VERSION_URL
        "launch.bat" = $LAUNCHER_URL
        "depots.html" = $DEPO_URL
        "update.ps1" = $UPDATER_URL
    }

    foreach ($file in $filesToUpdate.Keys) {
        $url = $filesToUpdate[$file]
        $path = Join-Path $MID_DEST $file
        
        Write-Host "Telechargement de $file..."
        try {
            Invoke-WebRequest -Uri $url -OutFile $path -TimeoutSec 30
            Write-Host "Telechargement de $file reussi."
            Write-Log "Telechargement de $file reussi."
        } catch {
            Write-Host "Erreur lors du telechargement de $file. Verifiez votre connexion." -ForegroundColor Red
            Write-Log "Erreur lors du telechargement de $file. Erreur: $($_.Exception.Message)" -type "ERREUR"
        }
    }
    
    Write-Host ""
    Write-Host "Mise a jour terminee !"
} else {
    Write-Host ""
    Write-Host "Pas de mise a jour necessaire."
}
