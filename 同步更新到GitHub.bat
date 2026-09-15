@echo off
chcp 65001 >nul
rem 浩涛工作室 · 一键同步：提交并推送全部改动到 GitHub
cd /d "%~dp0"
git add -A
git commit -m "更新网站 %date% %time:~0,5%"
git push
echo.
echo 已推送，约 1 分钟后线上生效：https://jhtfly.github.io/
pause
