const { async } = require("@firebase/util");
const { admin, adminauth, auth } = require("./../../firebase/fbconfig");
const FCMCon = require("./FCMController");
const Auth = require("./authController");

async function getUserCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const uid = req.body.uid;
    if (uid == undefined) {
      res.status(400).json({
        error: "필수 입력값이 입력되지 않았습니다.",
      });
    } else {
      const user = admin.collection("users").doc(uid).get();

      if (!user.empty) {
        const calendarRef = admin.collection("users").doc(uid).collection("calendar");
        const calendar = await calendarRef.get();

        if (!calendar.empty) {
          const calendarData = calendar.docs.map((doc) => doc.data());
          res.status(200).json({
            id: calendarData.creator,
            calendar: calendarData,
          });
        } else {
          res.status(200).json({
            msg: "일정 정보가 없습니다.",
          });
        }
      } else {
        res.status(200).json({
          msg: "회원 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function createCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);
  if (valid) {
    const uid = req.body.uid;
    const fcmtoken = req.headers.fcmtoken;

    if (uid == undefined) {
      res.status(400).json({
        error: "필수 입력값이 입력되지 않았습니다.",
      });
    } else {
      const time = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");

      const user = admin.collection("uesr").doc(uid).get();

      if (!user.empty) {
        const calendarRef = admin.collection("users").doc(uid).collection("calendar");

        const list = {
          title: req.body.title,
          content: req.body.content,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          placeName: req.body.placeName,
          placeLat: req.body.placeLat,
          placeLng: req.body.placeLng,
          calendar: req.body.calendar,
          allDay: req.body.allDay,
          color: req.body.color,
          category: req.body.category,
          completed: false,
          creator: uid,
          createdAt: time,
        };

        const calendar = await calendarRef.add(list);
        calendarRef
          .doc(calendar.id)
          .update({ cid: calendar.id })
          .then(() => {
            calendarRef
              .doc(calendar.id)
              .get()
              .then(async (doc) => {
                const msg = {
                  title: "일정 생성 알림",
                  body: list.title + "일정이 등록되었습니다.",
                };
                await FCMCon.userPush(fcmtoken, uid, msg);
                res.json({
                  calendar: doc.data(),
                  msg: "일정 생성 성공",
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "일정 생성 실패",
            });
          });
      } else {
        res.status(200).json({
          msg: "회원 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function deleteUserCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const uid = req.body.uid;
    const cid = req.body.cid;
    const fcmtoken = req.headers.fcmtoken;
    if (req.body.uid == undefined || req.body.cid == undefined) {
      res.status(400).json({
        error: "필수 입력값이 입력되지 않았습니다.",
      });
    } else {
      const calendarRef = admin.collection("users").doc(uid).collection("calendar");
      const calendar = await calendarRef.doc(cid).get();
      const calendarname = calendar.data().title;
      if (!calendar.empty) {
        calendarRef
          .doc(cid)
          .delete()
          .then(async () => {
            const msg = {
              title: "일정 삭제 알림",
              body: calendarname + " 일정이 삭제 되었습니다.",
            };
            await FCMCon.userPush(fcmtoken, uid, msg);
            res.json({
              msg: "일정 삭제 성공",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "일정 삭제 실패",
            });
          });
      } else {
        res.status(200).json({
          error: "일정 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}
async function updateUserCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const uid = req.body.uid;
    const cid = req.body.cid;
    const fcmtoken = req.headers.fcmtoken;
    if (uid == undefined || cid == undefined) {
      res.status(400).json({
        error: "필수 입력값이 입력되지 않았습니다.",
      });
    } else {
      const time = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");
      const calendarRef = admin.collection("users").doc(uid).collection("calendar");
      const calendar = await calendarRef.doc(cid).get();

      if (!calendar.empty) {
        const list = {
          title: req.body.title,
          content: req.body.content,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          placeName: req.body.placeName,
          placeLat: req.body.placeLat,
          placeLng: req.body.placeLng,
          calendar: req.body.calendar,
          allDay: req.body.allDay,
          color: req.body.color,
          category: req.body.category,
          completed: req.body.completed,
          timeStamp: time,
        };

        calendarRef
          .doc(cid)
          .update(list)
          .then(() => {
            calendarRef
              .doc(cid)
              .get()
              .then(async (doc) => {
                const msg = {
                  title: "일정 업데이트 알림",
                  body: list.title + " 일정이 수정되었습니다.",
                };
                await FCMCon.userPush(fcmtoken, uid, msg);
                res.json({
                  calendar: doc.data(),
                  msg: "일정 수정 성공",
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "일정 수정 실패",
            });
          });
      } else {
        res.status(200).json({
          msg: "일정 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function completeUserCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const uid = req.body.uid;
    const cid = req.body.cid;
    const fcmtoken = req.headers.fcmtoken;

    if (uid == undefined || cid == undefined) {
      res.status(400).json({
        error: "필수 입력값이 입력되지 않았습니다.",
      });
    } else {
      const calendarRef = admin.collection("users").doc(uid).collection("calendar");
      const calendar = await calendarRef.doc(cid).get();

      var value;
      if (calendar.data().completed) {
        value = false;
      } else {
        value = true;
      }

      if (!calendar.empty) {
        calendarRef
          .doc(cid)
          .update({ completed: value })
          .then(() => {
            calendarRef
              .doc(cid)
              .get()
              .then(async (doc) => {
                const msg = {
                  title: "일정 상태 변경 알림",
                  body: doc.data().title + "가 상태가 업데이트 되었습니다.",
                };
                await FCMCon.userPush(fcmtoken, uid, msg);
                res.json({
                  calendar: doc.data(),
                  msg: "일정 완료여부 변경 성공",
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "일정 완료여부 변경 실패",
            });
          });
      } else {
        res.status(200).json({
          msg: "일정 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

module.exports = {
  getUserCalendar,
  createCalendar,
  deleteUserCalendar,
  updateUserCalendar,
  completeUserCalendar,
};
