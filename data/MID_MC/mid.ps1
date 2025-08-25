# MID.ps1
# Gestionnaire MID - VPS et Serveur
# 100% PowerShell, full auto

# ---------------- CONFIG ----------------
$MIDFolder = "C:\e-cde\MID"
$LFPFolder = Join-Path $MIDFolder "LFP"
$ConfigFile = Join-Path $MIDFolder "config.json"

# Charger ou créer config.json
if (Test-Path $ConfigFile) {
    Write-Host "Config.json trouvé. Chargement..." -ForegroundColor Green
    $Config = Get-Content $ConfigFile | ConvertFrom-Json
} else {
    Write-Host "Config introuvable. Création automatique..." -ForegroundColor Yellow
    $Config = [ordered]@{
        mods = Read-Host "Chemin complet du dossier mods"
        shaderpacks = Read-Host "Chemin complet du dossier shaderpacks"
        resourcepacks = Read-Host "Chemin complet du dossier resourcepacks"
        LFP = $LFPFolder
    }
    foreach ($path in @($Config.mods, $Config.shaderpacks, $Config.resourcepacks, $Config.LFP)) {
        if ($path -and -not (Test-Path $path)) { New-Item -ItemType Directory -Path $path | Out-Null }
    }
    $Config | ConvertTo-Json -Depth 5 | Set-Content $ConfigFile
    Write-Host "Config.json créé avec succès !" -ForegroundColor Green
}

# ---------------- FONCTIONS ----------------
function Ensure-Dir($path) {
    if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path | Out-Null }
}

function Download-FTP($ftpSource, $localDest) {
    Ensure-Dir $localDest
    try {
        $request = [System.Net.FtpWebRequest]::Create($ftpSource)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $request.Credentials = New-Object System.Net.NetworkCredential("ftpuser", "instance")
        $response = $request.GetResponse()
        $reader = New-Object IO.StreamReader $response.GetResponseStream()
        $files = @()
        while(-not $reader.EndOfStream) {
            $line = $reader.ReadLine()
            if ($line -and ($line -match '\.')) { $files += $line }
        }
        $reader.Close()
        $response.Close()

        foreach ($file in $files) {
            $fileName = [System.IO.Path]::GetFileName($file)
            $fileUrl  = "$ftpSource/$fileName"
            $destFile = Join-Path $localDest $fileName

            Write-Host "  Téléchargement $fileName..."
            try {
                $webclient = New-Object System.Net.WebClient
                $webclient.Credentials = New-Object System.Net.NetworkCredential("ftpuser","instance")
                $webclient.DownloadFile($fileUrl, $destFile)
            } catch {
                Write-Warning "Erreur téléchargement fichier : $fileUrl"
            }
        }
    } catch {
        Write-Warning "Impossible de lister le contenu de : $ftpSource"
    }
}

function Sync-Dir($sourceFolder, $destFolder) {
    Ensure-Dir $destFolder
    $sourceFiles = Get-ChildItem -Path $sourceFolder -File -Recurse
    foreach ($file in $sourceFiles) {
        $relativePath = $file.FullName.Substring($sourceFolder.Length).TrimStart('\')
        $targetPath = Join-Path $destFolder $relativePath
        try {
            Copy-Item -LiteralPath $file.FullName -Destination $targetPath -Force
        } catch {
            Write-Warning "Impossible de copier $file.Name vers le client."
        }
    }
}

function Remove-LFPContent($lfpSubFolder, $clientFolder) {
    if (-not (Test-Path $lfpSubFolder)) { 
        Write-Host "  Dossier LFP non trouvé, pas de suppression nécessaire."
        return 
    }
    if (-not (Test-Path $clientFolder)) { 
        Write-Host "  Dossier client non trouvé, pas de suppression nécessaire."
        return 
    }
    
    # On récupère les fichiers de la LFP et on crée une liste
    $lfpFiles = Get-ChildItem -LiteralPath $lfpSubFolder -Recurse -File

    if ($lfpFiles.Count -eq 0) {
        Write-Host "  Aucun fichier à supprimer dans $lfpSubFolder."
        return
    }

    Write-Host "  Fichiers à supprimer : " -ForegroundColor Yellow
    $lfpFiles | ForEach-Object { Write-Host "  - $($_.BaseName)$($_.Extension)" }

    foreach ($lfpFile in $lfpFiles) {
        # On utilise le nom de base du fichier pour la recherche, plus simple et sûr
        $fileName = $lfpFile.Name
        $clientFilePath = Join-Path $clientFolder $fileName
        
        # On vérifie que le fichier existe bien avant de le supprimer
        if (Test-Path -LiteralPath $clientFilePath) {
            Remove-Item -LiteralPath $clientFilePath -Force -ErrorAction SilentlyContinue
            Write-Host "  Supprimé côté client : $clientFilePath"
        }
    }
}

function Clean-LFPFolder($lfpSubFolder) {
    if (Test-Path $lfpSubFolder) {
        Write-Host "  Nettoyage du cache LFP : $lfpSubFolder" -ForegroundColor Green
        Remove-Item $lfpSubFolder -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# ---------------- ACTIONS ----------------
function Install-Content($sourceType, $sourceName) {
    Write-Host "➡ Installation de $sourceType $sourceName..." -ForegroundColor Cyan
    $types = @("mods","shaderpacks","resourcepacks")
    foreach ($type in $types) {
        $ftpPath = "ftp://ftpuser:instance@51.77.140.39/$sourceType/$sourceName/$type"
        $lfpPath = Join-Path $LFPFolder "$sourceType\$sourceName\$type"
        Download-FTP $ftpPath $lfpPath
        Sync-Dir $lfpPath $Config.$type
    }
    Write-Host "✅ $sourceType $sourceName installé avec succès !" -ForegroundColor Green
}

function Remove-Content($sourceType, $sourceName) {
    Write-Host "➡ Suppression de $sourceType $sourceName..." -ForegroundColor Cyan
    $types = @("mods","shaderpacks","resourcepacks")
    foreach ($type in $types) {
        $lfpPath = Join-Path $LFPFolder "$sourceType\$sourceName\$type"
        $clientPath = $Config.$type
        Remove-LFPContent $lfpPath $clientPath
    }
    # Nettoyer les fichiers de la base du cache LFP après la suppression
    foreach ($type in $types) {
        $lfpPath = Join-Path $LFPFolder "$sourceType\$sourceName\$type"
        Clean-LFPFolder $lfpPath
    }
    Write-Host "✅ $sourceType $sourceName supprimé avec succès !" -ForegroundColor Green
}

function Update-Content($sourceType, $sourceName) {
    Write-Host "➡ Mise à jour de $sourceType $sourceName..." -ForegroundColor Cyan
    Remove-Content -sourceType $sourceType -sourceName $sourceName
    Install-Content -sourceType $sourceType -sourceName $sourceName
    Write-Host "✅ $sourceType $sourceName mis à jour avec succès !" -ForegroundColor Green
}

# ---------------- MENU ----------------
while ($true) {
    Write-Host ""
    Write-Host "=== Gestionnaire MID ===" -ForegroundColor Cyan
    Write-Host "1. Installer Base"
    Write-Host "2. Supprimer Base"
    Write-Host "3. Mettre à jour Base"
    Write-Host "4. Installer Serveur"
    Write-Host "5. Supprimer Serveur"
    Write-Host "6. Mettre à jour Serveur"
    Write-Host "0. Quitter"
    Write-Host "========================" -ForegroundColor Cyan

    $choice = Read-Host "Choisissez une option"

    switch ($choice) {
        "1" { Install-Content -sourceType "base" -sourceName "" }
        "2" { Remove-Content -sourceType "base" -sourceName "" }
        "3" { Update-Content -sourceType "base" -sourceName "" }
        "4" {
            $srvName = Read-Host "Nom de l'instance serveur"
            Install-Content -sourceType "server" -sourceName $srvName
        }
        "5" {
            $srvName = Read-Host "Nom de l'instance serveur"
            Remove-Content -sourceType "server" -sourceName $srvName
        }
        "6" {
            $srvName = Read-Host "Nom de l'instance serveur"
            Update-Content -sourceType "server" -sourceName $srvName
        }
        "0" { break }
        default { Write-Host "Option invalide ! Veuillez réessayer." -ForegroundColor Yellow }
    }
}
