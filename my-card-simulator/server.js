const express = require('express');
const path = require('path');
const app = express();

// Renderが割り当てるポート、またはローカル用の3000番
const PORT = process.env.PORT || 3000;

// publicフォルダ内の静的ファイル（HTML/JS/画像）を公開
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
