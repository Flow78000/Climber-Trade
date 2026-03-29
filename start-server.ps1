# Climber Trade — Démarrage serveur local
$Port = 8090
$Dir = Join-Path $PSScriptRoot "src\html"

Write-Host ""
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host "   CLIMBER TRADE — Serveur Local Port $Port" -ForegroundColor Cyan
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Dossier : $Dir" -ForegroundColor Gray
Write-Host "  URL     : http://localhost:$Port" -ForegroundColor Green
Write-Host "  Index   : http://localhost:$Port/project-index.html" -ForegroundColor Green
Write-Host ""
Write-Host "  Ctrl+C pour arreter le serveur." -ForegroundColor Yellow
Write-Host ""

# Ouvrir le navigateur apres 1 seconde
Start-Job -ScriptBlock {
    Start-Sleep 1
    Start-Process "http://localhost:8090/project-index.html"
} | Out-Null

# Demarrer le serveur
Set-Location $PSScriptRoot
python -m http.server $Port --directory $Dir
