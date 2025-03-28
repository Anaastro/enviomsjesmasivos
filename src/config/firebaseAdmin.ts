// export const firebaseAdmin = require("firebase-admin");

// const serviceAccount = require("./../vosyyo-5b382-firebase-adminsdk-pf5cp-1172d9e580.json");

// if (!firebaseAdmin.apps.length) {
//   firebaseAdmin.initializeApp({
//     credential: firebaseAdmin.credential.cert(serviceAccount),
//   });
// }

// export default firebaseAdmin;

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const auth = admin.auth();
