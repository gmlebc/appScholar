import express from "express";
import {
  consultarBoletim,
  consultarBoletimCompleto,
} from "../controllers/boletimController";
import { autenticarToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:matricula", autenticarToken, consultarBoletim);
router.get("/:matricula/completo", autenticarToken, consultarBoletimCompleto);

export default router;
