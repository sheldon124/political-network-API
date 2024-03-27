const { Router } = require("express");
const {
  createEvent,
  getFutureEvents,
  register,
  unRegister,
} = require("../services/services.event");

const router = new Router();

router.get("/futureevents", async (req, res) => {
  const futureEvents = await getFutureEvents();
  res.send(futureEvents);
});

router.get("/futureevents/:id", async (req, res) => {
  const { id } = req.params;
  const futureEvents = await getFutureEvents(id);
  res.send(futureEvents);
});

router.post("/", async (req, res) => {
  const { body } = req;
  const response = await createEvent(body);
  res.send(response);
});

router.patch("/register", async (req, res) => {
  const { body } = req;
  const response = await register(body.eventId, body.personId);
  res.send(response);
});

router.patch("/unregister", async (req, res) => {
  const { body } = req;
  const response = await unRegister(body.eventId, body.personId);
  res.send(response);
});

module.exports = router;
