const { Router } = require("express");
const router = new Router();
const { createComment, getComments } = require("../services/services.comment");

router.post("/", async (req, res) => {
  const { body } = req;
  const response = await createComment(body);
  res.send(response);
});

router.get("/project/:id", async (req, res) => {
  const { id } = req.params;
  const response = await getComments(id);
  res.send(response);
});
module.exports = router;
