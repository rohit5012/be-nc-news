const {
  articleByID,
  getAllArticles,
  patchArticle,
  checkArticleExists,
} = require("../models/article.model");

exports.getArticles = (req, res, next) => {
  getAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

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

exports.articleUpdated = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const articleUpdate = patchArticle(inc_votes, article_id);

  const checkArticleID = checkArticleExists(article_id);

  const promises = [articleUpdate, checkArticleID];

  Promise.all(promises)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
