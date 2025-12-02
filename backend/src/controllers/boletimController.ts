// boletimController.ts - Atualizado
import { Request, Response } from "express";
import { Nota } from "../models/nota";
import { Aluno } from "../models/aluno";
import { Disciplina } from "../models/disciplina";
import { Professor } from "../models/professor";
import { AlunoInstance } from "../types/sequelize";
import { NotaInstance } from "../types/sequelize";

export const consultarBoletim = async (req: Request, res: Response) => {
  const { matricula } = req.params;
  
  try {
    // Primeiro encontrar o aluno pela matrícula
    const aluno = await Aluno.findOne({ where: { matricula } }) as AlunoInstance | null;
    
    if (!aluno) {
      return res.status(404).json({ 
        message: "Aluno não encontrado" 
      });
    }

    // Buscar as notas do aluno
    const boletim = await Nota.findAll({
      where: { alunoId: aluno.id },
      include: [
        { 
          model: Disciplina, 
          attributes: ["id", "nome", "cargaHoraria"],
          include: [{
            model: Professor,
            attributes: ["id", "nome", "titulacao"]
          }]
        },
        { 
          model: Aluno, 
          attributes: ["id", "nome", "matricula", "curso"] 
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!boletim || boletim.length === 0) {
      return res.status(404).json({ 
        message: "Nenhuma nota encontrada para este aluno" 
      });
    }

    res.json({
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        curso: aluno.curso
      },
      notas: boletim
    });
  } catch (error) {
    console.error("Erro ao consultar boletim:", error);
    res.status(500).json({ 
      message: "Erro ao consultar boletim", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

// Novo método para consultar boletim completo com estatísticas
export const consultarBoletimCompleto = async (req: Request, res: Response) => {
  const { matricula } = req.params;
  
  try {
    const aluno = await Aluno.findOne({ where: { matricula } }) as AlunoInstance | null;
    
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const boletim = await Nota.findAll({
      where: { alunoId: aluno.id },
      include: [
        { 
          model: Disciplina, 
          attributes: ["id", "nome", "cargaHoraria"]
        }
      ]
    }) as NotaInstance[];

    // Calcular estatísticas
    const estatisticas = {
      totalDisciplinas: boletim.length,
      aprovadas: boletim.filter(nota => nota.situacao === 'Aprovado').length,
      reprovadas: boletim.filter(nota => nota.situacao === 'Reprovado').length,
      mediaGeral: boletim.length > 0 ? 
        parseFloat((boletim.reduce((sum, nota) => sum + parseFloat(nota.media.toString()), 0) / boletim.length).toFixed(2)) : 0
    };

    res.json({
      aluno,
      notas: boletim,
      estatisticas
    });
  } catch (error) {
    console.error("Erro ao consultar boletim completo:", error);
    res.status(500).json({ 
      message: "Erro ao consultar boletim", 
      error: error instanceof Error ? error.message : error 
    });
  }
};