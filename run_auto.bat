@echo off
setlocal

cd /d D:\rup-2026-inaproc

echo ========================= >> log.txt
echo START %date% %time% >> log.txt

echo DOWNLOAD DATA >> log.txt
powershell -ExecutionPolicy Bypass -File download.ps1 >> log.txt 2>&1

echo GENERATE REKAP >> log.txt
"C:\Users\Rizki FN LPSE Kab. Kotawaringin Barat\AppData\Local\Programs\Python\Python311\python.exe" generate_rekap.py >> log.txt 2>&1

echo GIT CONFIG >> log.txt
git config --global --add safe.directory D:/rup-2026-inaproc >> log.txt 2>&1

echo GIT ADD >> log.txt
git add . >> log.txt 2>&1

echo GIT COMMIT >> log.txt
git commit -m "auto update %date% %time%" >> log.txt 2>&1

echo GIT PUSH >> log.txt
git push >> log.txt 2>&1

echo SELESAI %date% %time% >> log.txt
echo ========================= >> log.txt