const { Router } = require("express");
const { createQuestion, getQuestions } = require("../services/services.quiz");

const router = new Router();

router.post("/", async (req, res) => {
  const { body } = req;
  const response = await createQuestion(body);
  res.send(response);
});

router.get("/", async (req, res) => {
  const { limit, difficulty } = req.query;
  const response = await getQuestions(limit, difficulty);
  res.send(response);
});

module.exports = router;
