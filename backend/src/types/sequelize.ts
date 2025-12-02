import { Model, Optional } from 'sequelize';

// Interface para Aluno
export interface AlunoAttributes {
  id: number;
  nome: string;
  matricula: string;
  curso: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AlunoCreationAttributes extends Optional<AlunoAttributes, 'id'> {}

export interface AlunoInstance extends Model<AlunoAttributes, AlunoCreationAttributes>, AlunoAttributes {}

// Interface para Nota
export interface NotaAttributes {
  id: number;
  alunoId: number;
  disciplinaId: number;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
  nota5: number;
  media: number;
  situacao: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotaCreationAttributes extends Optional<NotaAttributes, 'id'> {}

export interface NotaInstance extends Model<NotaAttributes, NotaCreationAttributes>, NotaAttributes {}

// Interface para Disciplina
export interface DisciplinaAttributes {
  id: number;
  nome: string;
  cargaHoraria: number;
  professorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DisciplinaCreationAttributes extends Optional<DisciplinaAttributes, 'id'> {}

export interface DisciplinaInstance extends Model<DisciplinaAttributes, DisciplinaCreationAttributes>, DisciplinaAttributes {}