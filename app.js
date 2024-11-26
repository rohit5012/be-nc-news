const express = require("express");
const app = express();
const {
  handleCustomErrors,
  handleServerErrors,
  handlePostgreErrors,
} = require("./errors/index");

// app.use(express.json());

const { getApi } = require("./controllers/api.controller");

const { getTopics } = require("./controllers/topics.controller");

const {
  getArticles,
  getArticleByID,
} = require("./controllers/articles.controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.use(handleCustomErrors);
app.use(handlePostgreErrors);
app.use(handleServerErrors);

module.exports = app;
