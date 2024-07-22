const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;
const stateFile = './state.json';

app.use(cors());
app.use(bodyParser.json());

app.post('/save-state', (req, res) => {
  const state = req.body;
  fs.writeFileSync(stateFile, JSON.stringify(state));
  res.sendStatus(200);
});

app.get('/load-state', (req, res) => {
  if (fs.existsSync(stateFile)) {
    const state = fs.readFileSync(stateFile);
    res.json(JSON.parse(state));
  } else {
    res.json({});
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});