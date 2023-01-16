const { auth, firestore, storage } = require("firebase-admin");

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

  // Check if passwords match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .send({ message: "Password and Confirm Password do not match" });
  }

  try {
    // Create Firebase auth user
    const newUser = await auth().createUser({
      email: email,
      password: password,
    });

    // Add user data to Firestore
    await firestore().collection("users").doc(newUser.uid).set({
      firstName,
      lastName,
      mobileNo,
    });

    // Upload profile photo to Firebase Storage
    const uploadProfilePhoto = async (file, fileName) => {
      const bucket = storage().bucket();
      return bucket.upload(file, { destination: fileName });
    };

    // Add timestamp to file name
    const timestamp = Date.now();
    const fileName = `profile_photo_${timestamp}.jpg`;

    await uploadProfilePhoto(profilePhoto, fileName);

    res.status(200).send({ message: "Data and Image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const createToken = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRecord = await auth().getUserByEmail(email);
    if (!userRecord) {
      return res.status(400).send({ message: "User not found" });
    }

    const token = await auth().createCustomToken(userRecord.uid);
    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { email, mobileNo } = req.body;
    const user = await auth().getUserByEmail(email);
    if (!user) {
      res.status(404).send({ message: "No user found with that email" });
    } else {
      const doc = await firestore().collection("users").doc(user.uid).get();
      if (!doc.exists) {
        res.status(404).send({ message: "No user found with that email" });
      } else {
        await firestore().collection("users").doc(doc.id).update({ mobileNo });
        res.status(200).send({ message: "User update successfully" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server error" });
  }
};

module.exports = { createUser, createToken, updateUserDetails };
