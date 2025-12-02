# 📢 Módulo de Avisos Acadêmicos

## 🚀 Quick Start

### Backend
```powershell
cd backend
npm run dev
```

### Frontend
```powershell
cd frontend
npm start
```


## 🗄️ Banco de Dados


```powershell
cd backend
.\populate-database.ps1
```

**Estrutura:**
```sql
avisos
  - id (auto)
  - titulo (max 200 chars)
  - mensagem (text)
  - tipo (geral, lembrete, comunicado, aviso)
  - autorId (FK usuarios)
  - lido (boolean, default false)
  - dataCriacao (timestamp)
```

## 🔌 API Endpoints

**Base URL:** `http://localhost:3000/api/avisos`

| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| GET | `/` | Todos | Listar avisos |
| GET | `/nao-lidos/count` | Todos | Contar não lidos |
| GET | `/:id` | Todos | Buscar por ID |
| POST | `/` | Prof/Admin | Criar aviso |
| PUT | `/:id` | Autor/Admin | Atualizar |
| DELETE | `/:id` | Autor/Admin | Deletar |
| PATCH | `/:id/lido` | Todos | Marcar como lido |

### Exemplos de Requisição

**Listar avisos:**
```bash
GET /api/avisos?tipo=geral&limite=10
```

**Criar aviso:**
```bash
POST /api/avisos
{
  "titulo": "Prova de Matemática",
  "mensagem": "A prova será dia 15/12",
  "tipo": "aviso"
}
```

**Contar não lidos:**
```bash
GET /api/avisos/nao-lidos/count
Response: { "count": 3 }
```

## 📱 Navegação Frontend

```
HomeScreen
  └─ Card "Avisos Acadêmicos" (com badge)
      └─ ListaAvisosScreen
          ├─ Filtros (chips)
          ├─ Lista de avisos
          └─ FAB "Novo Aviso" (só professores)
              └─ CriarAvisoScreen
```

## 👥 Credenciais de Teste

**Professor:**
- Email: `andre.olimpio@scholar.com`
- Senha: `prof123`
- Pode: criar, editar, deletar avisos

**Aluno:**
- Email: `joao.oliveira@scholar.com`
- Senha: `aluno123`
- Pode: ver e marcar como lido

## 📁 Arquivos Criados

### Backend
```
src/
  models/aviso.ts
  controllers/avisoController.ts
  routes/avisoRoutes.ts
```

### Frontend
```
src/
  screens/
    ListaAvisosScreen.tsx
    CriarAvisoScreen.tsx
  components/
    AvisoBadge.tsx
  types/
    avisos.ts
```

## 🔧 Troubleshooting

**Erro 404 no contador:**
- Certifique-se que o backend está rodando (`npm run dev`)
- Verifique o IP em `frontend/src/services/api.ts`

**Backend não atualiza:**
- Use `npm run dev` (hot reload)
- OU: `npm run build` + `npm start`

---

**Pronto!** O módulo está 100% funcional. Para testar:
1. Inicie o backend (`npm run dev`)
2. Inicie o frontend (`npm start`)
3. Login como professor e crie um aviso
4. Login como aluno e visualize o badge + lista
