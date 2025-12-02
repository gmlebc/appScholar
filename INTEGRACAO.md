# 🚀 AppScholar - Integração Frontend & Backend

## ✅ Status Atual

### Backend (rodando)
- **URL:** http://10.42.171.185:3000
- **Porta:** 3000
- **Banco:** bd_appscholar conectado
- **Credenciais Admin:** teste@teste.com / 123123

### Frontend (rodando)
- **URL:** exp://10.42.171.185:8081
- **Framework:** React Native + Expo
- **API configurada:** http://10.42.171.185:3000/api

## 📱 Como Testar a Aplicação

### Opção 1: Expo Go (Recomendado para teste)
1. **Instale o Expo Go no celular:**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Escaneie o QR Code:**
   - Abra o Expo Go no celular
   - Escaneie o QR Code que aparece no terminal
   - ⚠️ **IMPORTANTE:** Celular e PC devem estar na mesma rede Wi-Fi

3. **Login:**
   - Email: `teste@teste.com`
   - Senha: `123123`

### Opção 2: Emulador Android
No terminal do frontend, pressione `a` para abrir no emulador Android (se instalado)

### Opção 3: Web (limitado)
No terminal do frontend, pressione `w` para abrir no navegador

## 🔧 Configurações Importantes

### IP da Máquina
**IP Atual:** `10.42.171.185`

Se o IP mudar, atualize em:
1. **Frontend:** `frontend/src/services/api.ts`
   ```typescript
   baseURL: "http://SEU_IP:3000/api"
   ```

2. **Backend:** `backend/src/types/server.ts`
   ```typescript
   origin: ['exp://SEU_IP:8081', 'http://SEU_IP:19006']
   ```

## 🎯 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/login` - Login de usuários
- `POST /api/auth/register` - Registro de novos usuários

### Alunos
- `GET /api/alunos` - Listar alunos
- `POST /api/alunos` - Cadastrar aluno
- `GET /api/alunos/:id` - Buscar aluno por ID
- `PUT /api/alunos/:id` - Atualizar aluno
- `DELETE /api/alunos/:id` - Deletar aluno

### Professores
- `GET /api/professores` - Listar professores
- `POST /api/professores` - Cadastrar professor
- `GET /api/professores/:id` - Buscar professor por ID
- `PUT /api/professores/:id` - Atualizar professor
- `DELETE /api/professores/:id` - Deletar professor

### Disciplinas
- `GET /api/disciplina` - Listar disciplinas
- `POST /api/disciplina` - Cadastrar disciplina
- `GET /api/disciplina/:id` - Buscar disciplina por ID
- `PUT /api/disciplina/:id` - Atualizar disciplina
- `DELETE /api/disciplina/:id` - Deletar disciplina

### Notas
- `GET /api/nota` - Listar notas
- `POST /api/nota` - Cadastrar nota
- `GET /api/nota/:id` - Buscar nota por ID
- `PUT /api/nota/:id` - Atualizar nota
- `DELETE /api/nota/:id` - Deletar nota

### Boletim
- `GET /api/boletim/:matricula` - Buscar boletim por matrícula do aluno

## 🐛 Troubleshooting

### Erro de Conexão no App
- Verifique se PC e celular estão na mesma rede Wi-Fi
- Verifique se o firewall não está bloqueando as portas 3000 e 8081
- Confirme o IP correto em `api.ts`

### Backend não conecta ao PostgreSQL
```powershell
# Execute no terminal do backend:
$env:Path = $env:Path + ";C:\Program Files\PostgreSQL\18\bin"
npm run dev
```

### Frontend não inicia
```powershell
# Limpe o cache e reinstale:
cd frontend
npm install
npx expo start -c
```

## 📝 Comandos Úteis

### 🔧 Scripts Automatizados Backend

#### Criar Banco de Dados
```powershell
cd backend
.\create-database.ps1
```

#### Popular Banco com Dados
```powershell
cd backend
.\populate-database.ps1
```

#### Iniciar Backend
```powershell
cd backend
.\start-backend.ps1
```

### 📱 Iniciar Frontend
```powershell
cd frontend
npm start
```

### 🗄️ Comandos PostgreSQL Diretos

#### Ver logs do PostgreSQL
```powershell
$env:PGPASSWORD="123"
psql -U postgres -h localhost -d bd_appscholar
```

#### Verificar tabelas
```sql
\dt  -- listar tabelas
SELECT * FROM usuarios;  -- ver usuários
SELECT * FROM alunos;  -- ver alunos
SELECT * FROM professores;  -- ver professores
SELECT * FROM disciplinas;  -- ver disciplinas
SELECT * FROM notas;  -- ver notas
```

#### Resetar Dados
```powershell
cd backend
.\populate-database.ps1
```

## 🎨 Próximos Passos

1. ✅ Testar login no app
2. ✅ Cadastrar alunos, professores e disciplinas
3. ✅ Lançar notas
4. ✅ Visualizar boletim

---

**Desenvolvido com ❤️ - AppScholar 2024**
