const { requestTopics, addTopic } = require("../models/topic.model");

exports.getTopics = (req, res, next) => {
  requestTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  addTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
