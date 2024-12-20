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

const { getTopics, postTopic } = require("./controllers/topics.controller");

const {
  getArticles,
  getArticleByID,
  articleUpdated,
  postArticle,
  deleteArticleByID,
} = require("./controllers/articles.controller");

const {
  getArticleComments,
  postComments,
  updateCommentByID,
  deleteComment,
} = require("./controllers/comments.controller");

const { getUsers, getUserByID } = require("./controllers/users.controller");
// -------------------------------------
app.get("/api", getApi);
// -----------------------------------
app.get("/api/topics", getTopics);
app.post("/api/topics", postTopic);
// -----------------------------------
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByID);
// -------------------------------------
app.get("/api/articles", getArticles);
// app.post("api/articles", postArticle);
app.get("/api/articles/:article_id", getArticleByID);
app.patch("/api/articles/:article_id", articleUpdated);
app.delete("/api/articles/:article_id", deleteArticleByID);

app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComments);

// --------------------------------------
app.get("/api/comments", getArticleComments);
app.post("/api/comments", postComments);
app.patch("/api/comments/:comment_id", updateCommentByID);
app.delete("/api/comments/:comment_id", deleteComment);
// ---------------------------------------
app.use(handleCustomErrors);
app.use(handlePostgreErrors);
app.use(handleServerErrors);

module.exports = app;
