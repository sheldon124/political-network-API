const { Router } = require('express');
const executePgQuery = require('../helpers/dbConnection');
const { registerCitizen } = require('../services/services.citizen');

const router = new Router();

router.get('/allcitizens', async (req, res) => {
  const allCits = await executePgQuery(`SELECT * FROM citizen;`);
  res.send({
    allcitizens: allCits.rows,
  });
});

router.post('/', async (req, res) => {
  const { body } = req;
  const response = await registerCitizen(body);
  res.send(response);
});

module.exports = router;
