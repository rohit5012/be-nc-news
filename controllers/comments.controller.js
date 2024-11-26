const { checkArticleExists } = require("../models/article.model");
const { articleComments } = require("../models/comment.model");

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
