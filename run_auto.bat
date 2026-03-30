@echo off

cd /d D:\rup-2026-inaproc

timeout /t 120 /nobreak

set LOGFILE=log.txt

echo ========================= >> %LOGFILE%
echo START %date% %time% >> %LOGFILE%

REM =========================
REM FIX GIT SAFE DIRECTORY
REM =========================
"C:\Program Files\Git\bin\git.exe" config --global --add safe.directory D:/rup-2026-inaproc >> %LOGFILE% 2>&1

REM =========================
REM DOWNLOAD DATA
REM =========================
echo DOWNLOAD DATA >> %LOGFILE%
C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File download.ps1 >> %LOGFILE% 2>&1

REM =========================
REM GENERATE REKAP (FULL PATH PYTHON)
REM =========================
echo GENERATE REKAP >> %LOGFILE%
"C:\Users\Rizki\AppData\Local\Programs\Python\Python311\python.exe" generate_rekap.py >> %LOGFILE% 2>&1

REM =========================
REM GIT PROCESS
REM =========================
echo GIT ADD >> %LOGFILE%
"C:\Program Files\Git\bin\git.exe" add . >> %LOGFILE% 2>&1

echo GIT COMMIT >> %LOGFILE%
"C:\Program Files\Git\bin\git.exe" commit -m "auto update %date% %time%" >> %LOGFILE% 2>&1

echo GIT PULL >> %LOGFILE%
"C:\Program Files\Git\bin\git.exe" pull origin main --rebase >> %LOGFILE% 2>&1

echo GIT PUSH >> %LOGFILE%
"C:\Program Files\Git\bin\git.exe" push origin main >> %LOGFILE% 2>&1

echo SELESAI %date% %time% >> %LOGFILE%
echo ========================= >> %LOGFILE%

exit