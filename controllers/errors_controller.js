const app = require("../app");

exports.handleInvalidPaths = (req, res) => {
  res.status(404).send({ msg: "Not Found" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Bad request" });
    } else {
      next(err);
    }
  };

  exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  };
  
  exports.handleInternalServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
  };