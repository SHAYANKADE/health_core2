const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY || '56';

let latest = null;

app.post('/api/readings', (req, res) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { bpm, spo2, fspo2 } = req.body || {};
  if (typeof bpm !== 'number' || typeof spo2 !== 'number') {
    return res.status(400).json({ error: 'invalid payload, expected {bpm, spo2, fspo2}' });
  }

  latest = {
    bpm,
    spo2,
    fspo2: typeof fspo2 === 'number' ? fspo2 : null,
    ts: Date.now(),
  };

  res.json({ ok: true });
});

app.get('/api/readings/latest', (req, res) => {
  res.json(latest || {});
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
