# Script para popular o banco de dados com dados de exemplo

Write-Host "📊 Populando banco de dados bd_appscholar..." -ForegroundColor Cyan

# Adicionar PostgreSQL ao PATH
$env:Path = $env:Path + ";C:\Program Files\PostgreSQL\18\bin"

# Configurar senha do PostgreSQL
$env:PGPASSWORD = "123"

# Configurar codificação UTF-8
chcp 65001 | Out-Null

# Verificar se o banco existe
$dbExists = psql -U postgres -h localhost -t -c "SELECT 1 FROM pg_database WHERE datname='bd_appscholar';"

if (-not ($dbExists -match "1")) {
    Write-Host "❌ Banco bd_appscholar não encontrado!" -ForegroundColor Red
    Write-Host "Execute .\create-database.ps1 primeiro." -ForegroundColor Yellow
    exit 1
}

# Verificar se as tabelas existem
$tabelasExistem = psql -U postgres -h localhost -d bd_appscholar -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"

if ($tabelasExistem -match "0") {
    Write-Host "⚠️  Nenhuma tabela encontrada!" -ForegroundColor Yellow
    Write-Host "Inicie o servidor backend primeiro para criar as tabelas automaticamente." -ForegroundColor Yellow
    Write-Host "Execute: .\start-backend.ps1" -ForegroundColor Cyan
    exit 1
}

Write-Host "🗑️  Limpando dados antigos..." -ForegroundColor Yellow

# Executar script de população
$scriptPath = Join-Path $PSScriptRoot "src\populate.sql"

if (-not (Test-Path $scriptPath)) {
    Write-Host "❌ Arquivo populate.sql não encontrado em src\populate.sql" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Executando script populate.sql..." -ForegroundColor Cyan
psql -U postgres -h localhost -d bd_appscholar -f $scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Banco populado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Resumo dos dados inseridos:" -ForegroundColor Cyan
    
    # Mostrar contagem de registros
    psql -U postgres -h localhost -d bd_appscholar -c "SELECT 'Usuários' as tabela, COUNT(*) as total FROM usuarios UNION ALL SELECT 'Professores', COUNT(*) FROM professores UNION ALL SELECT 'Alunos', COUNT(*) FROM alunos UNION ALL SELECT 'Disciplinas', COUNT(*) FROM disciplinas UNION ALL SELECT 'Notas', COUNT(*) FROM notas;"
    
    Write-Host ""
    Write-Host "🔐 Credenciais de acesso:" -ForegroundColor Yellow
    Write-Host "Admin: teste@teste.com / 123123" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Erro ao popular o banco de dados!" -ForegroundColor Red
    exit 1
}
