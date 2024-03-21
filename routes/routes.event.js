const { Router } = require("express");
const { createEvent, getFutureEvents } = require("../services/services.event");

const router = new Router();

router.get("/futureevents", async (req, res) => {
  const futureEvents = await getFutureEvents();
  res.send(futureEvents);
});

router.post("/", async (req, res) => {
  const { body } = req;
  const response = await createEvent(body);
  res.send(response);
});

module.exports = router;
