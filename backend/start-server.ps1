# Script para iniciar o servidor backend com PostgreSQL no PATH
# Adiciona PostgreSQL ao PATH temporariamente para esta sessão
$env:Path = $env:Path + ";C:\Program Files\PostgreSQL\18\bin"

Write-Host "🔧 PostgreSQL adicionado ao PATH" -ForegroundColor Green
Write-Host "🚀 Iniciando servidor AppScholar..." -ForegroundColor Cyan

# Inicia o servidor em modo desenvolvimento
npm run dev
