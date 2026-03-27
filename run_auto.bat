@echo off
cd /d D:\rup-2026-inaproc

echo ========================= >> log.txt
echo START %date% %time% >> log.txt

echo DOWNLOAD DATA >> log.txt
powershell -ExecutionPolicy Bypass -File download.ps1 >> log.txt 2>&1

echo. >> log.txt
echo GENERATE REKAP >> log.txt
python generate_rekap.py >> log.txt 2>&1

echo. >> log.txt
echo PUSH KE GITHUB >> log.txt

git add . >> log.txt 2>&1

git commit -m "auto update %date% %time% WIB" --allow-empty >> log.txt 2>&1

git push origin main >> log.txt 2>&1

echo. >> log.txt
echo DONE %date% %time% >> log.txt
echo ========================= >> log.txt