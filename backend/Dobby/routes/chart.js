var express = require("express");
var router = express.Router();

const chartController = require("./controller/chartController");

router.post("/getPersonal", chartController.getPersonal);
router.post("/getGroup", chartController.getGroup);

module.exports = router;