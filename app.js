const express = require("express");
const app = express();
const {
  handleCustomErrors,
  handleServerErrors,
  handlePostgreErrors,
} = require("./errors/index");

app.use(express.json());

const { getApi } = require("./controllers/api.controller");

const { getTopics } = require("./controllers/topics.controller");

const {
  getArticles,
  getArticleByID,
  articleUpdated,
} = require("./controllers/articles.controller");

const {
  getArticleComments,
  postComments,
} = require("./controllers/comments.controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", articleUpdated);

app.use(handleCustomErrors);
app.use(handlePostgreErrors);
app.use(handleServerErrors);

module.exports = app;
