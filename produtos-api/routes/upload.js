const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante pasta de uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ts = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${ts}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('imagem'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = '/uploads/' + req.file.filename;
  const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;
  res.json({ imageUrl: fullUrl, path: filePath });
});

module.exports = router;
