import { NextApiRequest, NextApiResponse } from "next";
import { adminService } from "../../services/adminService";
import { doc } from "firebase/firestore";
import axios from "axios";
import admin, { db, dbRealtime } from "@/lib/utils/firebaseAdmin";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

async function updateMessageCounters(
	status: "sent" | "failed",
	instanceId: string,
	userId: string,
	messageId: string
) {
	const countersRef = dbRealtime.ref(
		`messageCounters/${instanceId}/${userId}/${messageId}`
	);

	let snapshotData = {
		totalMessages: 0,
		sentMessages: 0,
		failedMessages: 0,
	};

	await countersRef.transaction(
		(counters) => {
			if (counters === null) {
				return {
					totalMessages: 1,
					sentMessages: status === "sent" ? 1 : 0,
					failedMessages: status === "failed" ? 1 : 0,
				};
			}

			return {
				totalMessages: counters.totalMessages + 1,
				sentMessages:
					status === "sent" ? counters.sentMessages + 1 : counters.sentMessages,
				failedMessages:
					status === "failed"
						? counters.failedMessages + 1
						: counters.failedMessages,
			};
		},
		(error, committed, snapshot) => {
			if (error) {
				console.error(
					"Error en la transacción de Firebase Realtime Database:",
					error
				);
			} else if (!committed) {
				console.log("La transacción no se pudo realizar.");
			} else {
				console.log("Transacción completada con éxito:", snapshot?.val());
				snapshotData = snapshot?.val();
			}
		}
	);

	return snapshotData;
}

async function createMessageSentLog(
	messageId: string,
	phoneNumber: string,
	status: string,
	error?: string
) {
	const newLogMessage = {
		phoneNumber,
		status,
		error: error ? error : null,
		timestamp: admin.firestore.FieldValue.serverTimestamp(),
	};

	await db
		.collection("messagesSent")
		.doc(messageId)
		.collection("logs")
		.add(newLogMessage);

	console.log("Mensaje:", newLogMessage);
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { phoneNumbers, messageId, instanceId } = req.body;
	try {
		const messageDoc = await db.collection("messages").doc(messageId).get();
		if (!messageDoc.exists) {
			throw new Error("Message not found");
		}

		const messageData = messageDoc.data();

		for (const [index, phoneNumber] of phoneNumbers.entries()) {
			await new Promise((resolve) => setTimeout(resolve, 7000));
			try {
				const chatId = `${phoneNumber.replace("+", "")}@c.us`;

				if (messageData?.imageUrl) {
					const imageBase64 = await axios.get(messageData.imageUrl, {
						responseType: "arraybuffer",
					});

					await adminService.sendWaapiWaMediaMessage({
						waapiApiKey,
						instanceId,
						phoneNumber: chatId,
						mediaCaption: messageData.message,
						mediaName: "imagen.jpg",
						mediaBase64: Buffer.from(imageBase64.data).toString("base64"),
					});
				}

				if (!messageData?.imageUrl) {
					await adminService.sendWaapiWaMessage({
						waapiApiKey,
						instanceId,
						message: messageData?.message,
						phoneNumber: chatId,
					});
				}

				await createMessageSentLog(messageId, phoneNumber, "sent");

				await updateMessageCounters(
					"sent",
					messageData?.instanceId,
					messageData?.userId,
					messageId
				);

				console.log("Mensaje enviado a:", chatId);

				if ((index + 1) % 5 === 0) {
					console.log("Esperando 30 segundos para seguir enviando mensajes");
					await new Promise((resolve) => setTimeout(resolve, 30000));
				}
			} catch (error: any) {
				console.error("Error al enviar mensaje a:", phoneNumber, error);

				await createMessageSentLog(
					messageId,
					phoneNumber,
					"failed",
					error.message
				);

				await updateMessageCounters(
					"failed",
					messageData?.instanceId,
					messageData?.userId,
					messageId
				);
			}
		}

		res.status(200).json({ success: true });
	} catch (error: any) {
		console.error("Whatsapp message sent:", error);
		res.status(404).json({ success: false });
	}
};
export default handler;
