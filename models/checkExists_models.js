const connection = require("../db/connection")


exports.checkReviewExists = (review_id) => {
    return connection
    .query(`
    SELECT reviews.*
    FROM reviews
    WHERE reviews.review_id = $1 
    LIMIT 1`, [review_id]).then((result) => {
        if(!result.rowCount){
            return Promise.reject({status:404, msg: "Review ID Not Found"})
        } else {
            return result.rows
        }
    })
}