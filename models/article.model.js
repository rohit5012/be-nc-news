const db = require("../db/connection");

exports.getAllArticles = (sort_by = "created_at", order_by = "DESC", topic) => {
  const validSortBy = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrderBy = ["DESC", "ASC"];

  const queryValues = [];

  let sqlQuery = `SELECT 
  articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT (comments.body) ::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id `;

  if (topic) {
    sqlQuery += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  if (!validOrderBy.includes(order_by) || !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by}`;

  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.articleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.patchArticle = (inc_votes, article_id) => {
  return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [
      inc_votes,
      article_id,
    ])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.addArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = "no img_url"
) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [author])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .then(() => {
      return db
        .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
          }
        });
    })
    .then(() => {
      return db
        .query(
          `INSERT INTO articles(author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [author, title, body, topic, article_img_url]
        )
        .then(({ rows: [{ article_id }] }) => {
          return article_id;
        });
    });
};

exports.deleteArticle = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
