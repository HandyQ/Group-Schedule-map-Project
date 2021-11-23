var express = require("express");
var router = express.Router();

const tokenController = require("./controller/tokenController");

router.post("/checkToken", tokenController.checkToken);

module.exports = router;