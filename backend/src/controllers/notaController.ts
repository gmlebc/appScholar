import { Request, Response } from "express";
import { Nota } from "../models/nota";
import { Aluno } from "../models/aluno";
import { Disciplina } from "../models/disciplina";
import { AlunoInstance } from "../types/sequelize";
import { NotaInstance } from "../types/sequelize";

export const cadastrarNota = async (req: Request, res: Response) => {
  try {
    const { alunoMatricula, disciplinaId, nota1, nota2, nota3, nota4, nota5 } =
      req.body;

    // Validar campos obrigatórios
    if (!alunoMatricula || !disciplinaId) {
      return res.status(400).json({
        error: "Matrícula do aluno e ID da disciplina são obrigatórios",
      });
    }

    // Buscar aluno pela matrícula
    const aluno = (await Aluno.findOne({
      where: { matricula: alunoMatricula },
    })) as AlunoInstance | null;
    if (!aluno) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    // Verificar se disciplina existe
    const disciplina = await Disciplina.findByPk(disciplinaId);
    if (!disciplina) {
      return res.status(404).json({ error: "Disciplina não encontrada" });
    }

    // Verificar se já existe nota para este aluno nesta disciplina
    const notaExistente = await Nota.findOne({
      where: { alunoId: aluno.id, disciplinaId },
    });

    if (notaExistente) {
      return res.status(400).json({
        error: "Já existe nota cadastrada para este aluno nesta disciplina",
      });
    }

    // Calcular média e situação
    const notasValidas = [nota1, nota2, nota3, nota4, nota5].filter(
      (nota) =>
        nota !== undefined &&
        nota !== null &&
        !isNaN(nota) &&
        nota >= 0 &&
        nota <= 10
    );

    if (notasValidas.length === 0) {
      return res.status(400).json({
        error: "Pelo menos uma nota válida (0-10) deve ser fornecida",
      });
    }

    const soma = notasValidas.reduce((acc, nota) => acc + parseFloat(nota), 0);
    const media = parseFloat((soma / notasValidas.length).toFixed(2));

    let situacao = "Reprovado";
    if (media >= 7.0) {
      situacao = "Aprovado";
    } else if (media >= 5.0) {
      situacao = "Recuperação";
    }

    const nota = (await Nota.create({
      alunoId: aluno.id,
      disciplinaId,
      nota1: nota1 || 0,
      nota2: nota2 || 0,
      nota3: nota3 || 0,
      nota4: nota4 || 0,
      nota5: nota5 || 0,
      media,
      situacao,
    })) as NotaInstance;

    // Buscar a nota criada com informações relacionadas
    const notaCompleta = await Nota.findByPk(nota.id, {
      include: [
        { model: Aluno, attributes: ["id", "nome", "matricula"] },
        { model: Disciplina, attributes: ["id", "nome"] },
      ],
    });

    res.status(201).json({
      message: "Nota cadastrada com sucesso",
      nota: notaCompleta,
      estatisticas: {
        media,
        situacao,
        totalNotas: notasValidas.length,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar nota:", error);
    res.status(400).json({
      error: "Erro ao cadastrar nota",
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Novo método para atualizar nota
export const atualizarNota = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nota1, nota2, nota3, nota4, nota5 } = req.body;

    const nota = (await Nota.findByPk(id)) as NotaInstance | null;
    if (!nota) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    // Recalcular média e situação
    const notas = [nota1, nota2, nota3, nota4, nota5].filter(
      (n) => n !== undefined && n !== null
    );
    const soma = notas.reduce((acc: number, n: any) => acc + parseFloat(n), 0);
    const media = parseFloat((soma / notas.length).toFixed(2));
    const situacao = media >= 6 ? "Aprovado" : "Reprovado";

    await nota.update({
      nota1: nota1 as number,
      nota2: nota2 as number,
      nota3: nota3 as number,
      nota4: nota4 as number,
      nota5: nota5 as number,
      media: media as any,
      situacao: situacao as string,
    });

    const notaAtualizada = await Nota.findByPk(id, {
      include: [
        { model: Aluno, attributes: ["id", "nome", "matricula"] },
        { model: Disciplina, attributes: ["id", "nome"] },
      ],
    });

    res.json(notaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar nota:", error);
    res.status(400).json({
      error: "Erro ao atualizar nota",
      details: error instanceof Error ? error.message : error,
    });
  }
};

// Listar todas as notas
export const listarNotas = async (req: Request, res: Response) => {
  try {
    const notas = await Nota.findAll({
      include: [
        { model: Aluno, attributes: ["id", "nome", "matricula", "curso"] },
        { model: Disciplina, attributes: ["id", "nome", "cargaHoraria"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(notas);
  } catch (error) {
    console.error("Erro ao listar notas:", error);
    res.status(500).json({
      error: "Erro ao listar notas",
      details: error instanceof Error ? error.message : error,
    });
  }
};
