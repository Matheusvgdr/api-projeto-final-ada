const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const { DB_FILE } = require("./config");

const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_FILE);
db.pragma("foreign_keys = ON");

// Migração simples (idempotente)
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  papel TEXT NOT NULL DEFAULT ('CLIENTE'),
  dataCriacao TEXT NOT NULL DEFAULT (datetime('now'))
);

DELETE FROM users;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  dataCriacao TEXT NOT NULL DEFAULT (datetime('now')),
  quantidadeEstoque INTEGER NOT NULL DEFAULT 0,
  estrelas INTEGER NOT NULL DEFAULT 0,
  valor REAL NOT NULL DEFAULT 0,
  imagem TEXT,
  desconto REAL NOT NULL DEFAULT 0
);

DELETE FROM products;

INSERT INTO products (
  id, titulo, descricao, dataCriacao, quantidadeEstoque, estrelas, valor, imagem, desconto
) VALUES
(
  '1',
  'Cesto de Roupa',
  'Cesto de roupa dobrável e resistente, ideal para organizar roupas sujas ou armazenar peças limpas de forma prática.',
  datetime('now'),
  10,
  4,
  150,
  '/img/produto-cesto.svg',
  10
);

INSERT INTO products (
  id, titulo, descricao, dataCriacao, quantidadeEstoque, estrelas, valor, imagem, desconto
) VALUES
(
  '2',
  'Luminária',
  'Luminária de mesa com design moderno e regulagem de intensidade, perfeita para leitura e estudos.',
  datetime('now'),
  20,
  5,
  220,
  '/img/produto-luminaria.svg',
  5
);

INSERT INTO products (
  id, titulo, descricao, dataCriacao, quantidadeEstoque, estrelas, valor, imagem, desconto
) VALUES
(
  '3',
  'Lâmpada LED',
  'Lâmpada LED econômica e de longa duração, com luz branca natural que ilumina bem ambientes internos.',
  datetime('now'),
  30,
  4,
  83,
  '/img/produto-lampada.svg',
  15
);
`);

module.exports = db;
