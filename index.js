const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json());

const citizenRoutes = require("./routes/routes.citizen");
const loginRoutes = require("./routes/routes.login");
const projectRoutes = require("./routes/routes.project");
const quizRoutes = require("./routes/routes.quiz");
const postRoutes = require("./routes/routes.post");
const commentRoutes = require("./routes/routes.comment");
const eventRoutes = require("./routes/routes.event");
const partyRoutes = require("./routes/routes.party");

const sampleObj = {
  testKey: "connected to api",
};

app.use("/citizen", citizenRoutes);

app.use("/log", loginRoutes);

app.use("/project", projectRoutes);

app.use("/quiz", quizRoutes);

app.use("/post", postRoutes);

app.use("/comment", commentRoutes);

app.use("/event", eventRoutes);

app.use("/party", partyRoutes);

app.get("/", (req, res) => {
  res.send(sampleObj);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
