const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const getAllUsers = (req, res) => {
  res.json(userModel.findAll());
};

const getUserById = (req, res) => {
  const user = userModel.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

const createUser = async (req, res) => {
  const { nome, email, papel, senha } = req.body || {};
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'nome, email and password are required' });
  }
  const existing = userModel.findByEmail(email);
  if (existing) return res.status(400).json({ error: 'Email is already registered' });

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const id = crypto.randomUUID();

     // Se papel não for informado, usa 'CLIENTE'
    const userPapel = papel || "CLIENTE";

    const created = userModel.create({ id, nome, email, papel:userPapel, senha: hashedPassword });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  const current = userModel.findByIdWithPassword(req.params.id);
  if (!current) return res.status(404).json({ error: 'User not found' });

  const { nome, email, senha } = req.body || {};

  if (email && email !== current.email) {
    const conflict = userModel.findByEmail(email);
    if (conflict && conflict.id !== current.id) {
      return res.status(400).json({ error: 'Email is already in use by another account' });
    }
  }

  try {
    let data = { nome, email };
    if (senha) data.senha = await bcrypt.hash(senha, 10);
    const updated = userModel.update(req.params.id, data);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const deleteUser = (req, res) => {
  const removed = userModel.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted successfully' });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
