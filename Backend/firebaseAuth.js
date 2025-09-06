const admin = require("firebase-admin");

// Function to create a new Firebase user with custom input
const createFirebaseUser = async (email, password, role, userId) => {
  try {
    console.log("Creating Firebase user with password:", password);

    if (!password || typeof password !== "string" || password.length < 6) {
      throw new Error("Invalid password: must be a string with at least 6 characters.");
    }
    const userRecord = await admin.auth().createUser({
      uid: userId,  // Use MySQL user ID as UID
      email: email,
      password: password, // Use provided password
    });

    console.log(`Firebase user created: ${userRecord.uid}`);

    // Add a custom role to the user
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    return userRecord;
  } catch (error) {
    console.error("Error creating Firebase user:", error);
    return null;
  }
};

module.exports = { createFirebaseUser };


