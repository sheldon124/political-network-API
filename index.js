const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(bodyParser.json());

const citizenRoutes = require('./routes/routes.citizen');
const loginRoutes = require('./routes/routes.login');
const projectRoutes = require('./routes/routes.project');

const sampleObj = {
  testKey: 'connected to api',
};

app.use('/citizen', citizenRoutes);

app.use('/log', loginRoutes);

app.use('/project', projectRoutes);

app.get('/', (req, res) => {
  res.send(sampleObj);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
