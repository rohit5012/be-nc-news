const { checkArticleExists } = require("../models/article.model");
const { articleComments, postComments } = require("../models/comment.model");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [articleComments(article_id)];

  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComments = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  const checkArticleID = checkArticleExists(article_id);

  const postComment = postComments(username, body, article_id);

  const promise = [checkArticleID, postComment];

  Promise.all(promise)
    .then(([article, comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
