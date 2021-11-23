const { calculateBackoffMillis } = require("@firebase/util");
const { admin, adminauth, auth } = require("./../../firebase/fbconfig");
const FCMCon = require("./FCMController");
const Auth = require("./authController");

async function getAllgroups(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const groupsRef = admin.collection("groups");
    const groups = await groupsRef.get();

    if (groups.empty) {
      return res.json({
        msg: "생성된 그룹이 없습니다.",
      });
    } else {
      const groupsList = [];
      groups.forEach((doc) => {
        groupsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return res.json({
        msg: "그룹 조회 성공",
        groups: groupsList,
      });
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function getPublicgroups(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const groupRef = admin.collection("groups").where("private", "==", false);
    const groups = await groupRef.get();

    if (groups.empty) {
      return res.json({
        msg: "생성된 그룹이 없습니다.",
      });
    } else {
      const groupsList = [];
      groups.forEach((doc) => {
        groupsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return res.json({
        msg: "그룹 조회 성공",
        groups: groupsList,
      });
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function getGroup(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.query.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const groupsRef = admin.collection("groups").doc(gid);
      const group = await groupsRef.get();

      if (!group.empty) {
        const adminRef = await groupsRef.collection("members").where("admin", "==", true).get();
        const admin = adminRef.docs[0].data();

        const groupmemberRef = groupsRef.collection("members");
        const groupmembers = await groupmemberRef.get();

        const groupmembersList = [];
        groupmembers.forEach((doc) => {
          groupmembersList.push({
            ...doc.data(),
          });
        });

        const groupdata = {
          admin: admin.email,
          ...group.data(),
          members: groupmembersList,
        };

        res.json({
          group: groupdata,
          msg: "그룹 조회 성공",
        });
      } else {
        return res.json({
          message: "존재하지 않는 그룹입니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function getGroupMember(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const membersRef = admin.collection("groups").doc(gid).collection("members");
      const members = await membersRef.get();

      if (!members.empty) {
        const membersList = [];
        members.forEach((doc) => {
          membersList.push({
            ...doc.data(),
          });
        });

        return res.json({
          msg: "그룹 멤버 조회 성공",
          members: membersList,
        });
      } else {
        return res.json({
          msg: "존재하지 않는 그룹입니다.",
        });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function createGroup(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const uid = req.body.uid;
    if (uid === undefined) {
      res.status(400).json({
        msg: "요청에서 유저 정보가 빠져있습니다.",
      });
    } else {
      const time = new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "");

      // group collection에 새로운 그룹 추가
      // group collection의 새로 만든 group document에 gid update
      // group collection 의 group document 에 멤버(자기자신) add
      const groupRef = admin.collection("groups");
      const group = await groupRef.add({
        // name: req.body.name,
        // description: req.body.description,
        // private: req.body.private,
        // password: req.body.password,
        ...req.body,
        createdAt: time,
      });

      groupRef
        .doc(group.id)
        .update({ gid: group.id })
        .then(async () => {
          // 멤버에 생성자 추가
          const user = await admin.collection("users").doc(uid).get();

          const userdata = user.data();

          await admin
            .collection("groups")
            .doc(group.id)
            .collection("members")
            .add({
              gid: group.id,
              uid: userdata.uid,
              name: userdata.name,
              email: userdata.email,
              nickname: userdata.nickname,
              admin: true,
              writer: true,
            })
            .then((doc) => {
              groupRef.doc(group.id).update({
                uid: doc.id,
              });
            });

          await groupRef
            .doc(group.id)
            .get()
            .then(async (doc) => {
              const gid = doc.data().gid;
              const msg = {
                title: "새로운 그룹 생성",
                body: doc.data().name + " 그룹이 생성 되었습니다.",
              };
              await FCMCon.groupPush(gid, msg);
              res.json({
                group: doc.data(),
                msg: "그룹 생성 성공",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                msg: "그룹 생성 실패",
              });
            });
        });
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function updateGroup(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();

      if (group.empty) {
        return res.json({
          msg: "존재하지 않는 그룹입니다.",
        });
      } else {
        await groupRef
          .update({
            description: req.body.description,
            private: req.body.private,
            password: req.body.password,
            name: req.body.name,
          })
          .then(() => {
            console.log("Group updated successfully for group: " + gid);
            const groupdata = {};

            groupRef.get().then(async (data) => {
              const msg = {
                title: "그룹 정보 수정",
                body: data.data().name + " 그룹 정보가 수정 되었습니다.",
              };
              await FCMCon.groupPush(gid, msg);
              return res.json({
                group: data.data(),
                msg: "그룹 정보 수정 성공",
              });
            });
          })
          .catch((error) => {
            console.log("Error updating group : ", error);
            return res.status(500).json({
              msg: "그룹 정보 수정 실패",
            });
          });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function deleteGroup(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();

      const gname = group.data().name;
      if (group.empty) {
        return res.json({
          msg: "존재하지 않는 그룹입니다.",
        });
      } else {
        const groupMemberRef = admin.collection("groups").doc(gid).collection("members");
        const groupMembers = await groupMemberRef.get();

        const groupCalendarRef = admin.collection("groups").doc(gid).collection("calendar");
        const groupCalendars = await groupCalendarRef.get();

        if (!groupMembers.empty) {
          groupMembers.forEach((doc) => {
            groupMemberRef.doc(doc.id).delete();
          });
        }
        if (!groupCalendars.empty) {
          groupCalendars.forEach((doc) => {
            groupCalendarRef.doc(doc.id).delete();
          });
        }

        await groupRef
          .delete()
          .then(async () => {
            console.log("Group deleted successfully for group: " + gid);
            const msg = {
              title: "그룹 정보 삭제",
              body: gname + " 그룹이 삭제 되었습니다.",
            };
            await FCMCon.groupPush(gid, msg);
            return res.json({
              msg: "그룹 삭제 성공",
            });
          })
          .catch((error) => {
            console.log("Error deleting group : ", error);
            return res.status(500).json({
              msg: "그룹 삭제 실패",
            });
          });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}
async function changePrivate(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();

      var private = false;
      if (req.body.private) {
        private = false;
      } else {
        private = true;
      }
      if (group.empty) {
        return res.json({
          msg: "존재하지 않는 그룹입니다.",
        });
      } else {
        await groupRef
          .update({
            private: private,
          })
          .then(() => {
            console.log("Group updated successfully for group: " + gid);
            return res.json({
              msg: "그룹 정보 수정 성공",
            });
          })
          .catch((error) => {
            console.log("Error updating group : ", error);
            return res.status(500).json({
              msg: "그룹 정보 수정 실패",
            });
          });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}
async function addMember(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();
      const gname = group.data().name;
      if (!group.exists) {
        return res.json({
          msg: "존재하지 않는 그룹입니다.",
        });
      } else {
        const userRef = admin.collection("users").where("email", "==", req.body.email);
        const user = await userRef.get();

        if (user.empty) {
          return res.json({
            msg: "존재하지 않는 유저입니다.",
          });
        } else {
          const userdata = user.docs[0].data();
          const groupMemberRef = admin.collection("groups").doc(gid).collection("members");
          const groupMember = await groupMemberRef.where("uid", "==", userdata.uid).get();

          if (groupMember.empty) {
            groupMemberRef
              .add({
                gid: gid,
                uid: userdata.uid,
                name: userdata.name,
                email: userdata.email,
                nickname: userdata.nickname,
                admin: false,
                writer: false,
              })
              .then(async () => {
                console.log("Group Member updated successfully for group: " + gid);
                const msg = {
                  title: "그룹 멤버 추가",
                  body: gname + " 그룹에 새로운 멤버가 입장하였습니다.",
                };
                await FCMCon.groupPush(gid, msg);
                return res.json({
                  msg: "그룹 멤버 추가 성공",
                });
              })
              .catch((error) => {
                console.log("Error Member updating group : ", error);
                return res.status(500).json({
                  error: "그룹 멤버 추가 실패",
                });
              });
          } else {
            console.log("User already in group");
            return res.json({
              msg: "이미 존재하는 유저입니다.",
            });
          }
        }
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }

  // List all users
  // if (group.empty) {
  //   return res.status(401).json({
  //     msg: "존재하지 않는 그룹입니다.",
  //   });
  // } else {
  //   const members = new Set(req.body.members);
  //   new Promise(async (resolve, reject) => {
  //     for (let data of members) {
  //       const groupmemberRef = await groupRef
  //         .collection("members")
  //         .where("email", "==", data)
  //         .get();

  //       if (groupmemberRef.empty) {
  //         const userRef = await admin.collection("users").where("email", "==", data).get();
  //         const member = userRef.docs[0].data();

  //         groupRef
  //           .collection("members")
  //           .add({
  //             gid: gid,
  //             name: member.name,
  //             email: member.email,
  //             uid: member.uid,
  //             nickname: member.nickname,
  //             admin: false,
  //             writer: false,
  //           })
  //           .then(() => {
  //             console.log("Group Member updated successfully for group: " + gid);
  //           })
  //           .catch((error) => {
  //             console.log("Error Member updating group : ", error);
  //           });
  //       } else {
  //         console.log("User already in group");
  //       }
  //     }
  //     resolve();
  //   })
  //     .then(() => {
  //       res.json({
  //         msg: "멤버 업데이트 성공",
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       res.status(401).json({
  //         msg: "멤버 추가에 문제가 발생하였습니다.",
  //       });
  //     });
  //   try {
  //     members.forEach(async (data) => {
  //       const groupmemberRef = await groupRef
  //         .collection("members")
  //         .where("email", "==", data)
  //         .get();

  //       if (groupmemberRef.empty) {
  //         const userRef = await admin
  //           .collection("users")
  //           .where("email", "==", data)
  //           .get();
  //         const member = userRef.docs[0].data();

  //         groupRef
  //           .collection("members")
  //           .add({
  //             gid: gid,
  //             name: member.name,
  //             email: member.email,
  //             uid: member.uid,
  //             nickname: member.nickname,
  //             admin: false,
  //             writer: false,
  //           })
  //           .then(() => {
  //             console.log(
  //               "Group Member updated successfully for group: " + gid
  //             );
  //           })
  //           .catch((error) => {
  //             console.log("Error Member updating group : ", error);
  //           });
  //       } else {
  //         console.log("User already in group");
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(401).json({
  //       msg: "멤버 추가에 문제가 발생하였습니다.",
  //     });
  //   } finally {
  //     res.json({
  //       msg: "멤버 업데이트 성공",
  //     });
  //   }
  // }
}

async function leaveMember(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();

      if (group.empty) {
        return res.json({
          message: "존재하지 않는 그룹입니다.",
        });
      } else {
        const userRef = await admin
          .collection("users")
          .where("nickname", "==", req.body.nickname)
          .get();
        const user = userRef.docs[0].data();

        const memberRef = await groupRef.collection("members").where("uid", "==", user.uid).get();

        if (memberRef.empty) {
          return res.json({
            message: "존재하지 않는 멤버입니다.",
          });
        } else {
          const member = memberRef.docs[0].id;
          groupRef
            .collection("members")
            .doc(member)
            .delete()
            .then(() => {
              console.log("Group Member deleted successfully for group: " + gid);
              res.json({
                msg: "멤버 삭제 성공",
              });
            })
            .catch((error) => {
              console.log("Error deleting group : ", error);
              res.status(500).json({
                msg: "멤버 삭제 실패",
              });
            });
        }
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function joinGroup(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    const uid = req.body.uid;
    if (gid === undefined || uid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보 또는 유저 정보가 빠져있습니다.",
      });
    } else {
      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();

      if (group.empty) {
        return res.json({
          msg: "존재하지 않는 그룹입니다.",
        });
      } else {
        const userRef = admin.collection("users").doc(uid);
        const user = await userRef.get();

        if (!user.exists) {
          return res.json({
            msg: "존재하지 않는 유저입니다.",
          });
        } else {
          const groupmemberRef = await groupRef.collection("members").where("uid", "==", uid).get();

          if (groupmemberRef.empty) {
            groupRef
              .collection("members")
              .add({
                gid: gid,
                name: user.data().name,
                email: user.data().email,
                uid: user.data().uid,
                nickname: user.data().nickname,
                admin: false,
                writer: false,
              })
              .then(async () => {
                console.log("Group Join successfully for group: " + gid);
                const msg = {
                  title: "그룹 멤버 추가",
                  body: user.data().name + " 그룹에 새로운 멤버가 입장하였습니다.",
                };
                await FCMCon.groupPush(gid, msg);
                res.json({
                  msg: "그룹 가입 성공",
                });
              })
              .catch((error) => {
                console.log("Error Join Group : ", error);
                res.status(500).json({
                  msg: "그룹 가입 실패",
                });
              });
          } else {
            console.log("User already in group");
            res.json({
              msg: "멤버 업데이트 성공",
            });
          }
        }
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function updateWriterAuth(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();

      if (group.empty) {
        res.json({
          msg: "존재하는 그룹이 없습니다.",
        });
      } else {
        const memberRef = groupRef.collection("members");
        const member = await memberRef.where("nickname", "==", req.body.nickname).get();

        if (member.empty) {
          res.json({
            msg: "그룹에 해당하는 멤버가 없습니다.",
          });
        }
        const mid = member.docs[0].id;
        console.log(mid);
        await groupRef
          .collection("members")
          .doc(mid)
          .update({
            writer: req.body.writer,
          })
          .then(async () => {
            await memberRef
              .doc(mid)
              .get()
              .then((doc) => {
                console.log("Writer Auth change successfully for members : " + doc.id);
                res.json({
                  memberNickname: doc.data().nickname,
                  msg: "멤버 업데이트 성공",
                });
              });
          })
          .catch((error) => {
            console.log("Error Change Write Auth : " + error);
            res.status(500).json({
              error: error,
            });
          });
      }
    }
  } else {
    res.status(401).json({
      error: "Token is not valid",
    });
  }
}

async function changeAdmin(req, res, next) {
  const valid = await Auth.verifyToken(req.headers.authorization);

  if (valid) {
    const gid = req.body.gid;
    if (gid === undefined) {
      res.status(400).json({
        msg: "요청에서 그룹 정보가 빠져있습니다.",
      });
    } else {
      const currentAdminuid = req.body.currentuid;
      const changeAdminNickname = req.body.changenickname;

      const groupRef = admin.collection("groups").doc(gid);
      const group = await groupRef.get();

      if (group.empty) {
        console.log("해당 그룹이 없습니다.");
        res.json({
          error: "해당 그룹이 없습니다.",
        });
      } else {
        const memberRef = admin.collection("groups").doc(gid).collection("members");
        const currentAdmin = await memberRef
          .where("uid", "==", currentAdminuid)
          .get()
          .then((doc) => {
            if (doc.empty) {
              console.log("그룹에 해당 멤버가 없습니다.");
              res.json({
                error: "그룹에 해당 멤버(Admin)가 없습니다.",
              });
            } else {
              data = doc.docs[0].data();
              if (data.admin) {
                return {
                  mid: doc.docs[0].id,
                  ...data,
                };
              } else {
                console.log("그룹장이 아닙니다.");
                res.json({
                  error: error,
                });
              }
            }
          });

        const changeAdmin = await memberRef
          .where("nickname", "==", changeAdminNickname)
          .get()
          .then((doc) => {
            if (doc.empty) {
              console.log("그룹에 해당 멤버가 없습니다.");
              res.json({
                error: error,
              });
            } else {
              return {
                mid: doc.docs[0].id,
                ...doc.docs[0].data(),
              };
            }
          });

        groupRef
          .update({
            uid: changeAdmin.mid,
          })
          .then(() => {
            memberRef.doc(currentAdmin.mid).update({
              admin: false,
            });

            memberRef
              .doc(changeAdmin.mid)
              .update({
                admin: true,
                writer: true,
              })
              .then(() => {
                res.json({
                  msg: "그룹장이 변경되었습니다.",
                });
              });
          })
          .catch((error) => {
            console.log("Error Change Admin : ", error);
            res.status(500).json({
              error: error,
            });
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
  getAllgroups,
  getGroup,
  getPublicgroups,
  getGroupMember,
  createGroup,
  updateGroup,
  deleteGroup,
  changePrivate,
  addMember,
  leaveMember,
  joinGroup,
  updateWriterAuth,
  changeAdmin,
};
