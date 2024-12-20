const db = require("../db/connection");

exports.articleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.postComments = (username, body, article_id) => {
  if (!username) {
    return Promise.reject({ status: 400, msg: "please add username" });
  }

  if (!body) {
    return Promise.reject({ status: 400, msg: "please add body" });
  }
  if (typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db
    .query(
      `INSERT INTO comments(author,body,article_id) VALUES ($1, $2, $3)RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchComment = (updatedVotes, comment_id) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [updatedVotes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.commentDeleted = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1  RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
    });
};
