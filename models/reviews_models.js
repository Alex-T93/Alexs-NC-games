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

  exports.fetchAllReviews = (sort_by = "created_at", order = "desc") => {
    const correctSortBy = [
      "review_id",
      "title",
      "designer",
      "owner",
      "review_img_url",
      "review_body",
      "category",
      "created_at",
      "votes",
      "comment_count",
    ];
    const correctOrder = ["desc", "asc"];
  
    
  let queryString = `
  SELECT
  reviews.review_id,
  reviews.title,
  reviews.designer,
  reviews.owner,
  reviews.review_img_url,
  reviews.review_body,
  reviews.category,
  reviews.created_at,
  reviews.votes,
  COUNT(comment_id)::int AS comment_count
  FROM reviews
  LEFT JOIN comments
  USING (review_id) GROUP BY reviews.review_id`;

  if (!correctSortBy.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: Enter a valid sort_by query",
    });
  }
  if (!correctOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request: Enter a valid order query",
    });
  } else {
    queryString += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;
  }
  return db.query(queryString).then(({ rows: reviews }) => {
    return reviews;
  });
};