const { fetchReviewById, updateReviewById, fetchReviews }= require("../models/reviews_models.js");



  exports.getReviewByID = (req, res, next) => {
    const params = req.params;
    fetchReviewById(params)
      .then((review) => {
        res.status(200).send({ review });
      })
      .catch((err) => {
        next(err);
      });
  };
  exports.patchReviewById = (req, res, next) => {
    const body = req.body;
    const params = req.params;
    updateReviewById(body, params)
      .then((updated_review) => {
        res.status(200).send({ updated_review });
      })
      .catch((err) => {
        next(err);
      });
  };

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  fetchReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};
