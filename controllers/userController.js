const { auth } = require("firebase-admin");
const { firestore, firebase } = require("firebase-admin");
const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    mobileNo,
    profilePhoto,
    email,
    password,
    confirmPassword,
  } = req.body;
  try {
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ message: "Password and Confirm Password do not match" });
    }

    const newUser = await auth().createUser({
      email: email,
      password: password,
    });

    await firestore().collection("users").doc(newUser.uid).set({
      firstName,
      lastName,
      mobileNo,
    });
    res.status(200).send({ message: "Successfully added" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = createUser;
