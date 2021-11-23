var express = require("express");
var router = express.Router();

const groupCalendarController = require("./controller/groupCalendarController");

router.get("/getGroup", groupCalendarController.getGroup);
router.get("/getCalendar", groupCalendarController.getCalendar);
router.post("/createCalendar", groupCalendarController.createCalendar);
router.put("/updateCalendar", groupCalendarController.updateCalendar);
router.delete("/deleteCalendar", groupCalendarController.deleteCalendar);
router.put("/checkCalendar", groupCalendarController.checkCalendar);
router.post("/checkWriter", groupCalendarController.checkWriter);


module.exports = router;