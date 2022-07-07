const db = require("../db/connection");
const format = require("pg-format");
const {checkReviewExists} = require("./checkExists_models.js")

exports.fetchCommentByReviewId = (review_id) => {
    return checkReviewExists(review_id).then((rows)=> {
        if(rows.length === 1)return db
    .query(
      `SELECT 
      comment_id,
      votes,
      created_at,
      author,
      body,
      review_id
      FROM comments
      WHERE comments.review_id = $1 `, [review_id])
    .then((comment) => { 
    return comment.rows;
    })
  })
}
