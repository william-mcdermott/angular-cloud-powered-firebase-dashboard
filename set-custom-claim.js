
var admin = require("firebase-admin");
var uid = process.argv[2];
var serviceAccount = require("./angular-firebase-grid-da-44a07-firebase-adminsdk-nrvqo-a446144b8b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angular-firebase-grid-da-44a07-default-rtdb.firebaseio.com"
});

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Custom claim set for user');
    process.exit();
  })
  .catch(error => {
    console.log('error', error);
    process.exit(1);
  });
