$ws = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')

# 1. Desktop .url Shortcut
$urlPath = Join-Path $desktop "Buka Perpustakaan Web.url"
@'
[InternetShortcut]
URL=http://localhost:3000
IconIndex=0
IconFile=C:\Windows\System32\shell32.dll
'@ | Out-File -FilePath $urlPath -Encoding ascii

# 2. Desktop .lnk Launcher
$lnkPath = Join-Path $desktop "Jalankan Perpustakaan SMA Muhammadiyah.lnk"
$shortcut = $ws.CreateShortcut($lnkPath)
$shortcut.TargetPath = "c:\semester 5\basis data lanjut\skripsi_perpus\JALANKAN_PERPUSTAKAAN.bat"
$shortcut.WorkingDirectory = "c:\semester 5\basis data lanjut\skripsi_perpus"
$shortcut.Description = "Sistem Informasi Perpustakaan SMA Muhammadiyah 1 Pekalongan"
$shortcut.IconLocation = "shell32.dll,13"
$shortcut.Save()

Write-Host "SHORTCUTS CREATED ON DESKTOP SUCCESSFULLY"

