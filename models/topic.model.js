const db = require("../db/connection");

exports.requestTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.addTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
