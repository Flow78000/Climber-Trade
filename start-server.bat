@echo off
title Climber Trade — Serveur Local
echo.
echo  =========================================
echo   CLIMBER TRADE — Serveur Local Port 8090
echo  =========================================
echo.
echo  Dossier : %~dp0src\html
echo  URL     : http://localhost:8090
echo  Index   : http://localhost:8090/project-index.html
echo.
echo  Fermer cette fenetre pour arreter le serveur.
echo.
cd /d "%~dp0"
python -m http.server 8090 --directory src\html
pause
