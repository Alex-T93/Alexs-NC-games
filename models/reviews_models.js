const db = require("../db/connection");
const format = require("pg-format");
 
  exports.fetchReviewById = (params) => {
    const { review_id } = params;
    const queryString = "SELECT * FROM reviews WHERE review_id = $1;";
    return db.query(queryString, [review_id])
    .then(({ rows: review }) => {
      if (review[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Review ID Not Found" });
      } else return review[0];
    });
  };
