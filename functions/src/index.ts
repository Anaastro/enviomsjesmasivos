import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import { Promise } from "bluebird";
import cors = require("cors");
import * as crypto from "crypto";

admin.initializeApp();

const cheerio = require("cheerio");
const db = admin.firestore();
const dbRealtime = admin.database();

const apiUrl = functions.config().api.url;
const waapiKey = functions.config().api.waapi.key;

const allowedOrigins = [
	"https://sistypescript.vercel.app",
	"http://localhost:3000",
];

const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) => {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("No permitido por CORS"));
		}
	},
	methods: ["GET", "POST"],
};

export const getSkNumbers = functions
	.runWith({ timeoutSeconds: 540 })
	.https.onRequest((req, res) => {
		cors(corsOptions)(req, res, async () => {
			if (req.method !== "POST") {
				return res.status(405).json({ error: "Método no permitido" });
			}

			const { locationCountryCode, locationRegion, pageNumber, userId } =
				req.body;

			if (!locationCountryCode || !locationRegion || !pageNumber || !userId) {
				return res.status(400).json({ error: "Faltan parámetros requeridos." });
			}

			const region = locationRegion.toLowerCase().replace(/ /g, "-");
			const country = locationCountryCode.toLowerCase();

			try {
				const allResults: any[] = [];

				await Promise.map(new Array(Number(pageNumber)), async (_, index) => {
					const pageIndexUrl = `https://${country}.skokka.com/escorts/${region}/?p=${
						index + 1
					}`;
					const currentPage = index + 1;
					const hrefPages: string[] = [];

					const dataFetched = await fetch(pageIndexUrl);
					const dataHtml = await dataFetched.text();

					const $ = cheerio.load(dataHtml);
					const listingItems = $(".item-content");

					listingItems.each((_: any, el: any) => {
						const href = $(el).find("a").attr("href");
						if (href) hrefPages.push(href);
					});

					await Promise.each(hrefPages, async (href, idx) => {
						const pageFetched = await fetch(href);
						const pageHtml = await pageFetched.text();
						const $ = cheerio.load(pageHtml);
						const whatsAppButton = $("whatsapp-button").attr("button-href");
						let phone = extractPhone(whatsAppButton);

						const pushObject = {
							id: crypto.randomUUID(),
							phone: `+${phone}`,
							name: `Red ${locationRegion} ${currentPage} ${idx + 1}`,
						};

						allResults.push(pushObject);
					});
				});

				await Promise.each(allResults, async (el) => {
					await admin
						.firestore()
						.collection("contacts")
						.doc(userId)
						.collection("phones")
						.add({
							...el,
							createdAt: admin.firestore.FieldValue.serverTimestamp(),
						});
				});

				return res.status(200).json({ allResults });
			} catch (error) {
				console.error("Error in Cloud Function:", error);
				return res
					.status(500)
					.json({ success: false, error: "Failed to process request" });
			}
		});
	});

export const processMessagesQueue = functions
	.runWith({ timeoutSeconds: 300, memory: "1GB" })
	.firestore.document("messageQueue/{messageQueueId}")
	.onWrite(async (change, context) => {
		const messageQueueData = change.after.data();
		if (!messageQueueData) return;

		if (messageQueueData.status !== "inProgress") return;

		await processBatchMessages(change.after, context);
	});

async function processBatchMessages(
	snap: FirebaseFirestore.DocumentSnapshot,
	context: functions.EventContext
) {
	const messageQueueData = snap.data();
	if (!messageQueueData) return;

	const { lastProcessedPhoneIndex, phoneNumbers, sentBy } = messageQueueData;
	const BATCH_SIZE = 15;
	const messageData = await getMessageData(messageQueueData.messageId);
	if (!messageData) return;

	const startBatchIndex = lastProcessedPhoneIndex ?? 0;
	const endBatchIndex = Math.min(
		startBatchIndex + BATCH_SIZE,
		phoneNumbers.length
	);

	for (let i = startBatchIndex; i < endBatchIndex; i++) {
		const phoneNumber = phoneNumbers[i];
		await delay(5000);

		try {
			await sendMessageToAPI(
				phoneNumber,
				messageData.message,
				messageQueueData.instanceId,
				messageData.imageUrl
			);
			await createMessageSentLog(
				messageQueueData.messageId,
				phoneNumber,
				"sent",
				sentBy
			);
			await updateMessageCounters(
				"sent",
				messageData.instanceId,
				messageData.userId,
				messageQueueData.messageId
			);
			console.log("Mensaje enviado a:", phoneNumber);
		} catch (error: any) {
			console.error("Error enviando el mensaje:", error);
			await createMessageSentLog(
				messageQueueData.messageId,
				phoneNumber,
				"failed",
				sentBy,
				error.message
			);
			await updateMessageCounters(
				"failed",
				messageData.instanceId,
				messageData.userId,
				messageQueueData.messageId
			);
		}

		if ((i + 1) % 10 === 0) {
			await delay(30000);
		}
	}

	const isComplete = endBatchIndex >= phoneNumbers.length;
	await snap.ref.update({
		lastProcessedPhoneIndex: endBatchIndex,
		status: isComplete ? "completed" : "inProgress",
	});

	console.log(`Batch completado hasta el índice ${endBatchIndex - 1}`);

	if (endBatchIndex % 5 === 0 && !isComplete) {
		await delay(30000);
		console.log("----------- Esperando 30 segundos antes de continuar...");
	}

	if (!isComplete) {
		console.log("Preparando el siguiente batch...");
		await snap.ref.update({ status: "inProgress" });
	} else {
		console.log("Todos los mensajes han sido enviados correctamente.");
	}
}

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getMessageData(messageId: string) {
	const messageDoc = await db.collection("messages").doc(messageId).get();
	return messageDoc.exists ? messageDoc.data() : null;
}

async function createMessageSentLog(
	messageId: string,
	phoneNumber: string,
	status: string,
	sentBy: string,
	error?: string
) {
	const messageRef = dbRealtime.ref(
		`messagesSent/${sentBy.replace(" ", "")}/${messageId}`
	);

	if (!(await messageRef.once("value")).exists()) {
		await messageRef.set({
			createdAt: Date.now(),
		});
	}

	const newLogMessage = {
		phoneNumber,
		status,
		sentBy,
		error: error ? error : null,
		timestamp: Date.now(),
	};

	await messageRef.child("logs").push(newLogMessage);
	console.log(`Log de mensaje enviado creado: ${phoneNumber} - ${status}`);
}

async function sendMessageToAPI(
	phoneNumber: string,
	message: string = "",
	instanceId: string,
	imageUrl?: string
): Promise<void> {
	const chatId = `${phoneNumber.replace("+", "")}@c.us`;

	if (imageUrl) {
		const imageBase64 = await convertImageToBase64(imageUrl);
		await sendWaapiWaMediaMessage({
			waapiApiKey: waapiKey,
			instanceId,
			phoneNumber: chatId,
			mediaCaption: message || "",
			mediaName: "imagen.jpg",
			mediaBase64: imageBase64,
		});
	} else {
		await sendWaapiWaMessage({
			waapiApiKey: waapiKey,
			instanceId,
			message,
			phoneNumber: chatId,
		});
	}
}

async function convertImageToBase64(imageUrl: string): Promise<string> {
	try {
		const response = await axios.get(imageUrl, {
			responseType: "arraybuffer",
		});
		return Buffer.from(response.data, "binary").toString("base64");
	} catch (error) {
		throw new Error("No se pudo obtener la imagen.");
	}
}

async function sendWaapiWaMessage({
	waapiApiKey,
	instanceId,
	message,
	phoneNumber,
}: SendWaapiWaMessageObject) {
	await sendRequest(`${apiUrl}${instanceId}/client/action/send-message`, {
		chatId: phoneNumber,
		message,
		waapiApiKey,
	});
}

async function sendWaapiWaMediaMessage({
	waapiApiKey,
	instanceId,
	phoneNumber,
	mediaCaption,
	mediaName,
	mediaBase64,
}: SendWaapiWaMediaMessageObject) {
	await sendRequest(`${apiUrl}${instanceId}/client/action/send-media`, {
		chatId: phoneNumber,
		mediaCaption,
		mediaName,
		mediaBase64,
		waapiApiKey,
	});
}

async function sendRequest(url: string, body: any) {
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

interface SendWaapiWaMessageObject {
	waapiApiKey: string;
	instanceId: string;
	message: string;
	phoneNumber: string;
}

interface SendWaapiWaMediaMessageObject {
	waapiApiKey: string;
	instanceId: string;
	phoneNumber: string;
	mediaCaption: string;
	mediaName: string;
	mediaBase64: string;
}

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

export const extractPhone = (url: string) => {
	const regex = /https?:\/\/wa.me\/(\d+)\?/;
	const match = regex.test(url);

	if (match) {
		const numeroTelefono = RegExp.$1;
		return numeroTelefono;
	}
	return null;
};
