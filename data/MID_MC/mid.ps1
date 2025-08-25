# MID.ps1
# Gestionnaire MID - VPS et Serveur
# 100% PowerShell, full auto

# ---------------- CONFIG ----------------
$MIDFolder = "C:\e-cde\MID"
$LFPFolder = Join-Path $MIDFolder "LFP"
$ConfigFile = Join-Path $MIDFolder "config.json"

# Charger ou créer config.json
if (Test-Path $ConfigFile) {
    $Config = Get-Content $ConfigFile | ConvertFrom-Json
} else {
    Write-Host "Config introuvable. Création automatique..."
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
            if ($line -and -not ($line.EndsWith("/"))) { $files += $line }
        }
        $reader.Close()
        $response.Close()

        foreach ($file in $files) {
            if ([string]::IsNullOrWhiteSpace($file)) { continue }
            if ($file.EndsWith("/")) { continue }
            if (-not $file.Contains(".")) { continue }

            $fileName = [System.IO.Path]::GetFileName($file)
            $fileUrl  = "$ftpSource/$fileName"
            $destFile = Join-Path $localDest $fileName

            Write-Host "Téléchargement $fileUrl -> $destFile"
            try {
                $webclient = New-Object System.Net.WebClient
                $webclient.Credentials = New-Object System.Net.NetworkCredential("ftpuser","instance")
                $webclient.DownloadFile($fileUrl, $destFile)
            } catch {
                Write-Warning "Erreur téléchargement fichier : $fileUrl"
            }
        }
    } catch {
        Write-Warning "Impossible de lister : $ftpSource"
    }
}

function Sync-Dir($sourceFolder, $destFolder) {
    Ensure-Dir $destFolder
    Get-ChildItem -Path $sourceFolder -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($sourceFolder.Length).TrimStart('\')
        $targetPath = Join-Path $destFolder $relativePath
        if ($_.PSIsContainer) {
            Ensure-Dir $targetPath
        } else {
            Copy-Item -LiteralPath $_.FullName -Destination $targetPath -Force
        }
    }
}

function Remove-LFPContent($lfpSubFolder, $clientFolder) {
    # Supprimer côté client
    if (Test-Path $clientFolder) {
        Get-ChildItem -Path $clientFolder -Recurse -Force | Remove-Item -Force -Recurse
        Write-Host "Dossier vidé côté client : $clientFolder"
    }

    # Supprimer côté LFP
    if (Test-Path $lfpSubFolder) {
        Remove-Item $lfpSubFolder -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Dossier supprimé côté LFP : $lfpSubFolder"
    }
}

# ----------- PATCH UPDATE -----------
function Update-Base {
    Write-Host "➡ Mise à jour Base..."
    # Suppression
    foreach ($type in @("mods","shaderpacks","resourcepacks")) {
        $lfpSub = Join-Path $LFPFolder "base\$type"
        $clientDest = $Config.$type
        Remove-LFPContent $lfpSub $clientDest
    }
    Start-Sleep -Seconds 1
    # Réinstallation
    foreach ($type in @("mods","shaderpacks","resourcepacks")) {
        $ftp = "ftp://ftpuser:instance@51.77.140.39/base/$type"
        $lfpDest = Join-Path $LFPFolder "base\$type"
        Download-FTP $ftp $lfpDest

        $clientDest = $Config.$type
        if ($clientDest) {
            Ensure-Dir $clientDest
            Sync-Dir $lfpDest $clientDest
        }
    }
    Write-Host "✅ Base mise à jour !"
}

function Update-Server($srvName) {
    Write-Host "➡ Mise à jour Serveur $srvName..."
    # Suppression
    foreach ($type in @("mods","shaderpacks","resourcepacks")) {
        $lfpSub = Join-Path $LFPFolder "servers\$srvName\$type"
        $clientDest = $Config.$type
        Remove-LFPContent $lfpSub $clientDest
    }
    Start-Sleep -Seconds 1
    # Réinstallation
    foreach ($type in @("mods","shaderpacks","resourcepacks")) {
        $ftp = "ftp://ftpuser:instance@51.77.140.39/server/$srvName/$type"
        $lfpDest = Join-Path $LFPFolder "servers\$srvName\$type"
        Download-FTP $ftp $lfpDest

        $clientDest = $Config.$type
        if ($clientDest) {
            Ensure-Dir $clientDest
            Sync-Dir $lfpDest $clientDest
        }
    }
    Write-Host "✅ Serveur $srvName mis à jour !"
}

# ---------------- MENU ----------------
while ($true) {
    Write-Host "=== Gestionnaire MID ==="
    Write-Host "1. Installer Base"
    Write-Host "2. Supprimer Base"
    Write-Host "3. Mettre à jour Base"
    Write-Host "4. Installer Instance Serveur"
    Write-Host "5. Supprimer Instance Serveur"
    Write-Host "6. Mettre à jour Instance Serveur"
    Write-Host "0. Quitter"

    $choice = Read-Host "Choisissez une option"

    switch ($choice) {
        "1" {
            Write-Host "Téléchargement Base depuis VPS..."
            foreach ($type in @("mods","shaderpacks","resourcepacks")) {
                $ftp = "ftp://ftpuser:instance@51.77.140.39/base/$type"
                $lfpDest = Join-Path $LFPFolder "base\$type"
                Download-FTP $ftp $lfpDest

                $clientDest = $Config.$type
                if ($clientDest) {
                    Ensure-Dir $clientDest
                    Sync-Dir $lfpDest $clientDest
                } else {
                    Write-Warning "Dossier client non configuré pour $type"
                }
            }
            Write-Host "✅ Base installée avec succès !"
        }
        "2" {
            Write-Host "Suppression Base..."
            foreach ($type in @("mods","shaderpacks","resourcepacks")) {
                $lfpSub = Join-Path $LFPFolder "base\$type"
                $clientDest = $Config.$type
                Remove-LFPContent $lfpSub $clientDest
            }
            Write-Host "✅ Base supprimée !"
        }
        "3" { Update-Base }
        "4" {
            $srvName = Read-Host "Nom de l'instance serveur"
            Write-Host "Téléchargement Serveur $srvName..."
            foreach ($type in @("mods","shaderpacks","resourcepacks")) {
                $ftp = "ftp://ftpuser:instance@51.77.140.39/server/$srvName/$type"
                $lfpDest = Join-Path $LFPFolder "servers\$srvName\$type"
                Download-FTP $ftp $lfpDest

                $clientDest = $Config.$type
                if ($clientDest) {
                    Ensure-Dir $clientDest
                    Sync-Dir $lfpDest $clientDest
                } else {
                    Write-Warning "Dossier client non configuré pour $type"
                }
            }
            Write-Host "✅ Instance Serveur installée avec succès !"
        }
        "5" {
            $srvName = Read-Host "Nom de l'instance serveur"
            Write-Host "Suppression Serveur $srvName..."
            foreach ($type in @("mods","shaderpacks","resourcepacks")) {
                $lfpSub = Join-Path $LFPFolder "servers\$srvName\$type"
                $clientDest = $Config.$type
                Remove-LFPContent $lfpSub $clientDest
            }
            Write-Host "✅ Instance Serveur supprimée !"
        }
        "6" {
            $srvName = Read-Host "Nom de l'instance serveur"
            Update-Server $srvName
        }
        "0" { break }
        default { Write-Host "Option invalide !" -ForegroundColor Yellow }
    }
}
