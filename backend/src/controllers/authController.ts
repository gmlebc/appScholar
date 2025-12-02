import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY!;

const MODO_DESENVOLVIMENTO = process.env.NODE_ENV !== 'production';

console.log("🎯 AUTHCONTROLLER CARREGADO - MODO:", MODO_DESENVOLVIMENTO ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');

export const registrarUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha, perfil } = req.body;
  try {
    let senhaParaSalvar;

    if (MODO_DESENVOLVIMENTO) {
      console.log(" MODO DESENVOLVIMENTO: Salvando senha como texto simples");
      senhaParaSalvar = senha;
    } else {
      console.log("MODO PRODUÇÃO: Criptografando senha");
      senhaParaSalvar = await bcrypt.hash(senha, 10);
    }

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaParaSalvar,
      perfil,
    });

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      usuario: {
        id: novoUsuario.getDataValue("id"),
        nome: novoUsuario.getDataValue("nome"),
        email: novoUsuario.getDataValue("email"),
        perfil: novoUsuario.getDataValue("perfil"),
      }
    });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao registrar usuário", detalhes: error });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
   console.log("AUTHCONTROLLER HÍBRIDO - Versão com texto simples está rodando!");
  const { email, senha } = req.body;
  
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const senhaNoBanco = usuario.getDataValue("senha");
    const usuarioId = usuario.getDataValue("id");
    let senhaValida = false;
    let metodo = "";

    if (senha === senhaNoBanco) {
      senhaValida = true;
      metodo = "TEXTO_SIMPLES";
      console.log("✅ Senha válida via TEXTO_SIMPLES");
    }
    // 2. Se não, tenta bcrypt (caso a senha no banco seja hash)
    else if (senhaNoBanco.startsWith('$2a$') || senhaNoBanco.startsWith('$2b$')) {
      try {
        senhaValida = await bcrypt.compare(senha, senhaNoBanco);
        metodo = "BCRYPT";
        console.log("🔐 Tentativa BCRYPT:", senhaValida ? "✅ Válida" : "❌ Inválida");
      } catch (bcryptError) {
        console.log("❌ Erro no bcrypt.compare:", bcryptError);
      }
    }

    console.log("📊 RESULTADO FINAL:");
    console.log("  - Senha válida:", senhaValida);
    console.log("  - Método usado:", metodo);

    if (!senhaValida) {
      console.log("❌ Login falhou - Senha inválida");
      return res.status(401).json({ erro: "Email ou senha incorretos" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: usuarioId,
        perfil: usuario.getDataValue("perfil"),
        nome: usuario.getDataValue("nome"),
        email: usuario.getDataValue("email"),
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("✅ Login bem-sucedido para:", email);
    
    res.json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuarioId,
        nome: usuario.getDataValue("nome"),
        email: usuario.getDataValue("email"),
        perfil: usuario.getDataValue("perfil"),
      },
    });

  } catch (error) {
    console.error("💥 ERRO NO LOGIN:", error);
    res.status(500).json({ 
      erro: "Erro interno no servidor", 
      detalhes: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
};
