import { Request, Response } from "express";
import { Disciplina } from "../models/disciplina";
import { Professor } from "../models/professor";

export const criarDisciplina = async (req: Request, res: Response) => {
  try {
    const disciplina = await Disciplina.create(req.body);
    res.status(201).json(disciplina);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao cadastrar disciplina", detalhes: error });
  }
};

export const listarDisciplinas = async (req: Request, res: Response) => {
  const disciplinas = await Disciplina.findAll({ include: Professor });
  res.json(disciplinas);
};

export const obterDisciplinaPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const disciplina = await Disciplina.findByPk(id, { include: Professor });
  if (disciplina) {
    res.json(disciplina);
  } else {
    res.status(404).json({ error: "Disciplina não encontrada" });
  }
};

export const listarDisciplinasPorProfessor = async (
  req: Request,
  res: Response
) => {
  try {
    const { professorId } = req.params;

    const disciplinas = await Disciplina.findAll({
      where: { professorId },
      include: [
        {
          model: Professor,
          attributes: ["id", "nome", "email"],
        },
      ],
    });

    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar disciplinas do professor",
      detalhes: error,
    });
  }
};
