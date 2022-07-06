const db = require("../db/connection");
const format = require("pg-format");
const {checkReviewExists} = require("./checkExists_models.js")

// exports.fetchCommentByReviewId = (review_id) => {
//     const queryString = `
//           SELECT 
//           comment_id,
//           votes,
//           created_at,
//           author,
//           body,
//           review_id
//           FROM comments
//           WHERE review_id = $1
//       `;
//       return db.query(queryString, [review_id]).then(({ rows: reviews }) => {
//         return reviews;
//       });
      
// };
// const connection = require("../db/connection")


exports.fetchCommentByReviewId = (review_id) => {
    return db
    .query(
      `SELECT *
      FROM comments
      WHERE comments.review_id = $1 `, [review_id])
    .then((comment) => { 
      if (!comment.rows.length) {
        return checkReviewExists(review_id)
    }
    return comment.rows;
    })
  }