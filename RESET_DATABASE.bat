@echo off
chcp 65001 >nul
title RESET BASIS DATA SKRIPSI PERPUSTAKAAN
color 0C

echo =========================================================================
echo    RESET BASIS DATA PERPUSTAKAAN SMA MUHAMMADIYAH PEKALONGAN
echo =========================================================================
echo.
echo PERINGATAN: Tindakan ini akan mengembalikan seluruh data buku, peminjaman,
echo pengembalian, denda, dan akun demo ke kondisi awal skripsi.
echo.
set /p confirm="Apakah Anda yakin ingin mereset basis data? (Ketik Y untuk Ya): "
if /i "%confirm%" neq "Y" (
    echo.
    echo [*] Reset basis data dibatalkan.
    ping 127.0.0.1 -n 2 >nul
    exit /b
)

echo.
echo [*] Mereset tabel dan memuat data awal dari backend\database\skripsi_perpus.sql...
"C:\xampp\mysql\bin\mysql.exe" -u root < "%~dp0backend\database\skripsi_perpus.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =========================================================================
    echo  [SUKSES] Basis data berhasil dikembalikan ke kondisi default!
    echo =========================================================================
) else (
    echo.
    echo [ERROR] Gagal mereset database. Pastikan modul MySQL di XAMPP menyala.
)

echo.
pause

