const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const firebase = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

// service account key

const { createUser, createToken } = require("./controllers/userController");
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "gs://user-2948c.appspot.com",
});

app.post("/user", createUser);
app.get("/user/token", createToken);
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
