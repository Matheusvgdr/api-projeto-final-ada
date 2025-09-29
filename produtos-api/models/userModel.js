const db = require('../db');

const selectAll = db.prepare(`SELECT id, nome, email, papel, dataCriacao FROM users ORDER BY dataCriacao DESC`);
const selectById = db.prepare(`SELECT id, nome, email, papel, dataCriacao FROM users WHERE id = ?`);
const selectByIdWithPass = db.prepare(`SELECT * FROM users WHERE id = ?`);
const selectByEmail = db.prepare(`SELECT * FROM users WHERE email = ?`);

const insertUser = db.prepare(`
INSERT INTO users (id, nome, email, papel, senha) VALUES (?, ?, ?, ?, ?)
`);

function updateUserDynamic(id, data) {
  const fields = [];
  const params = [];

  if (data.nome !== undefined) { fields.push(`nome = ?`); params.push(data.nome); }
  if (data.email !== undefined)    { fields.push(`email = ?`);    params.push(data.email); }
  if (data.senha !== undefined) { fields.push(`senha = ?`); params.push(data.senha); }
  if (data.papel !== undefined) { fields.push(`papel = ?`); params.push(data.papel); }

  if (!fields.length) return selectById.get(id);

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);
  const stmt = db.prepare(sql);
  stmt.run(params);
  return selectById.get(id);
}

const deleteUserStmt = db.prepare(`DELETE FROM users WHERE id = ?`);

module.exports = {
  findAll: () => selectAll.all(),
  findById: (id) => selectById.get(id),
  findByIdWithPassword: (id) => selectByIdWithPass.get(id),
  findByEmail: (email) => selectByEmail.get(email),
  create: (user) => {
    insertUser.run(user.id, user.nome, user.email,  user.papel, user.senha);
    return selectById.get(user.id);
  },
  update: updateUserDynamic,
  remove: (id) => {
    const before = selectById.get(id);
    if (!before) return null;
    deleteUserStmt.run(id);
    return before;
  }
};
