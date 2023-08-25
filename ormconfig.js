require('dotenv').config();
const { DataSource } = require('typeorm');

exports.AppDataSource = new DataSource({
  type: "postgres",
  port: 5433,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DATABASE_URL,
  entities: ['dist/**/*.models.js'],
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  migrationsTableName: 'migrations',
  logging: false,
  synchronize: false,
});
exports.AppDataSource.initialize()
  .then(() => {
    console.log('connected');
  })
  .catch((err) => {
    console.log('failed', err);
  });