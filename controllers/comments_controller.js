const { fetchCommentByReviewId } = require("../models/comments_models.js");

exports.getCommentByReviewId = (req, res, next) => {
  
const { review_id } = req.params;

  fetchCommentByReviewId(review_id).then((comments) => {
      res.status(200).send({comments})
  }) .catch((err) => {
      next(err)
  })
};
