const db = require("../db/connection");

exports.getAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, message: "Error: Not Found" });
    }
    return rows;
  });
};
