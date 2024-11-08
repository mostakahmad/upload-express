// image-upload-server/index.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('uploads')); // Serve static files from uploads directory

// Set up multer for file upload handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid conflicts
  },
});

const upload = multer({ storage });

// Route for uploading images
app.post('/upload', upload.array('images'), (req, res) => {
  const imagePaths = req.files.map(file => `https://bismillah-butter.onrender.com/${file.filename}`);
  res.json({ images: imagePaths });
});

// Route for getting list of images
app.get('/images', (req, res) => {
  const fs = require('fs');
  const directoryPath = path.join(__dirname, 'uploads');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }
    const images = files.map(file => `https://bismillah-butter.onrender.com/${file}`);
    res.json({ images });
  });
});

app.listen(5000, () => {
  console.log('Server is running on https://bismillah-butter.onrender.com');
});
