module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  DB_FILE: process.env.DB_FILE || './data/app.db'
};