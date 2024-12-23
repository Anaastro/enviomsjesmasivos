import { auth, database } from "@/lib/utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		try {
			const { uid } = req.body;

			if (!uid) {
				return res.status(400).json({ message: "No userId provided" });
			}

			const userRef = doc(database, "users", uid);
			const docSnap = await getDoc(userRef);
			if (!docSnap.exists()) {
				return res.status(404).json({ message: "User not found" });
			}

			await setDoc(
				userRef,
				{
					sessionActive: false,
					phone: "",
				},
				{ merge: true }
			);
			return res.status(200).json({ message: "Session updated" });
		} catch (error) {
			console.error("Error updating session:", error);
			return res.status(500).json({ message: "Error updating session" });
		}
	} else {
		return res.status(405).json({ message: "Method Not Allowed" });
	}
}
