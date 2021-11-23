var express = require("express");
var router = express.Router();

const groupController = require("./controller/groupController");

router.get("/getAllgroups", groupController.getAllgroups);
router.get("/getGroup", groupController.getGroup);
router.post("/createGroup", groupController.createGroup);
router.put("/updateGroup", groupController.updateGroup);
router.delete("/deleteGroup", groupController.deleteGroup);
router.put("/changePrivate", groupController.changePrivate);
router.put("/addMember", groupController.addMember);
router.delete("/leaveMember", groupController.leaveMember);
router.get("/getPublicGroups", groupController.getPublicgroups);
router.post("/getGroupMember", groupController.getGroupMember);
router.post("/joinGroup", groupController.joinGroup);
router.put("/updateWriterAuth", groupController.updateWriterAuth);
router.put("/changeAdmin", groupController.changeAdmin);

module.exports = router;
