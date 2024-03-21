const { Router } = require('express');
const {
  createProject,
  getActiveProjects,
  insertOpinion,
  disableProject,
} = require('../services/services.project');

const router = new Router();

router.post('/', async (req, res) => {
  const { body } = req;
  const response = await createProject(body);
  res.send(response);
});

router.patch('/disable/:id', async (req, res) => {
  const { id } = req.params;
  const response = await disableProject(id);
  res.send(response);
});

router.patch('/opinion/:id', async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const response = await insertOpinion(id, body);
  res.send(response);
});

router.get('/active', async (req, res) => {
  const response = await getActiveProjects();
  res.send(response);
});

router.post('/active', async (req, res) => {
  const { body } = req;
  const response = await getActiveProjects(true, body);
  res.send(response);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const response = await getActiveProjects(id);
  res.send(response);
});

router.post('/opinion/:id', async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const response = await insertOpinion(id, body);
  res.send(response);
});

module.exports = router;
