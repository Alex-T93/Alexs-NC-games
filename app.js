
const express = require("express");
const app = express();
app.use(express.json());


const {
  handleInvalidPaths,
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerErrors,
} = require("./controllers/errors_controller.js");


const { getAllCategories } = require("./controllers/categories_controller.js")
const { getReviewById } = require("./controllers/reviews_controller.js")

app.get("/api/categories",getAllCategories);
app.get("/api/reviews/:review_id", getReviewById)

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});
app.use(handleInvalidPaths);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;