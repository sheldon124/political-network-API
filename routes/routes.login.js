const { Router } = require('express');
const { login, logout } = require('../services/services.login');

const router = new Router();

router.post('/login', async (req, res) => {
  const { body } = req;
  const response = await login(body);
  res.send(response);
});

router.patch('/logout/:id', async (req, res) => {
  const response = await logout(req.params.id);
  res.send(response);
});

module.exports = router;
