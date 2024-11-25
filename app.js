const express = require("express");
const app = express();
const {
  handleCustomErrors,
  handleServerErrors,
  handlePostgreErrors,
} = require("./errors/index");

const { getApi } = require("./controllers/api.controller");

const { getTopics } = require("./controllers/topics.controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use(handleCustomErrors);
app.use(handleServerErrors);
app.use(handlePostgreErrors);

module.exports = app;
