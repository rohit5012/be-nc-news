const express = require("express");
const cors = require("cors");
const app = express();
const {
  handleCustomErrors,
  handleServerErrors,
  handlePostgreErrors,
} = require("./errors/index");

app.use(cors());
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
  deleteComment,
} = require("./controllers/comments.controller");

const { getUsers } = require("./controllers/users.controller");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", articleUpdated);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handleCustomErrors);
app.use(handlePostgreErrors);
app.use(handleServerErrors);

module.exports = app;
