# ---------- CONFIG ----------
$folder = "C:\e-cde\MID"
$pyFile = Join-Path $folder "mid.py"
$iconFile = Join-Path $folder "icon.ico"
$urlCode = "https://enes-cde.vercel.app/data/MID_MC/main.txt"
$urlIcon = "https://enes-cde.vercel.app/data/MID_MC/icon.ico"
$pythonInstaller = "https://www.python.org/ftp/python/3.12.5/python-3.12.5-amd64.exe"  # version stable

# ---------- CREATION DOSSIER ----------
if (-not (Test-Path $folder)) {
    New-Item -ItemType Directory -Path $folder | Out-Null
    Write-Host "Dossier $folder créé."
}

# ---------- TELECHARGEMENT CODE ----------
Invoke-WebRequest -Uri $urlCode -OutFile $pyFile -UseBasicParsing
Write-Host "Code récupéré et enregistré sous $pyFile"

# ---------- TELECHARGEMENT ICON ----------
Invoke-WebRequest -Uri $urlIcon -OutFile $iconFile -UseBasicParsing
Write-Host "Icône téléchargée sous $iconFile"

# ---------- INSTALL PYTHON ----------
$tempInstaller = Join-Path $env:TEMP "python-installer.exe"
Invoke-WebRequest -Uri $pythonInstaller -OutFile $tempInstaller -UseBasicParsing
Write-Host "Téléchargement de Python terminé."

# Installation silencieuse de Python
Start-Process -FilePath $tempInstaller -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1 Include_test=0" -Wait
Write-Host "Python installé."

# ---------- CREATION RACCOURCI ----------
$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut("$env:Public\Desktop\MID.lnk")
$shortcut.TargetPath = "python.exe"
$shortcut.Arguments = "`"$pyFile`""
$shortcut.WorkingDirectory = $folder
$shortcut.IconLocation = $iconFile
$shortcut.Save()

Write-Host "Raccourci créé sur le bureau : MID.lnk"
