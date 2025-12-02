import express from "express";
import {
  criarAviso,
  listarAvisos,
  buscarAviso,
  atualizarAviso,
  deletarAviso,
  marcarComoLido,
  contarAvisosNaoLidos
} from "../controllers/avisoController";
import { autenticarToken, verificarPerfil } from "../middleware/authMiddleware";

const router = express.Router();

// Criar aviso (apenas professores e administradores)
router.post(
  "/",
  autenticarToken,
  verificarPerfil(["professor", "administrador"]),
  criarAviso
);

// Contar avisos não lidos (DEVE VIR ANTES de /:id)
router.get(
  "/nao-lidos/count",
  autenticarToken,
  contarAvisosNaoLidos
);

// Listar todos os avisos (todos os usuários autenticados)
router.get(
  "/",
  autenticarToken,
  listarAvisos
);

// Buscar aviso específico por ID
router.get(
  "/:id",
  autenticarToken,
  buscarAviso
);

// Atualizar aviso (apenas autor ou administrador)
router.put(
  "/:id",
  autenticarToken,
  atualizarAviso
);

// Deletar aviso (apenas autor ou administrador)
router.delete(
  "/:id",
  autenticarToken,
  deletarAviso
);

// Marcar aviso como lido
router.patch(
  "/:id/lido",
  autenticarToken,
  marcarComoLido
);

export default router;
