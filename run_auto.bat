@echo off
cd /d D:\rup-2026-inaproc

echo ========================= >> log.txt
echo START %date% %time% >> log.txt

echo DOWNLOAD DATA >> log.txt
powershell -ExecutionPolicy Bypass -File download.ps1 >> log.txt 2>&1

echo GENERATE REKAP >> log.txt
"C:\Users\rizki\AppData\Local\Programs\Python\Python314\python.exe" generate_rekap.py >> log.txt 2>&1

echo GIT CONFIG >> log.txt
git config user.name "rizkipem-21"
git config user.email "rizki.pem@gmail.com"

echo GIT ADD >> log.txt
git add . >> log.txt 2>&1

echo GIT COMMIT >> log.txt
git commit -m "auto update %date% %time%" >> log.txt 2>&1

echo GIT PUSH >> log.txt
git push origin main >> log.txt 2>&1

echo SELESAI %date% %time% >> log.txt
echo ========================= >> log.txt