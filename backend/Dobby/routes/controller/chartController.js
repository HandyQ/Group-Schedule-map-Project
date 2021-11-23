const { async } = require("@firebase/util");
const { admin, adminauth, auth } = require("./../../firebase/fbconfig");
const Auth = require("./authController");

async function getPersonal(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const uid = req.body.uid;
    if(uid === undefined){
      res.status(400).json({
        msg: "요청에서 유저 정보가 빠져있습니다.",
      });
    }
    else{
    const startDate = parseInt(req.body.startDate.replace(/\-/g, ""));
    const endDate = parseInt(req.body.endDate.replace(/\-/g, ""));
    const calendarRef = admin.collection("users").doc(uid).collection("calendar");
    const calendar = await calendarRef.get();

    if (!calendar.empty) {
      var totalCategory = [];
      var checkCategory = [];
      var totalNum = 0;
      var checkNum = 0;
      new Promise(async (resolve, reject) => {
        for (let doc of calendar.docs) {
          if (
            parseInt(doc.data().startDate.replace(/\-/g, "")) >= startDate &&
            parseInt(doc.data().endDate.replace(/\-/g, "")) <= endDate
          ) {
            totalNum += 1;
            if (totalCategory.empty) {
              totalCategory.push({
                category: doc.data().category,
                Num: 1,
              });
            } else {
              let check = false;
              for (let docu of totalCategory) {
                if (docu.category == doc.data().category) {
                  docu.Num += 1;
                  check = true;
                  break;
                }
              }
              if (!check) {
                totalCategory.push({
                  category: doc.data().category,
                  Num: 1,
                });
              }
            }
            if (doc.data().completed == true) {
              checkNum += 1;
              if (checkCategory.empty) {
                checkCategory.push({
                  category: doc.data().category,
                  check: 1,
                  total: 0,
                });
              } else {
                let check = false;
                for (let docu of checkCategory) {
                  if (docu.category == doc.data().category) {
                    docu.check += 1;
                    check = true;
                    break;
                  }
                }
                if (!check) {
                  checkCategory.push({
                    category: doc.data().category,
                    check: 1,
                    total: 0,
                  });
                }
              }
            } else {
              let check = false;
              for (let docu of checkCategory) {
                if (docu.category == doc.data().category) {
                  check = true;
                  break;
                }
              }
              if (!check) {
                checkCategory.push({
                  category: doc.data().category,
                  check: 0,
                  total: 0,
                });
              }
            }
          }
        }
        if (totalNum == 0) {
          reject();
        }
        for (let total of totalCategory) {
          for (let check of checkCategory) {
            if (total.category == check.category) {
              check.total = total.Num;
            }
          }
        }
        resolve();
      })
        .then(() => {
          res.json({
            totalNum: totalNum,
            totalCategory: totalCategory,
            checkNum: checkNum,
            checkCategory: checkCategory,
            msg: "개인 일정 차트 조회 성공",
          });
        })
        .catch(() => {
          res.json({
            msg: "해당 기간 안에 일정 정보가 없습니다.",
          });
        });
    } else {
      res.json({
        msg: "등록된 일정 정보가 없습니다.",
      });
    }
  }
  } else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

async function getGroup(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const uid = req.body.uid;
    const gid = req.body.gid;
    if(uid === undefined || gid === undefined){
      res.status(400).json({
        msg: "요청에서 유저 정보 또는 그룹 정보가 빠져있습니다.",
      });
    }
    else{
    const startDate = parseInt(req.body.startDate.replace(/\-/g, ""));
    const endDate = parseInt(req.body.endDate.replace(/\-/g, ""));
    const calendarRef = admin.collection("groups").doc(gid).collection("groupcalendar");
    const calendar = await calendarRef.get();

    if (!calendar.empty) {
      var totalCategory = [];
      var checkCategory = [];
      var totalNum = 0;
      var checkNum = 0;

      new Promise(async (resolve, reject) => {
        for (let doc of calendar.docs) {
          if (
            parseInt(doc.data().startDate.replace(/\-/g, "")) >= startDate &&
            parseInt(doc.data().endDate.replace(/\-/g, "")) <= endDate
          ) {
            for (let docum of doc.data().participant) {
              if (docum.uid == uid) {
                totalNum += 1;
                if (totalCategory.empty) {
                  totalCategory.push({
                    category: doc.data().category,
                    Num: 1,
                  });
                } else {
                  let check = false;
                  for (let docu of totalCategory) {
                    if (docu.category == doc.data().category) {
                      docu.Num += 1;
                      check = true;
                      break;
                    }
                  }
                  if (!check) {
                    totalCategory.push({
                      category: doc.data().category,
                      Num: 1,
                    });
                  }
                }
                if (docum.uid == uid && docum.completed == true) {
                  checkNum += 1;
                  if (checkCategory.empty) {
                    checkCategory.push({
                      category: doc.data().category,
                      check: 1,
                      total: 0,
                    });
                  } else {
                    let check = false;
                    for (let docu of checkCategory) {
                      if (docu.category == doc.data().category) {
                        docu.check += 1;
                        check = true;
                        break;
                      }
                    }
                    if (!check) {
                      checkCategory.push({
                        category: doc.data().category,
                        check: 1,
                        total: 0,
                      });
                    }
                  }
                }
                if (docum.uid == uid && docum.completed == false) {
                  let check = false;
                  for (let docu of checkCategory) {
                    if (docu.category == doc.data().category) {
                      check = true;
                      break;
                    }
                  }
                  if (!check) {
                    checkCategory.push({
                      category: doc.data().category,
                      check: 0,
                      total: 0,
                    });
                  }
                }
              }
            }
          }
        }
        if (totalNum == 0) {
          reject();
        }
        for (let total of totalCategory) {
          for (let check of checkCategory) {
            if (total.category == check.category) {
              check.total = total.Num;
            }
          }
        }
        resolve();
      })
        .then(() => {
          res.json({
            totalNum: totalNum,
            totalCategory: totalCategory,
            checkNum: checkNum,
            checkCategory: checkCategory,
            msg: "그룹 일정 차트 조회 성공",
          });
        })
        .catch(() => {
          res.json({
            msg: "해당 기간 안에 참여자로 지정 된 그룹 일정 정보가 없습니다.",
          });
        });
    } else {
      res.json({
        msg: "등록된 그룹 일정 정보가 없습니다.",
      });
    }
  }
  } else {
    res.status(401).json({
      error: "Token is not vaild",
    });
  }
}

module.exports = {
  getPersonal,
  getGroup,
};
