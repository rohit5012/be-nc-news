const { checkArticleExists } = require("../models/article.model");
const {
  articleComments,
  postComments,
  patchComment,
  commentDeleted,
} = require("../models/comment.model");

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

exports.updateCommentByID = (req, res, next) => {
  const updatedVotes = req.body.inc_votes;
  const { comment_id } = req.params;

  patchComment(updatedVotes, comment_id)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  commentDeleted(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
