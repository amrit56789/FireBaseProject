const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const firebase = require("firebase-admin");

// service account key
const serviceAccount = require("./serviceAccount.json");
const createUser = require("./controllers/userController");
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: "gs://user-2948c.appspot.com",
});

app.post("/user", createUser);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
