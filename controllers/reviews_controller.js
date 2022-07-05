const { fetchReviewById } = require("../models/reviews_models.js");

exports.getReviewById = (req, res, next) => {
    const params = req.params;
    fetchReviewById(params)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

