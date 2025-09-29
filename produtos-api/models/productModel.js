const db = require('../db');

// selects
const selectAll = db.prepare(`SELECT * FROM products ORDER BY dataCriacao DESC`);
const selectById = db.prepare(`SELECT * FROM products WHERE id = ?`);

// insert
const insertProduct = db.prepare(`
INSERT INTO products (
  id, titulo, descricao, quantidadeEstoque, estrelas, valor, imagem, desconto
) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const deleteProductStmt = db.prepare(`DELETE FROM products WHERE id = ?`);

// update dinâmico
function updateProductDynamic(id, data) {
  const fields = [];
  const params = [];

  const updatable = ['titulo', 'descricao', 'quantidadeEstoque', 'estrelas', 'valor', 'imagem', 'desconto'];
  updatable.forEach(k => {
    if (data[k] !== undefined) {
      fields.push(`${k} = ?`);
      params.push(data[k]);
    }
  });

  if (!fields.length) return selectById.get(id);

  const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  const stmt = db.prepare(sql);
  stmt.run(params);
  return selectById.get(id);
}

module.exports = {
  findAll: () => selectAll.all(),
  findById: (id) => selectById.get(id),
  create: (product) => {
    insertProduct.run(
      product.id,
      product.titulo,
      product.descricao ?? null,
      product.quantidadeEstoque ?? 0,
      product.estrelas ?? 0,
      product.valor ?? 0,
      product.imagem ?? null,
      product.desconto ?? 0
    );
    return selectById.get(product.id);
  },
  update: updateProductDynamic,
  remove: (id) => {
    const before = selectById.get(id);
    if (!before) return null;
    deleteProductStmt.run(id);
    return before;
  }
};
