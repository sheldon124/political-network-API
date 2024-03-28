const { Router } = require("express");
const {
  getFeedback,
  createFeedback,
} = require("../services/services.feedback");

const router = new Router();

router.get("/", async (req, res) => {
  const response = await getFeedback();
  res.send(response);
});

router.post("/", async (req, res) => {
  const { body } = req;
  const response = await createFeedback(body);
  res.send(response);
});

module.exports = router;
