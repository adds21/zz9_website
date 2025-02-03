const express = require('express');
const ssi = require('ssi');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

console.log('Starting server...');

const baseDir = path.join(__dirname, '/');
const parser = new ssi(baseDir, baseDir, '/**/*.html');

console.log('Base directory:', baseDir);

app.use((req, res, next) => {
  const filename = path.join(baseDir, req.path);
  console.log('Request for:', filename);
  if (filename.endsWith('.html')) {
    if (fs.existsSync(filename)) {
      const content = fs.readFileSync(filename, 'utf-8');
      const parsed = parser.parse(filename, content);
      res.send(parsed.contents);
    } else {
      res.status(404).send('File not found');
    }
  } else {
    next();
  }
});

app.use(express.static(baseDir));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
