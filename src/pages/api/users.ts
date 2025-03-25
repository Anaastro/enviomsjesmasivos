import { NextApiRequest, NextApiResponse } from "next";
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

const auth = admin.auth();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const listUsersResult = await auth.listUsers();
		const users = listUsersResult.users.map((userRecord) => ({
			uid: userRecord.uid,
			email: userRecord.email,
		}));

		return res.status(200).json({ users });
	} catch (error) {
		console.error("Error fetching users:", error);
		return res.status(500).json({ error: "Error fetching users" });
	}
}
