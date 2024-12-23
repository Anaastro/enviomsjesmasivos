import axios from "axios";
import * as admin from "firebase-admin";

const db = admin.firestore();

export async function getMessageData(messageId: string) {
	const messageDoc = await db.collection("messages").doc(messageId).get();
	return messageDoc.exists ? messageDoc.data() : null;
}

export async function delayMessageSending() {
	const delay = Math.floor(Math.random() * (15 - 10 + 1) + 10) * 1000;
	return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function updateMessageStatus(
	snap: FirebaseFirestore.DocumentSnapshot,
	status: string,
	error?: string
) {
	const updateData: any = {
		status,
		sentAt: admin.firestore.FieldValue.serverTimestamp(),
	};
	if (error) updateData.error = error;

	await snap.ref.update(updateData);
}

export async function convertImageToBase64(imageUrl: string): Promise<string> {
	try {
		const response = await axios.get(imageUrl, {
			responseType: "arraybuffer",
		});
		return Buffer.from(response.data, "binary").toString("base64");
	} catch (error) {
		throw new Error("No se pudo obtener la imagen.");
	}
}

export async function sendRequest(url: string, body: any) {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${body.waapiApiKey}`,
		},
		body: JSON.stringify(body),
	});
	return await response.json();
}
