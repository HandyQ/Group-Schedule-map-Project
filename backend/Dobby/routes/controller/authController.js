const { adminauth } = require("./../../firebase/fbconfig");

async function verifyToken(reqtoken) {
  const token = reqtoken;

  let valid = false;
  if (token === undefined) {
    console.log("token is Undefined");
    valid = false;

    return valid;
  } else {
    await adminauth
      .verifyIdToken(token)
      .then(() => {
        console.log("Token is Valid");
        valid = true;
      })
      .catch(() => {
        console.log("Token is Not Valid");
        valid = false;
      });
    return valid;
  }
}

module.exports = {
  verifyToken,
};
