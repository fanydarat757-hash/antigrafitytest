@echo off
chcp 65001 >nul
title SISTEM INFORMASI PERPUSTAKAAN SMA MUHAMMADIYAH 1 PEKALONGAN
color 0A

echo =========================================================================
echo    SISTEM INFORMASI PERPUSTAKAAN SMA MUHAMMADIYAH 1 PEKALONGAN
echo    Lampung Timur - React.js + PHP RESTful API + MySQL
echo =========================================================================
echo.

:: 1. Cek & Aktifkan MySQL XAMPP jika belum aktif
echo [1/3] Memeriksa Layanan Database MySQL...
netstat -ano | findstr "LISTENING" | findstr ":3306" >nul
if errorlevel 1 (
    echo [*] Database MySQL belum menyala. Mengaktifkan MySQL XAMPP...
    cd /d "C:\xampp"
    start "" /b cmd /c "mysql_start.bat"
    ping 127.0.0.1 -n 4 >nul
    echo [*] Database MySQL aktif.
) else (
    echo [*] Database MySQL sudah aktif di port 3306.
)
echo.

:: 2. Cek & Jalankan Backend API PHP di Port 8000
echo [2/3] Memeriksa Backend RESTful API PHP...
netstat -ano | findstr "LISTENING" | findstr ":8000" >nul
if errorlevel 1 (
    echo [*] Menyalakan Backend PHP API di port 8000...
    start "Perpus_Backend_PHP" /min "C:\xampp\php\php.exe" -S 127.0.0.1:8000 -t "%~dp0backend\public"
    ping 127.0.0.1 -n 3 >nul
    echo [*] Backend PHP API aktif.
) else (
    echo [*] Backend PHP API sudah aktif di port 8000.
)
echo.

:: 3. Cek & Jalankan Frontend React Vite di Port 3000
echo [3/3] Memeriksa Frontend Web React...
netstat -ano | findstr "LISTENING" | findstr ":3000" >nul
if errorlevel 1 (
    echo [*] Menyalakan Frontend React di port 3000...
    cd /d "%~dp0frontend"
    start "Perpus_Frontend_Vite" /min cmd /c "npm run dev"
    ping 127.0.0.1 -n 4 >nul
    echo [*] Frontend React aktif.
) else (
    echo [*] Frontend React sudah aktif di port 3000.
)
echo.

:: 4. Buka Browser Otomatis
echo [*] Membuka web perpustakaan di browser default...
ping 127.0.0.1 -n 2 >nul
start http://localhost:3000

echo.
echo =========================================================================
echo   [SUKSES] APLIKASI AKTIF DAN SIAP DIGUNAKAN!
echo   - Alamat Web Utama : http://localhost:3000
echo   - phpMyAdmin       : http://localhost/phpmyadmin
echo =========================================================================
echo.
echo   AKUN PENGUJIAN LOGIN:
echo   1. Kepala Perpustakaan : admin    / admin123  (Siti Farida, A.Md)
echo   2. Petugas Sirkulasi   : petugas2 / petugas123 (Samsul Arifin, S.Pd)
echo   3. Kepala Sekolah      : kepsek   / kepsek123  (Ahmad Marzuki, S.Pd.I)
echo   4. Siswa / Anggota     : 2024001  / siswa123   (Ahmad Fauzi)
echo.
echo =========================================================================
echo   Jendela ini boleh dibiarkan terbuka selama menggunakan aplikasi.
echo   Ketik 'k' lalu ENTER jika ingin mematikan semua server.
echo =========================================================================
set /p opt="Pilihan (Tekan ENTER untuk tetap menjalankan sistem): "

if /i "%opt%"=="k" (
    echo.
    echo [*] Menghentikan server backend dan frontend...
    taskkill /f /fi "WINDOWTITLE eq Perpus_Backend_PHP*" >nul 2>&1
    taskkill /f /fi "WINDOWTITLE eq Perpus_Frontend_Vite*" >nul 2>&1
    echo [*] Server telah dihentikan.
    pause
)
