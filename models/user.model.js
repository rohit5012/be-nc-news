const db = require("../db/connection");

exports.getAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, message: "Error: Not Found" });
    }
    return rows;
  });
};

exports.fetchUserByID = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};
