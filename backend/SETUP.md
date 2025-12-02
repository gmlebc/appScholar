# AppScholar Backend - Configuração do PostgreSQL

## ✅ Status da Instalação

- **PostgreSQL:** 18.1 instalado em `C:\Program Files\PostgreSQL\18`
- **Banco de dados:** `bd_appscholar` criado com sucesso
- **Usuário padrão:** teste@teste.com (senha: 123123)

## 🚀 Scripts Automatizados

### 📜 Scripts Disponíveis:

#### 1️⃣ **`create-database.ps1`** - Criar Banco de Dados
Cria o banco `bd_appscholar` do zero com encoding UTF-8.
```powershell
.\create-database.ps1
```
- Verifica se o banco já existe
- Pergunta confirmação antes de recriar (evita perda de dados)
- Encerra conexões ativas automaticamente

#### 2️⃣ **`populate-database.ps1`** - Popular Banco com Dados
Insere dados de exemplo (professores, alunos, disciplinas, notas).
```powershell
.\populate-database.ps1
```
- Limpa dados antigos antes de inserir novos
- Usa encoding UTF-8 (sem caracteres estranhos)
- Mostra resumo dos dados inseridos

#### 3️⃣ **`start-backend.ps1`** - Iniciar Servidor Backend
Inicia o servidor em modo desenvolvimento.
```powershell
.\start-backend.ps1
```
- Adiciona PostgreSQL ao PATH automaticamente
- Verifica e cria o banco se não existir
- Instala dependências se necessário
- Compila TypeScript automaticamente
- Hot-reload ativado (reinicia ao alterar código)

### 🎯 Ordem de Execução (Primeira Vez):

```powershell
# 1. Criar banco
.\create-database.ps1

# 2. Iniciar servidor (cria tabelas)
.\start-backend.ps1
# Aguarde "✅ Modelos sincronizados" e pressione Ctrl+C

# 3. Popular com dados
.\populate-database.ps1

# 4. Iniciar servidor novamente
.\start-backend.ps1
```

### 🔄 Uso Diário:

```powershell
# Apenas inicie o servidor
.\start-backend.ps1
```

### 🔧 Comandos Manuais (Alternativa)

Se preferir executar manualmente:
```powershell
$env:Path = $env:Path + ";C:\Program Files\PostgreSQL\18\bin"
npm run dev
```

### 📌 Adicionar PostgreSQL ao PATH Permanentemente
1. Abra as Configurações do Sistema (Win + Pause/Break)
2. Clique em "Configurações avançadas do sistema"
3. Clique em "Variáveis de Ambiente"
4. Em "Variáveis do sistema", selecione "Path" e clique em "Editar"
5. Adicione: `C:\Program Files\PostgreSQL\18\bin`
6. Clique em OK e reinicie o terminal

## 📊 Tabelas Criadas

- ✅ `usuarios` - Autenticação e perfis de usuários
- ✅ `alunos` - Cadastro de alunos
- ✅ `professores` - Cadastro de professores
- ✅ `disciplinas` - Disciplinas com professores
- ✅ `notas` - Notas dos alunos por disciplina

## 🔧 Correções Aplicadas

1. **Nome do banco de dados:** Corrigido de `bd_appScholar` para `bd_appscholar` (PostgreSQL é case-sensitive)
2. **Nomes das tabelas:** Adicionado `tableName` em todos os modelos para consistência
3. **Sincronização:** Alterado de `force: true` para `alter: true` para evitar perda de dados
4. **Arquivo index.ts:** Removida duplicação da chamada `initializeDatabase()`

## 📝 Endpoints Disponíveis

- `GET /api/health` - Status do servidor
- `POST /api/auth/login` - Login de usuários
- `GET/POST /api/alunos` - Gerenciar alunos
- `GET/POST /api/professores` - Gerenciar professores
- `GET/POST /api/disciplina` - Gerenciar disciplinas
- `GET/POST /api/nota` - Gerenciar notas
- `GET /api/boletim/:matricula` - Boletim do aluno

## 🔐 Credenciais do PostgreSQL

As credenciais estão configuradas no arquivo `.env`:
- **DB_NAME:** bd_appscholar
- **DB_USER:** postgres
- **DB_PASS:** 123
- **DB_HOST:** localhost
- **PORT:** 3000

## 🧪 Testar o Servidor

```powershell
# Verificar se o servidor está rodando
curl http://localhost:3000/api/health

# Verificar tabelas no PostgreSQL
$env:PGPASSWORD="123"; psql -U postgres -h localhost -d bd_appscholar -c "\dt"
```
