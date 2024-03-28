const { Router } = require("express");
const {
  getAlignedParties,
  voteParty,
  unvoteParty,
  getAllParties,
} = require("../services/services.party");

const router = new Router();

router.get("/", async (req, res) => {
  const response = await getAllParties();
  res.send(response);
});

router.post("/", async (req, res) => {
  const { interests } = req.body;
  const response = await getAlignedParties(interests);
  res.send(response);
});

router.patch("/vote", async (req, res) => {
  const { personId, partyId } = req.body;
  const response = await voteParty(personId, partyId);
  res.send(response);
});

router.patch("/unvote", async (req, res) => {
  const { personId, partyId } = req.body;
  const response = await unvoteParty(personId, partyId);
  res.send(response);
});

module.exports = router;
