const admin = require('firebase-admin');
const app_credentials = require('../app_credentials');

admin.initializeApp({
  credential: admin.credential.cert(app_credentials)
});

async function createUser(user) {
  if (typeof user.uid !== 'string' || user.id == '') {
    console.log("du lieu user khong hop le index.js");
    return;
  }
  await admin.auth().createUser(user)
    .then(userRecord => {
      let uid = user.uid;
      delete user.uid;
      admin.firestore().collection('user').doc(uid).set(user)
        .then(() => {
          console.log("tao user va dang nhap thanh cong ", userRecord.uid);
        })
    })
    .catch(err => {throw err});
}

async function updateUser(user) {
  if (typeof user.uid !== 'string' && user.uid == '') {
    console.log("du lieu user khon hop le index.js");
    return;
  }
  await admin.auth().updateUser(user.uid, user)
    .then(() => {
      let uid = user.uid;
      delete user.uid;
      admin.firestore().collection('user').doc(uid).set(user);
    })
    .then(() => console.log("updated user va dang nhap thanh cong"));
}

module.exports = {
  admin,
  createUser,
  updateUser
}