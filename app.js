
const express = require("express");
const app = express();
app.use(express.json());


const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerErrors,
} = require("./controllers/errors_controller.js");


const { getAllCategories } = require("./controllers/categories_controller.js")


app.get("/api/categories",getAllCategories);


app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;