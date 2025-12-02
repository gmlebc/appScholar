
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY!;

export interface AuthRequest extends Request {
  usuario?: {
    id: number;
    perfil: string;
    nome: string;
    email: string;
  };
}

export const autenticarToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ erro: "Token de acesso necessário" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({ erro: "Token inválido ou expirado" });
    }

    req.usuario = {
      id: decoded.id,
      perfil: decoded.perfil,
      nome: decoded.nome,
      email: decoded.email,
    };
    
    // Adicionar userId ao body para controllers que precisam
    req.body.userId = decoded.id;
    
    next();
  });
};

// Middleware para verificar perfil específico
export const verificarPerfil = (perfisPermitidos: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        erro: "Acesso negado. Permissão insuficiente.",
      });
    }

    next();
  };
};
