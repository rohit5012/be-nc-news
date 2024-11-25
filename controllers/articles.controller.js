const { articleByID } = require("../models/article.model");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  articleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
