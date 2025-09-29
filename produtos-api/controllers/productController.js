const crypto = require('crypto');
const ProductModel = require('../models/productModel');

const getAllProducts = (req, res) => {
  res.json(ProductModel.findAll());
};

const getProductById = (req, res) => {
  const product = ProductModel.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'product not found' });
  res.json(product);
};

const createProduct = (req, res) => {
  const { titulo, descricao, quantidadeEstoque, estrelas, valor, imagem, desconto } = req.body;

  if (!titulo) {
    return res.status(400).json({ error: 'Titulo is required' });
  }

  const id = crypto.randomUUID();
  const product = {
    id,
    titulo,
    descricao,
    quantidadeEstoque,
    estrelas,
    valor,
    imagem,
    desconto
  };

  const created = ProductModel.create(product);
  res.status(201).json(created);
};

const updateProduct = (req, res) => {
  const exists = ProductModel.findById(req.params.id);
  if (!exists) return res.status(404).json({ error: 'product not found' });

  const updated = ProductModel.update(req.params.id, req.body || {});
  res.json(updated);
};

const deleteProduct = (req, res) => {
  const removed = ProductModel.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'product not found' });
  res.json({ message: 'product deleted successfully' });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
