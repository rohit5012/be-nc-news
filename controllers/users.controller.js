const { getAllUsers, fetchUserByID } = require("../models/user.model");

exports.getUsers = (req, res, next) => {
  getAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByID = (req, res, next) => {
  const { username } = req.params;
  fetchUserByID(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
