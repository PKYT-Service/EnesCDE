# update.ps1
# Gère la vérification et la mise à jour de l'application

$MID_DEST = "C:\e-cde\MID"
$MID_URL = "https://enes-cde.vercel.app/data/MID_MC/mid.ps1"
$VERSION_URL = "https://enes-cde.vercel.app/data/MID_MC/v.json"
$MID_PATH = Join-Path $MID_DEST "mid.ps1"
$VERSION_PATH = Join-Path $MID_DEST "v.json"

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
    
    Write-Host "Telechargement de mid.ps1..."
    try {
        Invoke-WebRequest -Uri $MID_URL -OutFile $MID_PATH
        Write-Host "Telechargement de mid.ps1 reussi."
        Write-Log "Telechargement de mid.ps1 reussi."
    } catch {
        Write-Host "Erreur lors du telechargement de mid.ps1. Verifiez votre connexion." -ForegroundColor Red
        Write-Log "Erreur lors du telechargement de mid.ps1." -type "ERREUR"
    }
    
    Write-Host "Telechargement de v.json..."
    try {
        Invoke-WebRequest -Uri $VERSION_URL -OutFile $VERSION_PATH
        Write-Host "Telechargement de v.json reussi."
        Write-Log "Telechargement de v.json reussi."
    } catch {
        Write-Host "Erreur lors du telechargement de v.json. Verifiez votre connexion." -ForegroundColor Red
        Write-Log "Erreur lors du telechargement de v.json." -type "ERREUR"
    }
    
    Write-Host ""
    Write-Host "Mise a jour terminee !"
} else {
    Write-Host ""
    Write-Host "Pas de mise a jour necessaire."
}
