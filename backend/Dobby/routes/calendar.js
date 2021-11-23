var express = require("express");
var router = express.Router();

const calendarController = require("./controller/calendarController");

router.post("/createCalendar", calendarController.createCalendar);
router.post("/getCalendar", calendarController.getUserCalendar);
router.put("/updateCalendar", calendarController.updateUserCalendar);
router.delete("/deleteCalendar", calendarController.deleteUserCalendar);
router.put("/checkCalendar", calendarController.completeUserCalendar);

module.exports = router;
