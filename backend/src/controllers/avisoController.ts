import { Request, Response } from "express";
import Aviso from "../models/aviso";
import { Usuario } from "../models/usuario";

export const criarAviso = async (req: Request, res: Response) => {
  try {
    const { titulo, mensagem, tipo } = req.body;
    const autorId = req.body.userId; // Vindo do middleware de autenticação
    
    // Validar campos obrigatórios
    if (!titulo || !mensagem || !tipo) {
      return res.status(400).json({ 
        error: "Todos os campos são obrigatórios: titulo, mensagem, tipo" 
      });
    }

    // Validar tipo de aviso
    const tiposValidos = ['geral', 'lembrete', 'comunicado', 'aviso'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ 
        error: "Tipo de aviso inválido. Use: geral, lembrete, comunicado ou aviso" 
      });
    }

    // Verificar se o usuário é professor ou administrador
    const usuario = await Usuario.findByPk(autorId);
    if (!usuario || (usuario.perfil !== 'professor' && usuario.perfil !== 'administrador')) {
      return res.status(403).json({ 
        error: "Apenas professores e administradores podem criar avisos" 
      });
    }

    const aviso = await Aviso.create({ 
      titulo, 
      mensagem, 
      tipo, 
      autorId,
      dataCriacao: new Date(),
      lido: false
    });

    // Buscar o aviso criado com as informações do autor
    const avisoCompleto = await Aviso.findByPk(aviso.id, {
      include: [{
        model: Usuario,
        as: 'autor',
        attributes: ['id', 'nome', 'email', 'perfil']
      }]
    });

    res.status(201).json(avisoCompleto);
  } catch (error) {
    console.error("Erro ao criar aviso:", error);
    res.status(400).json({ 
      error: "Erro ao criar aviso", 
      detalhes: error instanceof Error ? error.message : error 
    });
  }
};

export const listarAvisos = async (req: Request, res: Response) => {
  try {
    const { tipo, limite } = req.query;
    
    const whereClause: any = {};
    if (tipo && typeof tipo === 'string') {
      whereClause.tipo = tipo;
    }

    const options: any = {
      where: whereClause,
      include: [{
        model: Usuario,
        as: 'autor',
        attributes: ['id', 'nome', 'email', 'perfil']
      }],
      order: [['dataCriacao', 'DESC']]
    };

    if (limite && !isNaN(Number(limite))) {
      options.limit = Number(limite);
    }

    const avisos = await Aviso.findAll(options);
    res.json(avisos);
  } catch (error) {
    console.error("Erro ao listar avisos:", error);
    res.status(500).json({ 
      error: "Erro ao listar avisos",
      detalhes: error instanceof Error ? error.message : error 
    });
  }
};

export const buscarAviso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const aviso = await Aviso.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'autor',
        attributes: ['id', 'nome', 'email', 'perfil']
      }]
    });

    if (!aviso) {
      return res.status(404).json({ error: "Aviso não encontrado" });
    }

    res.json(aviso);
  } catch (error) {
    console.error("Erro ao buscar aviso:", error);
    res.status(500).json({ 
      error: "Erro ao buscar aviso",
      detalhes: error instanceof Error ? error.message : error 
    });
  }
};

export const atualizarAviso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, mensagem, tipo } = req.body;
    const userId = req.body.userId;

    const aviso = await Aviso.findByPk(id);
    if (!aviso) {
      return res.status(404).json({ error: "Aviso não encontrado" });
    }

    // Verificar se o usuário é o autor ou um administrador
    const usuario = await Usuario.findByPk(userId);
    if (!usuario || (aviso.autorId !== userId && usuario.perfil !== 'administrador')) {
      return res.status(403).json({ 
        error: "Você não tem permissão para editar este aviso" 
      });
    }

    // Atualizar campos
    if (titulo) aviso.titulo = titulo;
    if (mensagem) aviso.mensagem = mensagem;
    if (tipo) {
      const tiposValidos = ['geral', 'lembrete', 'comunicado', 'aviso'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({ 
          error: "Tipo de aviso inválido" 
        });
      }
      aviso.tipo = tipo;
    }

    await aviso.save();

    const avisoAtualizado = await Aviso.findByPk(id, {
      include: [{
        model: Usuario,
        as: 'autor',
        attributes: ['id', 'nome', 'email', 'perfil']
      }]
    });

    res.json(avisoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar aviso:", error);
    res.status(400).json({ 
      error: "Erro ao atualizar aviso",
      detalhes: error instanceof Error ? error.message : error 
    });
  }
};

export const deletarAviso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    const aviso = await Aviso.findByPk(id);
    if (!aviso) {
      return res.status(404).json({ error: "Aviso não encontrado" });
    }

    // Verificar se o usuário é o autor ou um administrador
    const usuario = await Usuario.findByPk(userId);
    if (!usuario || (aviso.autorId !== userId && usuario.perfil !== 'administrador')) {
      return res.status(403).json({ 
        error: "Você não tem permissão para deletar este aviso" 
      });
    }

    await aviso.destroy();
    res.json({ message: "Aviso deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar aviso:", error);
    res.status(500).json({ 
      error: "Erro ao deletar aviso",
      detalhes: error instanceof Error ? error.message : error 
    });
  }
};

export const marcarComoLido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const aviso = await Aviso.findByPk(id);
    if (!aviso) {
      return res.status(404).json({ error: "Aviso não encontrado" });
    }

    aviso.lido = true;
    await aviso.save();

    res.json({ message: "Aviso marcado como lido", aviso });
  } catch (error) {
    console.error("Erro ao marcar aviso como lido:", error);
    res.status(500).json({ 
      error: "Erro ao marcar aviso como lido",
      detalhes: error instanceof Error ? error.message : error 
    });
  }
};

export const contarAvisosNaoLidos = async (req: Request, res: Response) => {
  try {
    const count = await Aviso.count({
      where: { lido: false }
    });
    res.json({ count });
  } catch (error) {
    console.error("Erro ao contar avisos não lidos:", error);
    res.status(500).json({ 
      error: "Erro ao contar avisos não lidos",
      detalhes: error instanceof Error ? error.message : error 
    });
  }
};
