const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

// service account key

const {
  createUser,
  createToken,
  updateUserDetails,
  createPost,
} = require("./controllers/userController");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "gs://user-2948c.appspot.com",
});

app.post("/user", createUser);
app.get("/user/token", createToken);
app.patch("/user/update", updateUserDetails);
app.post("/createpost", createPost);
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
