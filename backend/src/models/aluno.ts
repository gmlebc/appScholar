import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { AlunoInstance, AlunoAttributes } from "../types/sequelize";

export const Aluno = sequelize.define<AlunoInstance>("Aluno", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  matricula: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  curso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'alunos'
});
