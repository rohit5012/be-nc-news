const db = require("../db/connection");

exports.requestTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ topic }) => {
    return rows;
  });
};
