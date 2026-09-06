@echo off
title Anastasia Kh. - Domain Setup
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup_domain.ps1"
pause
