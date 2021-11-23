const { async } = require("@firebase/util");
const { firebase_admin, admin } = require("./../../firebase/fbconfig");

async function userPush(fcmtoken, uid, msg) {
  const userRef = admin.collection("users").doc(uid).collection("tokens");
  const user = await userRef.get();

  if (user.empty) {
    console.log("No token found for user : ", uid);
    return false;
  } else {
    const registrationTokens = [];
    const topic = uid;
    new Promise(async (resolve, reject) => {
      for (let doc of user.docs) {
        registrationTokens.push(doc.data().token);
      }
      await firebase_admin.messaging().subscribeToTopic(registrationTokens, topic)
      .then((res) => {
        console.log('Successfully subscribed to topic:', res);
      })
      .catch((error) => {
        console.log('Error subscribing to topic:', error);
      });

      let message = {
        notification: {
          title: msg.title,
          body: msg.body,
        },
        topic: topic,
      };

      console.log(message);

      await firebase_admin
        .messaging()
        .send(message)
        .then(async (res) => {
          console.log("Successfully sent message : ", res);
          await firebase_admin.messaging().unsubscribeFromTopic(registrationTokens, topic)
          .then((res) => {
            console.log('Successfully unsubscribed from topic:', res);
          })
          .catch((error) => {
            console.log('Error unsubscribing from topic:', error);
          });
        })
        .catch((err) => {
          console.log("Error Sending message! : ", err);
          // return false;
        });
      resolve();
    });
  }
}
async function groupPush(gid, msg) {
  const memberRef = admin.collection("groups").doc(gid).collection("members");
  const member = await memberRef.get();

  const registrationTokens = [];
  const topic = gid;

  new Promise(async (resolve, reject) => {
    for (let doc of member.docs) {
      var tokenRef = admin.collection("users").doc(doc.data().uid).collection("tokens");
      var token = await tokenRef.get();

      for (let docu of token.docs) {
        registrationTokens.push(docu.data().token);
      }
    }

    console.log(registrationTokens);

    await firebase_admin.messaging().subscribeToTopic(registrationTokens, topic)
      .then((res) => {
        console.log('Successfully subscribed to topic:', res);
      })
      .catch((error) => {
        console.log('Error subscribing to topic:', error);
      });

    let message = {
      notification: {
        title: msg.title,
        body: msg.body,
      },
      // token: docu.data().token,
      topic: topic,
    };
    console.log(message);

    await firebase_admin
      .messaging()
      .send(message)
      .then(async (res) => {
        console.log("Successfully sent message : ", res);
        await firebase_admin.messaging().unsubscribeFromTopic(registrationTokens, topic)
        .then((res) => {
          console.log('Successfully unsubscribed from topic:', res);
        })
        .catch((error) => {
          console.log('Error unsubscribing from topic:', error);
        });
      })
      .catch((err) => {
        console.log("Error Sending message! : ", err);
      });
    resolve();
  });
}

module.exports = {
  userPush,
  groupPush,
};
