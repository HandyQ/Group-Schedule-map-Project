const { async } = require("@firebase/util");
const { admin, adminauth, auth } = require("./../../firebase/fbconfig");
const Auth = require("./authController");
const FCMCon = require("./FCMController");

async function getGroup(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const uid = req.query.uid;
    if (uid === undefined) {
      res.status(400).json({
        msg: "요청에서 유저 정보가 빠져있습니다.",
      });
    } else {
      const user = admin.collection("users").doc(uid).get();

      if (!user.empty) {
        const groupRef = admin
          .collectionGroup("members")
          .where("uid", "==", uid);
        const group = await groupRef.get();

        if (!group.empty) {
          var groupList = [];
          new Promise(async (resolve, reject) => {
            for (let doc of group.docs) {
              var temRef = admin.collection("groups").doc(doc.data().gid);
              var tem = await temRef.get();

              if (!tem.empty) {
                groupList.push({
                  name: tem.data().name,
                  gid: tem.data().gid,
                });
              }
            }
            resolve();
          }).then(() => {
            res.json({
              group: groupList,
              msg: "그룹 조회 성공",
            });
          });
        } else {
          res.json({
            msg: "그룹이 없습니다.",
          });
        }
      } else {
        res.json({
          msg: "등록된 회원 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

async function getCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.query.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();

      if (!group.empty) {
        const calendarRef = admin
          .collection("groups")
          .doc(gid)
          .collection("groupcalendar");
        const calendar = await calendarRef.get();
        const calendarList = [];

        if (!calendar.empty) {
          new Promise(async (resolve, reject) => {
            for (let doc of calendar.docs) {
              calendarList.push({
                cid: doc.data().cid,
                title: doc.data().title,
                category: doc.data().category,
                content: doc.data().content,
                startDate: doc.data().startDate,
                endDate: doc.data().endDate,
                startTime: doc.data().startTime,
                endTime: doc.data().endTime,
                placeName: doc.data().placeName,
                placeLat: doc.data().placeLat,
                placeLng: doc.data().placeLng,
                allDay: doc.data().allDay,
                color: doc.data().color,
                participant: doc.data().participant,
                creator: doc.data().creator,
                createdAt: doc.data().createdAt,
              });
            }
            resolve();
          }).then(() => {
            res.json({
              calendar: calendarList,
              msg: "그룹 일정 조회 성공",
            });
          });
        } else {
          res.json({
            msg: "그룹 캘린더가 없습니다.",
          });
        }
      } else {
        res.json({
          msg: "등록된 그룹 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

async function createCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    const uid = req.body.uid;
    if (gid === undefined || uid === undefined) {
      res.status(400).json({
        msg: "요청에서 유저 정보 또는 그룹 정보가 빠져있습니다.",
      });
    } else {
      const time = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");

      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();
      const memberRef = admin
        .collection("groups")
        .doc(gid)
        .collection("members");
      const member = await memberRef.get();
      var writer = false;

      if (!group.empty) {
        const calendarRef = admin
          .collection("groups")
          .doc(gid)
          .collection("groupcalendar");

        new Promise(async (resolve, reject) => {
          for (let doc of member.docs) {
            if (doc.data().uid == uid && doc.data().writer == true) {
              writer = true;
              break;
            }
          }
          resolve();
        });

        if (writer) {
          const list = {
            title: req.body.title,
            category: req.body.category,
            content: req.body.content,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            placeName: req.body.placeName,
            placeLat: req.body.placeLat,
            placeLng: req.body.placeLng,
            allDay: req.body.allDay,
            color: req.body.color,
            participant: req.body.participant,
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
                    title: "그룹 일정 생성 알림",
                    body: list.title + "그룹 일정이 등록되었습니다.",
                  };
                  await FCMCon.groupPush(gid, msg);
                  res.json({
                    calendar: doc.data(),
                    msg: "그룹 일정 생성 성공",
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                msg: "그룹 일정 생성 실패",
              });
            });
        } else {
          res.status(403).json({
            msg: "작성 권한이 없습니다.",
          });
        }
      } else {
        res.json({
          msg: "그룹 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

async function updateCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    const uid = req.body.uid;
    const cid = req.body.cid;
    if (gid === undefined || uid === undefined || cid === undefined) {
      res.status(400).json({
        msg: "요청에서 유저 정보 또는 그룹 정보 또는 일정 정보가 빠져있습니다.",
      });
    } else {
      const time = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");
      const calendarRef = admin
        .collection("groups")
        .doc(gid)
        .collection("groupcalendar");
      const calendar = await calendarRef.doc(cid).get();

      if (!calendar.empty) {
        if (calendar.data().creator == uid) {
          const list = {
            cid: req.body.cid,
            title: req.body.title,
            category: req.body.category,
            content: req.body.content,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            placeName: req.body.placeName,
            placeLat: req.body.placeLat,
            placeLng: req.body.placeLng,
            allDay: req.body.allDay,
            color: req.body.color,
            participant: req.body.participant,
            creator: req.body.creator,
            createdAt: time,
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
                    title: "그룹 일정 수정 알림",
                    body: list.title + "그룹 일정이 수정되었습니다.",
                  };
                  await FCMCon.groupPush(gid, msg);
                  res.json({
                    calendar: doc.data(),
                    msg: "그룹 일정 수정 성공",
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                msg: "그룹 일정 수정 실패",
              });
            });
        } else {
          res.status(403).json({
            msg: "그룹 일정은 생성자만 수정할 수 있습니다.",
          });
        }
      } else {
        res.json({
          msg: "그룹 일정 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

async function deleteCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    const cid = req.body.cid;
    const uid = req.body.uid;
    if (gid === undefined || uid === undefined || cid === undefined) {
      res.status(400).json({
        msg: "요청에서 유저 정보 또는 그룹 정보 또는 일정 정보가 빠져있습니다.",
      });
    } else {
      const calendarRef = admin
        .collection("groups")
        .doc(gid)
        .collection("groupcalendar");
      const calendar = await calendarRef.doc(cid).get();
      const calendarName = calendar.data().title;

      if (!calendar.empty) {
        if (calendar.data().creator == uid) {
          calendarRef
            .doc(cid)
            .delete()
            .then(async () => {
              const msg = {
                title: "그룹 일정 삭제 알림",
                body: calendarName + "그룹 일정이 삭제되었습니다.",
              };
              await FCMCon.groupPush(gid, msg);
              res.json({
                msg: "그룹 일정 삭제 성공",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                msg: "그룹 일정 삭제 실패",
              });
            });
        } else {
          res.status(403).json({
            msg: "그룹 일정은 생성자만 삭제할 수 있습니다.",
          });
        }
      } else {
        res.json({
          msg: "그룹 일정 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

async function checkCalendar(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    const uid = req.body.uid;
    const cid = req.body.cid;
    const fcmtoken = "";
    if (gid === undefined || uid === undefined || cid === undefined) {
      res.status(400).json({
        msg: "요청에서 유저 정보 또는 그룹 정보 또는 일정 정보가 빠져있습니다.",
      });
    } else {
      const calendarRef = admin
        .collection("groups")
        .doc(gid)
        .collection("groupcalendar");
      const calendar = await calendarRef.doc(cid).get();

      var participant = calendar.data().participant;
      for (let doc of participant) {
        if (doc.uid == uid) {
          if (doc.completed) {
            doc.completed = false;
            break;
          } else {
            doc.completed = true;
            break;
          }
        }
      }

      if (!calendar.empty) {
        calendarRef
          .doc(cid)
          .update({ participant: participant })
          .then(() => {
            calendarRef
              .doc(cid)
              .get()
              .then(async (doc) => {
                const msg = {
                  title: "그룹 일정 상태 변경 알림",
                  body: doc.data().title + "의 상태가 업데이트 되었습니다.",
                };
                await FCMCon.userPush(fcmtoken,uid, msg);
                res.json({
                  calendar: doc.data(),
                  msg: "그룹 일정 완료여부 변경 성공",
                });
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              msg: "그룹 일정 완료여부 변경 실패",
            });
          });
      } else {
        res.json({
          msg: "그룹 일정 정보가 없습니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

async function checkWriter(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    const uid = req.body.uid;
    if (gid === undefined || uid === undefined) {
      res.status(400).json({
        msg: "요청에서 유저 정보 또는 그룹 정보가 빠져있습니다.",
      });
    } 
    else {
      const memberRef = admin
        .collection("groups")
        .doc(gid)
        .collection("members");
      const member = await memberRef.get();
      let flag = false;
      let writer = false;
      if(!member.empty){
        for (let doc of member.docs) {
          if (doc.data().uid == uid) {
            flag = true;
            if(doc.data().writer){
              writer = true;
            }
          }
        }
        if(flag){      
          res.json({
          writer: writer,
          msg: "쓰기 권한 조회 성공",
          });
        }
        else{
          res.json({
            msg: "그룹 멤버에서 찾을 수 없습니다.",
          });
        }
      }
      else{
        res.json({
          msg: "그룹 멤버가 없습니다.",
        });
      }
    }
  }
  else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

module.exports = {
  getGroup,
  getCalendar,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  checkCalendar,
  checkWriter,
};
