ADICIONADO SISTEMA DE AVISOS

## 🎓 AppScholar - Sistema de Gestão Escolar

Sistema completo de gestão acadêmica com React Native (Expo) e Node.js.

## 🚀 Iniciar Aplicação

### Backend
```powershell
cd backend
npm run dev
```
**URL:** http://localhost:3000

### Frontend
```powershell
cd frontend
npm start
```
Escaneie o QR Code com Expo Go (celular e PC na mesma rede Wi-Fi)

## 🔧 Configuração

### Primeira vez:
```powershell
# Backend
cd backend
npm install
.\create-database.ps1
.\populate-database.ps1

# Frontend
cd frontend
npm install
```

### Se mudar o IP:
Atualize em `frontend/src/services/api.ts` e `backend/src/types/server.ts`

## 👤 Login de Teste

**Professor:**
- Email: `andre.olimpio@scholar.com`
- Senha: `prof123`

**Aluno:**
- Email: `joao.oliveira@scholar.com`
- Senha: `aluno123`

**Admin:**
- Email: `teste@teste.com`
- Senha: `123123`

## 📋 Funcionalidades

- ✅ Autenticação JWT
- ✅ Gestão de Alunos
- ✅ Gestão de Professores
- ✅ Gestão de Disciplinas
- ✅ Lançamento de Notas
- ✅ Boletim Acadêmico
- ✅ Avisos Acadêmicos
- ✅ Modo Escuro/Claro

## 🛠️ Tecnologias

**Backend:** Node.js, TypeScript, Express, Sequelize, PostgreSQL  
**Frontend:** React Native, Expo, TypeScript, React Navigation
