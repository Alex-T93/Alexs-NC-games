const { fetchCommentByReviewId, addCommentByReviewId, removeCommentByCommentId } = require("../models/comments_models.js");

exports.getCommentByReviewId = (req, res, next) => {
  
const { review_id } = req.params;

  fetchCommentByReviewId(review_id).then((comments) => {
      res.status(200).send({comments})
  }) .catch((err) => {
      next(err)
  })
};
exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;

  addCommentByReviewId(review_id, username, body)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id)
    .then((commentToDelete) => {
      res.status(204).send({ commentToDelete });
    })
    .catch((err) => {
      next(err);
    });
};