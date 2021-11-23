const { async } = require("@firebase/util");
const { admin, adminauth, auth } = require("./../../firebase/fbconfig");
const Auth = require("./authController");

async function checkToken(req, res, next) {
  const token = req.headers.authorization;
  var valid = false;
  if (token === undefined) {
    res.status(400).json({
      msg: "요청에서 토큰정보가 빠져있습니다.",
    });
  } else {
    await adminauth
      .verifyIdToken(token)
      .then(() => {
        valid = true;
        res.json({
          valid: valid,
          msg: "Token is Valid",
        });
      })
      .catch(() => {
        res.status(401).json({
          valid: valid,
          msg: "Token is Not Valid",
        });
      });
  }
}

module.exports = {
  checkToken,
};
