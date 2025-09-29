const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Inicializa DB (cria tabelas)
require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uploads = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
app.use('/uploads', express.static(uploads));

// Rotas
app.use('/products', require('./routes/products'));
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/upload'));

app.get('/', (req, res) => res.send('API with SQLite is running.'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
