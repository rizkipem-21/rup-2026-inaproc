@echo off  
setlocal enabledelayedexpansion
cd /d D:\rup-2026-inaproc

echo ========================= >> log.txt
echo START %date% %time% >> log.txt

echo DOWNLOAD DATA >> log.txt
powershell -ExecutionPolicy Bypass -File download.ps1 >> log.txt 2>&1

echo GENERATE REKAP >> log.txt
python generate_rekap.py

echo GENERATE EXCEL >> log.txt
python generate_excel.py

:: FORMAT TANGGAL
for /f "tokens=1-3 delims=/ " %%a in ("%date%") do (
    set dd=%%a
    set mm=%%b
    set yyyy=%%c
)

set bulan=
if "%mm%"=="01" set bulan=Januari
if "%mm%"=="02" set bulan=Februari
if "%mm%"=="03" set bulan=Maret
if "%mm%"=="04" set bulan=April
if "%mm%"=="05" set bulan=Mei
if "%mm%"=="06" set bulan=Juni
if "%mm%"=="07" set bulan=Juli
if "%mm%"=="08" set bulan=Agustus
if "%mm%"=="09" set bulan=September
if "%mm%"=="10" set bulan=Oktober
if "%mm%"=="11" set bulan=November
if "%mm%"=="12" set bulan=Desember

for /f "tokens=1-2 delims=:." %%a in ("%time%") do (
    set hh=%%a
    set mn=%%b
)

set hh=!hh: =!

echo UPDATE LAST-UPDATE >> log.txt
echo !dd! !bulan! !yyyy! ^| !hh!.!mn! WIB > data\last-update.txt

echo GIT CONFIG >> log.txt
git config user.name "rizkipem-21"
git config user.email "rizki.pem@gmail.com"

echo GIT STATUS >> log.txt
git status >> log.txt 2>&1

:: FIX LOCK
del /f /q .git\index.lock >nul 2>&1

echo GIT ADD >> log.txt
git add . >> log.txt 2>&1
git add output/ >> log.txt 2>&1

echo GIT COMMIT >> log.txt
git commit -m "auto update %date% %time%" >> log.txt 2>&1

echo GIT PUSH >> log.txt
git push origin main >> log.txt 2>&1

echo PUSH STATUS: %ERRORLEVEL% >> log.txt

echo ========================= >> log.txt
echo SELESAI %date% %time% >> log.txt