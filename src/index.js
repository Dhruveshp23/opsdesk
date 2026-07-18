require('dotenv').config();
const express = require('express');
const clientsRouter = require('./routes/clients');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'OpsDesk API is running' });
});

app.use('/clients', clientsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OpsDesk server running on port ${PORT}`);
});