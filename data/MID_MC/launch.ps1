# launch.ps1
# Gère l'installation, la mise à jour et le lancement de l'application MID

$MID_DEST = "C:\e-cde\MID"
$PS1_URL = "https://enes-cde.vercel.app/data/MID_MC/mid.ps1"
$V_URL = "https://enes-cde.vercel.app/data/MID_MC/v.json"
$PS1_PATH = Join-Path $MID_DEST "mid.ps1"
$JSON_PATH = Join-Path $MID_DEST "config.json"
$LOG_PATH = Join-Path $MID_DEST "install.log"
$LAUNCHER_URL = "https://enes-cde.vercel.app/data/MID_MC/launch.ps1"

function Write-Log($message, [string]$type = "INFO") {
    $timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
    $logEntry = "$timestamp - [$type] - $message"
    Add-Content -Path $LOG_PATH -Value $logEntry
}

# 1. Verification et mise a jour du lanceur
try {
    Write-Host "Verification d'une nouvelle version du lanceur..."
    $web_launcher = (Invoke-WebRequest -Uri $LAUNCHER_URL -UseBasicParsing).Content
    $local_launcher = Get-Content $MyInvocation.MyCommand.Path
    if ($web_launcher -ne $local_launcher) {
        Write-Host "Mise a jour du lanceur requise. Telechargement..." -ForegroundColor Yellow
        $web_launcher | Out-File $MyInvocation.MyCommand.Path -Encoding UTF8
        Write-Host "Le lanceur a ete mis a jour. Relancez l'application." -ForegroundColor Green
        Write-Log "Le lanceur a ete mis a jour. Relancement de l'application."
        Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$MyInvocation.MyCommand.Path`""
        exit
    }
} catch {
    Write-Host "Impossible de verifier la version du lanceur." -ForegroundColor Red
    Write-Log "Erreur lors de la verification du lanceur." -type "ERREUR"
}

# 2. Creation du repertoire d'installation
if (-not (Test-Path $MID_DEST)) {
    Write-Host "Creation du repertoire d'installation..."
    New-Item -ItemType Directory -Path $MID_DEST | Out-Null
    Write-Log "Repertoire d'installation cree."
}

# 3. Verification des fichiers et mise à jour de l'application
Write-Host ""
Write-Host "Verification des fichiers de l'application..."
Write-Log "Verification des fichiers de l'application."

$isOutdated = $false

if (-not (Test-Path $PS1_PATH)) {
    Write-Host "Fichiers manquants. Installation complete requise." -ForegroundColor Yellow
    $isOutdated = $true
} elseif (Test-Path $JSON_PATH) {
    try {
        $web_version_obj = Invoke-WebRequest -Uri $V_URL -UseBasicParsing | ConvertFrom-Json
        $local_version_obj = Get-Content $JSON_PATH | ConvertFrom-Json
        
        if ($web_version_obj.app -ne $local_version_obj.app) {
            Write-Host "Nouvelle version disponible. Telechargement..." -ForegroundColor Yellow
            $isOutdated = $true
        } else {
            Write-Host "Votre version est a jour." -ForegroundColor Green
        }
    } catch {
        Write-Host "Impossible de verifier la version en ligne. Lancement de la version locale." -ForegroundColor Red
        Write-Log "Erreur lors de la verification de la version en ligne." -type "ERREUR"
    }
}

# 4. Installation ou mise à jour
if ($isOutdated) {
    Write-Host ""
    Write-Host "Lancement de l'installation/mise a jour..."
    Write-Log "Lancement de l'installation/mise a jour."
    
    Write-Host "Telechargement de mid.ps1..."
    try {
        Invoke-WebRequest -Uri $PS1_URL -OutFile $PS1_PATH
        Write-Host "Telechargement de mid.ps1 reussi."
        Write-Log "Telechargement de mid.ps1 reussi."
    } catch {
        Write-Host "Erreur lors du telechargement de mid.ps1. Verifiez votre connexion." -ForegroundColor Red
        Write-Log "Erreur lors du telechargement de mid.ps1." -type "ERREUR"
    }
    
    Write-Host "Telechargement de v.json..."
    try {
        Invoke-WebRequest -Uri $V_URL -OutFile $JSON_PATH
        Write-Host "Telechargement de v.json reussi."
        Write-Log "Telechargement de v.json reussi."
    } catch {
        Write-Host "Erreur lors du telechargement de v.json. Verifiez votre connexion." -ForegroundColor Red
        Write-Log "Erreur lors du telechargement de v.json." -type "ERREUR"
    }
}

# 5. Lancement de l'application
Write-Host ""
Write-Host "Lancement de l'application MID..."
Write-Log "Lancement de l'application MID."
Invoke-Expression "& '$PS1_PATH'"
