const { Router } = require("express");
const router = new Router();
const { createComment } = require("../services/services.comment");

router.post("/", async (req, res) => {
  const { body } = req;
  const response = await createComment(body);
  res.send(response);
});

module.exports = router;
