import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "DB_NAME",
  "DB_USER",
  "DB_PASS",
  "DB_HOST",
  "SECRET_KEY",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Variável de ambiente ${varName} não encontrada`);
  }
});

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST!,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectBD = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados realizada com sucesso.");
    
    // Verificar se o banco existe e está acessível
    const [result] = await sequelize.query("SELECT current_database(), version()");
    console.log(`Banco: ${(result as any)[0]?.current_database}`);
    
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
    process.exit(1);
  }
};
