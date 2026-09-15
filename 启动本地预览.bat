@echo off
chcp 65001 >nul
rem 浩涛工作室 · 本地预览：启动后访问 http://localhost:8765/
cd /d "%~dp0"
start "" http://localhost:8765/
python -m http.server 8765
