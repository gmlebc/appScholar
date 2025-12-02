# Script para iniciar o servidor backend AppScholar

Write-Host "🚀 Iniciando servidor backend AppScholar..." -ForegroundColor Cyan

# Adicionar PostgreSQL ao PATH
$env:Path = $env:Path + ";C:\Program Files\PostgreSQL\18\bin"

Write-Host "🔧 PostgreSQL adicionado ao PATH" -ForegroundColor Green

# Verificar se o banco de dados existe
$env:PGPASSWORD = "123"
$dbExists = psql -U postgres -h localhost -t -c "SELECT 1 FROM pg_database WHERE datname='bd_appscholar';"

if (-not ($dbExists -match "1")) {
    Write-Host "⚠️  Banco bd_appscholar não encontrado!" -ForegroundColor Yellow
    Write-Host "Criando banco de dados..." -ForegroundColor Cyan
    
    psql -U postgres -h localhost -c "CREATE DATABASE bd_appscholar ENCODING 'UTF8';"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Banco criado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao criar banco de dados!" -ForegroundColor Red
        exit 1
    }
}

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# Compilar TypeScript
Write-Host "🔨 Compilando TypeScript..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Servidor pronto para iniciar!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Informações do servidor:" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:3000" -ForegroundColor White
Write-Host "   Banco: bd_appscholar" -ForegroundColor White
Write-Host "   Modo: development" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Iniciando em modo desenvolvimento..." -ForegroundColor Yellow
Write-Host "   (O servidor reiniciará automaticamente ao detectar alterações)" -ForegroundColor Gray
Write-Host ""
Write-Host "⏹️  Pressione Ctrl+C para parar o servidor" -ForegroundColor Red
Write-Host ""

# Iniciar servidor em modo desenvolvimento
npm run dev
