import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const connection: DataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5433,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + "/../src/models/*.ts"],
  synchronize: true,
});

export default connection;
