require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users');
const planRouter  = require('./routes/plan');
const foodsRouter = require('./routes/foods');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'CraveFit API', version: '0.1.0' }));

app.use('/api/users', usersRouter);
app.use('/api/plan',  planRouter);
app.use('/api/foods', foodsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CraveFit API running on http://localhost:${PORT}`));

module.exports = app;
