const db = require("../db/connection");
const format = require("pg-format");
const {checkReviewExists} = require("./checkExists_models.js")
const { fetchAllUsers } = require("./users_models");


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

exports.addCommentByReviewId = (review_id, username, body) => {
    if (!body) {
      return Promise.reject({
        status: 400,
        msg: "Bad request: Enter a valid comment",
      });
    }
  
    if (!username) {
      return Promise.reject({
        status: 400,
        msg: "Bad request: Please enter a username",
      });
    }
    if (typeof body !== "string" || typeof username !== "string") {
      return Promise.reject({
        status: 400,
        msg: "Bad request: Incorrect valid data type",
      });
    }
    const queryString = `
      INSERT INTO comments
        (review_id, author, body)
      VALUES
        ($1, $2, $3)
      RETURNING *;
      `;
  
    const values = [review_id, username, body];
  
   return fetchAllUsers().then((users) => {
      const allUsernames = users.map((user) => {
        return user.username;
      });
      if (!allUsernames.includes(username)) {
        return Promise.reject({
          status: 400,
          msg: "Bad request: Username does not exist",
        });
      } else {
        return db
          .query(queryString, values)
          .then(({ rows: postedComment }) => {
            return postedComment[0];
          });
      }
    })
}
exports.removeCommentByCommentId = (comment_id) => {
  const queryString = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
  `;
  return db
    .query(queryString, [comment_id])
    .then(({ rows: commentToDelete }) => {
      if (!commentToDelete[0]) {
        return Promise.reject({
          status: 404,
          msg: "Bad request: No comment to delete",
        });
      }
      return commentToDelete;
    });
};
