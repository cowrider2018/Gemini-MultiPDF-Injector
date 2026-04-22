@echo off
:: 1. 建立虛擬環境 (如果不存在的話)
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

:: 2. 進入資料夾並安裝套件
:: 注意：在 .bat 中我們通常直接呼叫虛擬環境內的 pip，不需要先 "activate"
echo Upgrading pip and installing requirements...
cd server
..\.venv\Scripts\python.exe -m pip install --upgrade pip
..\.venv\Scripts\python.exe -m pip install -r requirements.txt

:: 3. 執行 Python 程式
echo Starting PDF Server...
..\.venv\Scripts\python.exe pdf_server.py

pause