const functions = require('firebase-functions');
const query = require('./query');
const cors = require('cors')({ origin: true });

const admin = query.admin;

exports.login = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      functions.logger.error("method kong phai Post, got: ", req.method);
      res.send("khong phai Post request!");
      return;
    }
    console.log("method: ", req.method);
    const original = JSON.parse(req.query.text);
    await admin.auth().getUserByEmail(original.email)
      .then(userRecord => {
        if (userRecord.token !== original.token) {
          query.updateUser(original);
        }
        res.json(userRecord);
      })
      .catch(() => {
        // khong co user trong csdl
        query.createUser(original);
      })
  })
});
