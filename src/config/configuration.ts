export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER || 'student',
    password: process.env.DB_PASSWORD || 'student',
    database: process.env.DB_NAME || 'nest_project',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    ttl: process.env.JWT_TTL || '30000s',
  },
});
