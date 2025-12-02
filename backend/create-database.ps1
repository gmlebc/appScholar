# Script para criar o banco de dados bd_appscholar
# Executar como administrador do PostgreSQL

Write-Host "🔧 Criando banco de dados bd_appscholar..." -ForegroundColor Cyan

# Adicionar PostgreSQL ao PATH
$env:Path = $env:Path + ";C:\Program Files\PostgreSQL\18\bin"

# Configurar senha do PostgreSQL
$env:PGPASSWORD = "123"

# Verificar se o banco já existe
$dbExists = psql -U postgres -h localhost -t -c "SELECT 1 FROM pg_database WHERE datname='bd_appscholar';"

if ($dbExists -match "1") {
    Write-Host "⚠️  Banco bd_appscholar já existe!" -ForegroundColor Yellow
    $resposta = Read-Host "Deseja recriar o banco? Todos os dados serão perdidos! (s/N)"
    
    if ($resposta -eq "s" -or $resposta -eq "S") {
        Write-Host "🗑️  Removendo banco existente..." -ForegroundColor Red
        
        # Encerrar conexões ativas
        psql -U postgres -h localhost -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'bd_appscholar' AND pid <> pg_backend_pid();"
        
        # Dropar banco
        psql -U postgres -h localhost -c "DROP DATABASE bd_appscholar;"
        
        # Criar banco novamente
        psql -U postgres -h localhost -c "CREATE DATABASE bd_appscholar ENCODING 'UTF8';"
        Write-Host "✅ Banco bd_appscholar recriado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Operação cancelada." -ForegroundColor Red
        exit
    }
} else {
    # Criar banco novo
    psql -U postgres -h localhost -c "CREATE DATABASE bd_appscholar ENCODING 'UTF8';"
    Write-Host "✅ Banco bd_appscholar criado com sucesso!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📊 Informações do banco:" -ForegroundColor Cyan
psql -U postgres -h localhost -c "\l bd_appscholar"

Write-Host ""
Write-Host "🎯 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute .\start-backend.ps1 para iniciar o servidor backend"
Write-Host "2. O servidor criará automaticamente as tabelas"
Write-Host "3. Execute .\populate-database.ps1 para popular com dados de exemplo"
