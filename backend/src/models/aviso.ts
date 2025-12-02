import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Usuario } from './usuario';

interface AvisoAttributes {
  id?: number;
  titulo: string;
  mensagem: string;
  tipo: 'geral' | 'lembrete' | 'comunicado' | 'aviso';
  autorId: number;
  dataCriacao: Date;
  lido?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class Aviso extends Model<AvisoAttributes> implements AvisoAttributes {
  public id!: number;
  public titulo!: string;
  public mensagem!: string;
  public tipo!: 'geral' | 'lembrete' | 'comunicado' | 'aviso';
  public autorId!: number;
  public dataCriacao!: Date;
  public lido!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Aviso.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('geral', 'lembrete', 'comunicado', 'aviso'),
      allowNull: false,
      defaultValue: 'geral',
    },
    autorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    dataCriacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Aviso',
    tableName: 'avisos',
    timestamps: true,
  }
);

// Relacionamentos
Aviso.belongsTo(Usuario, { foreignKey: 'autorId', as: 'autor' });

export default Aviso;
