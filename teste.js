const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/json', async (req, res) => {
  const fileUrl = 'https://drive.google.com/uc?export=download&id=1suzyP7SBb8prEN4QNOqy6vdug0mFmiey';
  
  try {
    const response = await axios.get(fileUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o arquivo JSON' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
