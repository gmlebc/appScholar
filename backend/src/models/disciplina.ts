import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { Professor } from "./professor";

export const Disciplina = sequelize.define("Disciplina", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargaHoraria: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'disciplinas'
});

// Associação: Uma Disciplina pertence a um Professor
Disciplina.belongsTo(Professor, { foreignKey: "professorId" });
Professor.hasMany(Disciplina, { foreignKey: "professorId" });
