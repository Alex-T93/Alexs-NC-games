
const express = require("express");



const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerErrors,
  handleInvalidPaths,
} = require("./controllers/errors_controller.js");


const { getAllCategories } = require("./controllers/categories_controller.js")
const {getReviewByID, patchReviewById, getAllReviews} = require("./controllers/reviews_controller.js")
const { getAllUsers } = require("./controllers/users_controller.js")
const { getCommentByReviewId } = require("./controllers/comments_controller.js");

const app = express();
app.use(express.json());

app.get("/api/reviews/:review_id/comments", getCommentByReviewId);
app.get("/api/categories", getAllCategories);
app.get("/api/reviews/:review_id", getReviewByID)
app.patch("/api/reviews/:review_id", patchReviewById);
app.get("/api/users", getAllUsers);
app.get("/api/reviews", getAllReviews);


app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);
app.use("*", handleInvalidPaths);

module.exports = app;