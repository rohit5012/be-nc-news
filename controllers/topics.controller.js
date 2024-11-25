const { requestTopics } = require("../models/topic.model");

exports.getTopics = (req, res, next) => {
  requestTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
