const db = require("../db/connection");
const format = require("pg-format");


exports.fetchReviewById = (params) => {
  const { review_id } = params;
  let queryString = `SELECT reviews.*, COUNT(comments.comment_id)::INT AS comment_count 
  FROM reviews
  LEFT JOIN comments USING (review_id) WHERE reviews.review_id = $1 GROUP BY reviews.review_id`;
  return db.query(queryString, [review_id])

  .then(({ rows: reviews }) => {
      if (reviews[0] === undefined) {
      return Promise.reject({ status: 404, msg: "Review ID Not Found" });
    } else return reviews[0];
  });
};



exports.updateReviewById = (body, params) => {
    const { inc_votes } = body;
    const { review_id } = params;
    if (!inc_votes) {
      return Promise.reject({
        status: 400,
        msg: "Invalid Request: Please enter the correct input",
      });
    }
    if (isNaN(inc_votes)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid Request: Please enter a number",
      });
    }
    const queryString =
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *";
    return db
      .query(queryString, [inc_votes, review_id])
      .then(({ rows: updated_review }) => {
        if (!updated_review.length) {
          return Promise.reject({
            status: 404,
            msg: "Review ID Not Found",
          });
        } else {
          return updated_review[0];
        }
      });
  };
  