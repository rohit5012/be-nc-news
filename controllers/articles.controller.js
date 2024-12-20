const {
  articleByID,
  getAllArticles,
  patchArticle,
  checkArticleExists,
  checkTopicExists,
  addArticle,
  deleteArticle,
} = require("../models/article.model");

// exports.getArticles = (req, res, next) => {
//   getAllArticles()
//     .then((articles) => {
//       res.status(200).send({ articles });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };

exports.getArticles = (req, res, next) => {
  const { sort_by, order_by, topic } = req.query;

  const promises = [getAllArticles(sort_by, order_by, topic)];

  if (topic) {
    promises.push(checkTopicExists(topic));
  }

  Promise.all(promises)
    .then(([articles]) => {
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

// exports.postArticle = (req, res, next) => {
//   const { author, title, body, topic, article_img_url } = req.body;

//   addArticle(author, title, body, topic, article_img_url)
//     .then((article_id) => {
//       return fetchArticleByID(article_id);
//     })
//     .then((article) => {
//       res.status(201).send({ article });
//     })
//     .catch(next);
// };

exports.deleteArticleByID = (req, res, next) => {
  const { article_id } = req.params;

  deleteArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
