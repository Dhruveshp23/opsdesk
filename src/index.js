require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OpsDesk API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OpsDesk server running on port ${PORT}`);
});