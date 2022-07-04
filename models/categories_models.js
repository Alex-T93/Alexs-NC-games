const db = require("../db/connection");
const format = require("pg-format");

exports.fetchAllCategories = () => {
  const queryString = "SELECT * FROM categories";
  return db.query(queryString).then(({ rows: categories }) => {
    return categories;
  });
};