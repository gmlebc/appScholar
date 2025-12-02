import express from "express";
import {
  cadastrarNota,
  atualizarNota,
  listarNotas,
} from "../controllers/notaController";
import { autenticarToken, verificarPerfil } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  autenticarToken,
  verificarPerfil(["admin", "professor"]),
  cadastrarNota
);
router.put(
  "/:id",
  autenticarToken,
  verificarPerfil(["admin", "professor"]),
  atualizarNota
);
router.get(
  "/",
  autenticarToken,
  verificarPerfil(["admin", "professor"]),
  listarNotas
);

export default router;
