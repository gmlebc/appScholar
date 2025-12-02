import { Request, Response } from "express";
import { Aluno } from "../models/aluno";

export const criarAluno = async (req: Request, res: Response) => {
  try {
    const { nome, matricula, curso } = req.body;
    
    // Validar campos obrigatórios
    if (!nome || !matricula || !curso) {
      return res.status(400).json({ 
        error: "Todos os campos são obrigatórios: nome, matricula, curso" 
      });
    }

    // Verificar se matrícula já existe
    const alunoExistente = await Aluno.findOne({ where: { matricula } });
    if (alunoExistente) {
      return res.status(400).json({ 
        error: "Matrícula já cadastrada" 
      });
    }

    const aluno = await Aluno.create({ nome, matricula, curso });
    res.status(201).json(aluno);
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(400).json({ 
      error: "Erro ao cadastrar aluno", 
      detalhes: error instanceof Error ? error.message : error 
    });
  }
};

export const listarAlunos = async (req: Request, res: Response) => {
  try {
    const alunos = await Aluno.findAll({
      order: [['nome', 'ASC']]
    });
    res.json(alunos);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    res.status(500).json({ 
      error: "Erro ao carregar alunos",
      detalhes: error instanceof Error ? error.message : error
    });
  }
};

export const obterAlunoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const aluno = await Aluno.findByPk(id);
    if (aluno) {
      res.json(aluno);
    } else {
      res.status(404).json({ error: "Aluno não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar aluno:", error);
    res.status(500).json({ 
      error: "Erro ao buscar aluno",
      detalhes: error instanceof Error ? error.message : error
    });
  }
};

export const obterAlunoPorMatricula = async (req: Request, res: Response) => {
  try {
    const { matricula } = req.params;
    const aluno = await Aluno.findOne({ where: { matricula } });
    if (aluno) {
      res.json(aluno);
    } else {
      res.status(404).json({ error: "Aluno não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar aluno por matrícula:", error);
    res.status(500).json({ 
      error: "Erro ao buscar aluno",
      detalhes: error instanceof Error ? error.message : error
    });
  }
};
