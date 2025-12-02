import { Request, Response } from "express";
import { Professor } from "../models/professor";

export const criarProfessor = async (req: Request, res: Response) => {
  try {
    const professor = await Professor.create(req.body);
    res.status(201).json(professor);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao cadastrar professor", detalhes: error });
  }
};

export const listarProfessores = async (req: Request, res: Response) => {
  const professores = await Professor.findAll();
  res.json(professores);
};

export const obterProfessorPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const professor = await Professor.findByPk(id);
  if (professor) {
    res.json(professor);
  } else {
    res.status(404).json({ error: "Professor não encontrado" });
  }
};
