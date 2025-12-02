import express from "express";
import {
  criarProfessor,
  listarProfessores,
  obterProfessorPorId,
} from "../controllers/professorController";
import { autenticarToken, verificarPerfil } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", autenticarToken, verificarPerfil(["admin"]), criarProfessor);
router.get("/", autenticarToken, listarProfessores);
router.get("/:id", autenticarToken, obterProfessorPorId);

export default router;
