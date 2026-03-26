@echo off
cd /d D:\rup-2026-inaproc

echo =========================
echo DOWNLOAD DATA INAPROC
echo =========================
powershell -ExecutionPolicy Bypass -File download.ps1

echo.
echo =========================
echo GENERATE REKAP
echo =========================
python generate_rekap.py

echo.
echo =========================
echo PUSH KE GITHUB
echo =========================

git add .
git commit -m "auto update %date% %time%" || echo no changes
git push

echo.
echo SELESAI
pause