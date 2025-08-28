# MID.ps1
# Gestionnaire MID - VPS et Serveur
# 100% PowerShell, full auto

# Force l'encodage du terminal en UTF-8 pour un affichage correct des caracteres
chcp 65001 >$null

# Force PowerShell a lire et ecrire les fichiers en UTF-8
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['Add-Content:Encoding'] = 'utf8'

# ---------------- CONFIG ----------------
$MIDFolder = "C:\e-cde\MID"
$LFPFolder = Join-Path $MIDFolder "LFP"
$ConfigFile = Join-Path $MIDFolder "config.json"
$LogFile = Join-Path $MIDFolder "all.log"

# Charger ou creer config.json
if (Test-Path $ConfigFile) {
    Write-Host "Config.json trouve. Chargement..." -ForegroundColor Green
    $Config = Get-Content $ConfigFile | ConvertFrom-Json
} else {
    Write-Host "Config introuvable. Creation automatique..." -ForegroundColor Yellow
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
    Write-Host "Config.json cree avec succes !" -ForegroundColor Green
}

# ---------------- FONCTIONS ----------------
function Write-Log($message, [string]$type = "INFO") {
    $timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
    $logEntry = "$timestamp - [$type] - $message"
    Add-Content -Path $LogFile -Value $logEntry
}

function Ensure-Dir($path) {
    if (-not (Test-Path $path)) { New-Item -ItemType Directory -Path $path | Out-Null }
}

function Show-Progress-Simple($current, $total, $title) {
    if ($total -eq 0) {
        Write-Host "`r[--] (0%) $title" -NoNewline
    } else {
        $plus = "+" * [math]::round($current * 10 / $total)
        $minus = "-" * (10 - $plus.Length)
        $percent = [math]::round($current * 100 / $total)
        Write-Host "`r[$plus$minus] ($percent%) $title" -NoNewline
    }
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
        
        $totalFiles = $files.Count
        $currentFile = 0

        Write-Host "Telechargement de $totalFiles fichiers..."
        
        foreach ($file in $files) {
            $currentFile++
            $fileName = [System.IO.Path]::GetFileName($file)
            $fileUrl  = "$ftpSource/$fileName"
            $destFile = Join-Path $localDest $fileName

            Write-Log "Debut du telechargement de $fileName..."
            
            try {
                $webclient = New-Object System.Net.WebClient
                $webclient.Credentials = New-Object System.Net.NetworkCredential("ftpuser","instance")
                $webclient.DownloadFile($fileUrl, $destFile)
                Write-Log "Telechargement de $fileName reussi."
            } catch {
                Write-Log "Erreur de telechargement : $fileUrl - Erreur: $($_.Exception.Message)" -type "ERREUR"
            }
            Show-Progress-Simple $currentFile $totalFiles "Telechargement"
        }
        Write-Host ""
    } catch {
        Write-Log "Impossible de lister le contenu de : $ftpSource - Erreur: $($_.Exception.Message)" -type "ERREUR"
        Write-Host "  Erreur de connexion FTP ! Verifiez le log pour plus de details." -ForegroundColor Red
    }
}

function Sync-Dir($sourceFolder, $destFolder) {
    Ensure-Dir $destFolder
    $sourceFiles = Get-ChildItem -Path $sourceFolder -File -Recurse
    $totalFiles = $sourceFiles.Count
    $currentFile = 0

    Write-Host "Copie de $totalFiles fichiers..."
    
    foreach ($file in $sourceFiles) {
        $currentFile++
        $relativePath = $file.FullName.Substring($sourceFolder.Length).TrimStart('\')
        $targetPath = Join-Path $destFolder $relativePath
        try {
            Copy-Item -LiteralPath $file.FullName -Destination $targetPath -Force
            Write-Log "Fichier copie : $file vers $targetPath"
        } catch {
            Write-Log "Impossible de copier $file.Name vers le client. Erreur: $($_.Exception.Message)" -type "ERREUR"
        }
        Show-Progress-Simple $currentFile $totalFiles "Copie"
    }
    Write-Host ""
}

function Remove-LFPContent($lfpSubFolder, $clientFolder) {
    if (-not (Test-Path $lfpSubFolder)) { 
        Write-Log "Dossier LFP non trouve, pas de suppression necessaire."
        return 
    }
    if (-not (Test-Path $clientFolder)) { 
        Write-Log "Dossier client non trouve, pas de suppression necessaire."
        return 
    }
    
    $lfpFiles = Get-ChildItem -LiteralPath $lfpSubFolder -Recurse -File

    if ($lfpFiles.Count -eq 0) {
        Write-Log "Aucun fichier a supprimer dans $lfpSubFolder."
        return
    }
    
    $totalFiles = $lfpFiles.Count
    $currentFile = 0

    Write-Host "Suppression de $totalFiles fichiers..."
    Write-Log "Debut de la suppression des fichiers de $lfpSubFolder"

    foreach ($lfpFile in $lfpFiles) {
        $currentFile++
        $fileName = $lfpFile.Name
        $clientFilePath = Join-Path $clientFolder $fileName
        
        if (Test-Path -LiteralPath $clientFilePath) {
            try {
                Remove-Item -LiteralPath $clientFilePath -Force -ErrorAction SilentlyContinue
                Write-Log "Supprime cote client : $clientFilePath"
            } catch {
                Write-Log "Impossible de supprimer $clientFilePath. Erreur: $($_.Exception.Message)" -type "ERREUR"
            }
        } else {
            Write-Log "Fichier non trouve a l'emplacement client : $clientFilePath"
        }
        Show-Progress-Simple $currentFile $totalFiles "Suppression"
    }
    Write-Host ""
}

function Clean-LFPFolder($lfpSubFolder) {
    if (Test-Path $lfpSubFolder) {
        Write-Host "  Nettoyage du cache LFP : $lfpSubFolder" -ForegroundColor Green
        Write-Log "Nettoyage du cache LFP : $lfpSubFolder"
        Remove-Item $lfpSubFolder -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# ---------------- API WEB ----------------
function Start-HttpServer {
    # Define a parameter for the port, with a default value of 8080
    param (
        [int]$Port = 8080
    )

    $prefix = "http://localhost:$Port/mid/"
    $listener = New-Object System.Net.HttpListener
    
    # Check if the chosen port requires administrator rights
    if ($Port -lt 1024 -and -not ([System.Security.Principal.WindowsPrincipal][System.Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Host "ATTENTION : Le serveur HTTP sur le port $Port (ou un port inferieur a 1024) requiert des droits d'administrateur." -ForegroundColor Red
        Write-Host "Veuillez relancer le script en tant qu'administrateur." -ForegroundColor Red
        return
    }

    try {
        $listener.Prefixes.Add($prefix)
        # Add a prefix for serving the HTML file
        $listener.Prefixes.Add("http://localhost:$Port/")
        
        Write-Host "Demarrage du serveur HTTP sur http://localhost:$Port/ ..." -ForegroundColor Yellow
        Write-Log "Demarrage du serveur HTTP sur le port $Port"
        $listener.Start()
        
        while ($true) {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $urlPath = $request.Url.LocalPath
            Write-Log "Requete reçue pour : $urlPath"
            
            # Traite la requête pour le fichier HTML
            if ($urlPath -eq "/" -or $urlPath -eq "C:\e-cde\MID\depots.html") {
                try {
                    $htmlContent = Get-Content "C:\e-cde\MID\depots.html" -Raw -Encoding UTF8
                    $response.StatusCode = 200
                    $response.ContentType = "text/html"
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($htmlContent)
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } catch {
                    $response.StatusCode = 404
                    $htmlContent = "<html><body><h1>404 - Fichier non trouve</h1></body></html>"
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($htmlContent)
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
                $response.OutputStream.Close()
                continue
            }
            
            # Traite les requêtes pour les actions MID
            $pathSegments = $request.Url.Segments | Where-Object { $_ -ne "/" }
            
            if ($pathSegments.Count -lt 3) {
                $result = @{
                    success = $false
                    message = "URL de la requete invalide. Format attendu : /mid/<action>/<type>/<nom>"
                }
                $jsonResponse = $result | ConvertTo-Json
                $response.ContentType = "application/json; charset=utf-8"
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.OutputStream.Close()
                continue
            }
            
            $action = $pathSegments[1].TrimEnd('/')
            $sourceType = $pathSegments[2].TrimEnd('/')
            $sourceName = $null
            if ($pathSegments.Count -gt 3) {
                $sourceName = $pathSegments[3].TrimEnd('/')
            }
            Write-Log "Requete recu : Action=$action, Type=$sourceType, Nom=$sourceName"
            
            $result = @{
                success = $false
                message = "Action non reconnue."
            }
            
            switch ($action) {
                "install" {
                    if ($sourceType -eq "server" -or $sourceType -eq "modpack") {
                        if ([string]::IsNullOrEmpty($sourceName)) {
                            $result.message = "Le nom du $sourceType est requis pour l'installation."
                        } else {
                            Install-Content -sourceType $sourceType -sourceName $sourceName
                            $result.success = $true
                            $result.message = "$sourceType $sourceName installe avec succes !"
                        }
                    } else {
                        Install-Content -sourceType $sourceType -sourceName $sourceName
                        $result.success = $true
                        $result.message = "$sourceType $sourceName installe avec succes !"
                    }
                }
                "remove" {
                    if ($sourceType -eq "server" -or $sourceType -eq "modpack") {
                        if ([string]::IsNullOrEmpty($sourceName)) {
                            $result.message = "Le nom du $sourceType est requis pour la suppression."
                        } else {
                            Remove-Content -sourceType $sourceType -sourceName $sourceName
                            $result.success = $true
                            $result.message = "$sourceType $sourceName supprime avec succes !"
                        }
                    } else {
                        Remove-Content -sourceType $sourceType -sourceName $sourceName
                        $result.success = $true
                        $result.message = "$sourceType $sourceName supprime avec succes !"
                    }
                }
                "update" {
                    if ($sourceType -eq "server" -or $sourceType -eq "modpack") {
                        if ([string]::IsNullOrEmpty($sourceName)) {
                            $result.message = "Le nom du $sourceType est requis pour la mise a jour."
                        } else {
                            Update-Content -sourceType $sourceType -sourceName $sourceName
                            $result.success = $true
                            $result.message = "$sourceType $sourceName mis a jour avec succes !"
                        }
                    } else {
                        Update-Content -sourceType $sourceType -sourceName $sourceName
                        $result.success = $true
                        $result.message = "$sourceType $sourceName mis a jour avec succes !"
                    }
                }
                default {
                    Write-Log "Action invalide : $action" -type "ERREUR"
                }
            }
            
            $jsonResponse = $result | ConvertTo-Json
            $response.ContentType = "application/json; charset=utf-8"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
        }
    } finally {
        $listener.Close()
    }
}

# ---------------- ACTIONS ----------------
function Install-Content($sourceType, $sourceName) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Write-Host "-> Installation de $sourceType $sourceName..." -ForegroundColor Cyan
    Write-Log "Debut de l'installation de $sourceType $sourceName"
    $types = @("mods","shaderpacks","resourcepacks")
    foreach ($type in $types) {
        $ftpPath = "ftp://ftpuser:instance@51.77.140.39/$sourceType/$sourceName/$type"
        $lfpPath = Join-Path $LFPFolder "$sourceType\$sourceName\$type"
        Download-FTP $ftpPath $lfpPath
        Sync-Dir $lfpPath $Config.$type
    }
    $sw.Stop()
    $elapsed = $sw.Elapsed
    $timeString = "Temps ecoule : " + $elapsed.ToString("hh\:mm\:ss")
    Write-Log "Installation de $sourceType $sourceName terminee. $timeString"
    Write-Host "OK $sourceType $sourceName installe avec succes ! ($timeString)" -ForegroundColor Green
}

function Remove-Content($sourceType, $sourceName) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Write-Host "-> Suppression de $sourceType $sourceName..." -ForegroundColor Cyan
    Write-Log "Debut de la suppression de $sourceType $sourceName"
    $types = @("mods","shaderpacks","resourcepacks")
    foreach ($type in $types) {
        $lfpPath = Join-Path $LFPFolder "$sourceType\$sourceName\$type"
        $clientPath = $Config.$type
        Remove-LFPContent $lfpPath $clientPath
    }
    foreach ($type in $types) {
        $lfpPath = Join-Path $LFPFolder "$sourceType\$sourceName\$type"
        Clean-LFPFolder $lfpPath
    }
    $sw.Stop()
    $elapsed = $sw.Elapsed
    $timeString = "Temps ecoule : " + $elapsed.ToString("hh\:mm\:ss")
    Write-Log "Suppression de $sourceType $sourceName terminee. $timeString"
    Write-Host "OK $sourceType $sourceName supprime avec succes ! ($timeString)" -ForegroundColor Green
}

function Update-Content($sourceType, $sourceName) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Write-Host "-> Mise a jour de $sourceType $sourceName..." -ForegroundColor Cyan
    Write-Log "Debut de la mise a jour de $sourceType $sourceName"
    Remove-Content -sourceType $sourceType -sourceName $sourceName
    Install-Content -sourceType $sourceType -sourceName $sourceName
    $sw.Stop()
    $elapsed = $sw.Elapsed
    $timeString = "Temps ecoule : " + $elapsed.ToString("hh\:mm\:ss")
    Write-Log "Mise a jour de $sourceType $sourceName terminee. $timeString"
    Write-Host "OK $sourceType $sourceName mis a jour avec succes ! ($timeString)" -ForegroundColor Green
}

# ---------------- MENU ----------------
while ($true) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "  * Gestionnaire MID - MENU *" -ForegroundColor White
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Gerer la base de mods" -ForegroundColor Yellow
    Write-Host "     1. Installer la Base" -ForegroundColor Green
    Write-Host "     2. Supprimer la Base" -ForegroundColor Red
    Write-Host "     3. Mettre a jour la Base" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "   Gerer les serveurs" -ForegroundColor Yellow
    Write-Host "     4. Installer un Serveur" -ForegroundColor Green
    Write-Host "     5. Supprimer un Serveur" -ForegroundColor Red
    Write-Host "     6. Mettre a jour un Serveur" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "   Gerer les modpacks" -ForegroundColor Yellow
    Write-Host "     7. Installer un Modpack" -ForegroundColor Green
    Write-Host "     8. Supprimer un Modpack" -ForegroundColor Red
    Write-Host "     9. Mettre a jour un Modpack" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "   Outils avance" -ForegroundColor Yellow
    Write-Host "     A. Demarrer le serveur HTTP" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Quitter" -ForegroundColor Yellow
    Write-Host "     0. Quitter l'application" -ForegroundColor Gray
    Write-Host "================================" -ForegroundColor Cyan

    $choice = Read-Host "Choisissez une option (0-9, A)"
    Write-Log "Option choisie : $choice"

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
        "7" {
            $modpackName = Read-Host "Nom du modpack"
            Install-Content -sourceType "modpack" -sourceName $modpackName
        }
        "8" {
            $modpackName = Read-Host "Nom du modpack"
            Remove-Content -sourceType "modpack" -sourceName $modpackName
        }
        "9" {
            $modpackName = Read-Host "Nom du modpack"
            Update-Content -sourceType "modpack" -sourceName $modpackName
        }
        "A" { Start-HttpServer }
        "0" {
            Write-Host "Fermeture de l'application."
            exit
        }
        default { 
            Write-Host "Option invalide ! Veuillez reessayer." -ForegroundColor Yellow
            Write-Log "Option invalide choisie." -type "ATTENTION"
        }
    }
}
