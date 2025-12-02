import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Professor = sequelize.define("Professor", {
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
  titulacao: {
    type: DataTypes.STRING,
  },
  tempoDocencia: {
    type: DataTypes.INTEGER,
  },
  areaAtuacao: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'professores'
});