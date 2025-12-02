import express from "express";
import {
  criarAluno,
  listarAlunos,
  obterAlunoPorId,
  obterAlunoPorMatricula,
} from "../controllers/alunoController";
import { autenticarToken, verificarPerfil } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  autenticarToken,
  verificarPerfil(["admin", "professor"]),
  criarAluno
);
router.get(
  "/",
  autenticarToken,
  verificarPerfil(["admin", "professor"]),
  listarAlunos
);
router.get(
  "/:id",
  autenticarToken,
  verificarPerfil(["admin", "professor"]),
  obterAlunoPorId
);
router.get(
  "/matricula/:matricula",
  autenticarToken,
  verificarPerfil(["admin", "professor"]),
  obterAlunoPorMatricula
);

export default router;
