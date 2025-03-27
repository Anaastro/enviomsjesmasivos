import { InstancesResponse } from "@/lib/interfaces/instances-responce.interface";
import { convertDate } from "@/lib/utils/utils";

interface AdminService {
	sendWaMessageTwilio: (
		sendWaMessageObject: SendWaMessageObject
	) => Promise<Response>;
	sendWaMessageWaapi: (
		sendWaMessageObject: SendWaMessageObject
	) => Promise<Response>;
	sendWaMediaMessageWaapi: (
		sendWaMediaMessageObject: SendWaMediaMessageObject
	) => Promise<Response>;
	getInstances: () => Promise<Response>;
	getAllChats: ({ instanceId }: { instanceId: string }) => Promise<Response>;
	getWaapiInstances: (waapiApiKey: string) => Promise<InstancesResponse>;
	getWaapiQrCode: (
		waapiApiKey: string,
		instanceId: string
	) => Promise<Response>;
	sendWaapiWaMessage: (
		sendWaapiWaMessage: SendWaapiWaMessageObject
	) => Promise<Response>;
	getCorrectChatId: (correctChatId: CorrectChatId) => any;
	sendWaapiWaMediaMessage: (
		sendWaapiWaMediaMessage: SendWaapiWaMediaMessageObject
	) => Promise<Response>;
	getAllChatsWaapi: ({ waapiApiKey, instanceId }: ChatsObject) => Promise<any>;
}

interface SendWaMessageObject {
	phoneNumber: string;
	message: string;
	instanceId: string;
}

interface SendWaMediaMessageObject {
	phoneNumber: string;
	mediaCaption: string;
	mediaName: string;
	mediaBase64: string;
	message?: string;
	instanceId: string;
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
	message?: string; // Ahora es opcional
}

interface CorrectChatId {
	phoneNumber: string;
	waapiApiKey: string;
	instanceId: string;
}

interface ChatsObject {
	waapiApiKey: string;
	instanceId: string;
}

export const adminService: AdminService = {
	sendWaMessageTwilio: async ({ phoneNumber, message }) => {
		return await fetch("/api/sendWaMessageTwilio", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ phoneNumber, message }),
		});
	},

	sendWaMessageWaapi: async ({ phoneNumber, message, instanceId }) => {
		const fetchedMessage = await fetch("/api/sendWaMessageWaapi", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ phoneNumber, message, instanceId }),
		});

		return await fetchedMessage.json();
	},

	sendWaMediaMessageWaapi: async ({
		phoneNumber,
		mediaBase64,
		mediaCaption,
		mediaName,
	}) => {
		const fetchedSentMediaMessage = await fetch(
			"/api/sendWaMediaMessageWaapi",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					phoneNumber,
					mediaBase64,
					mediaCaption,
					mediaName,
				}),
			}
		);

		return await fetchedSentMediaMessage.json();
	},

	getInstances: async () => {
		const rawData = await fetch(`/api/getInstances`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return await rawData.json();
	},
	getAllChats: async ({ instanceId }: { instanceId: string }) => {
		const chats = await fetch(`/api/getAllChats`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ instanceId }),
		});

		return (await chats.json()) as any;
	},
	getWaapiInstances: async (waapiApiKey: string) => {
		const fetchedInstances = await fetch("https://waapi.app/api/v1/instances", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${waapiApiKey}`,
			},
		});
		return await fetchedInstances.json();
	},

	getWaapiQrCode: async (waapiApiKey: string, instanceId: string) => {
		const fetchedQrCode = await fetch(
			`https://waapi.app/api/v1/instances/${instanceId}/client/qr`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${waapiApiKey}`,
				},
			}
		);
		return await fetchedQrCode.json();
	},

	sendWaapiWaMessage: async ({
		instanceId,
		waapiApiKey,
		message,
		phoneNumber,
	}: SendWaapiWaMessageObject) => {
		const fetchedSentMessage = await fetch(
			`https://waapi.app/api/v1/instances/${instanceId}/client/action/send-message`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${waapiApiKey}`,
				},
				body: JSON.stringify({
					chatId: phoneNumber,
					message: message,
				}),
			}
		);
		return (await fetchedSentMessage.json()) as any;
	},

	getCorrectChatId: async ({ phoneNumber, waapiApiKey, instanceId }) => {
		const fetchedChatId = await fetch(
			`https://waapi.app/api/v1/instances/${instanceId}/client/action/get-number-id`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${waapiApiKey}`,
				},
				body: JSON.stringify({
					number: phoneNumber,
				}),
			}
		);
		return (await fetchedChatId.json()) as any;
	},

	sendWaapiWaMediaMessage: async ({
		instanceId,
		waapiApiKey,
		mediaCaption,
		phoneNumber,
		mediaName,
		mediaBase64,
		message, // Este campo es opcional ahora
	}: SendWaapiWaMediaMessageObject) => {
		const fetchedSentMessage = await fetch(
			`https://waapi.app/api/v1/instances/${instanceId}/client/action/send-media`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${waapiApiKey}`,
				},
				body: JSON.stringify({
					chatId: phoneNumber,
					mediaCaption,
					mediaName,
					mediaBase64,
					message, // Se incluye si está disponible
				}),
			}
		);

		const result = await fetchedSentMessage.json();

		return result as any;
	},

	getAllChatsWaapi: async ({ waapiApiKey, instanceId }) => {
		const fetchedChats = await fetch(
			`https://waapi.app/api/v1/instances/${instanceId}/client/action/get-chats`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${waapiApiKey}`,
				},
			}
		);

		const response = await fetchedChats.json();
		const rawData = await response.data.data;

		const data = rawData
			.filter(
				(chat: any) =>
					!chat.isGroup &&
					!chat.lastMessage?._data.id.fromMe &&
					(chat.lastMessage?._data.type === "chat" ||
						chat.lastMessage?._data.type === "image")
			)
			.map((chat: any) => {
				return {
					id: `+${chat.id.user}`,
					name: chat.name,
					lastMessageTime: `${convertDate(chat.lastMessage?._data.t)}`,
					...(chat.lastMessage?._data.type === "image" && {
						image: `data:${chat.lastMessage?._data.mimetype};base64,${chat.lastMessage?._data.body}`,
					}),
					...(chat.lastMessage?._data.type === "chat" && {
						text: chat.lastMessage?._data.body,
					}),
				};
			});

		return data;
	},
};

// interface AdminService {
//   sendWaapiWaMessage: (
//     sendWaapiWaMessage: SendWaapiWaMessageObject
//   ) => Promise<any>;
//   sendWaapiWaMediaMessage: (
//     sendWaapiWaMediaMessage: SendWaapiWaMediaMessageObject
//   ) => Promise<any>;
//   getWaapiInstances: (waapiApiKey: string) => Promise<any>;
//   getWaapiQrCode: (
//     waapiApiKey: string,
//     instanceId: string
//   ) => Promise<any>;
//   getCorrectChatId: (correctChatId: CorrectChatId) => Promise<any>;
// }

// interface SendWaapiWaMessageObject {
//   waapiApiKey: string;
//   instanceId: string;
//   message: string;
//   phoneNumber: string;
// }

// interface SendWaapiWaMediaMessageObject {
//   waapiApiKey: string;
//   instanceId: string;
//   message: string;
//   phoneNumber: string;
//   mediaCaption: string;
//   mediaName: string;
//   mediaBase64: string;
// }

// interface CorrectChatId {
//   phoneNumber: string;
//   waapiApiKey: string;
//   instanceId: string;
// }

// const WAAPI_BASE_URL = 'https://waapi.app/api/v1';

// export const adminService: AdminService = {
//   sendWaapiWaMessage: async ({
//     instanceId,
//     waapiApiKey,
//     message,
//     phoneNumber,
//   }: SendWaapiWaMessageObject): Promise<any> => {
//     try {
//       const response = await fetch(
//         `${WAAPI_BASE_URL}/instances/${instanceId}/client/action/send-message`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             Authorization: `Bearer ${waapiApiKey}`,
//           },
//           body: JSON.stringify({
//             chatId: phoneNumber,
//             message,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Failed to send Waapi message:', error);
//       throw error;
//     }
//   },

//   sendWaapiWaMediaMessage: async ({
//     instanceId,
//     waapiApiKey,
//     mediaCaption,
//     phoneNumber,
//     mediaName,
//     mediaBase64,
//   }: SendWaapiWaMediaMessageObject): Promise<any> => {
//     try {
//       const response = await fetch(
//         `${WAAPI_BASE_URL}/instances/${instanceId}/client/action/send-media`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             Authorization: `Bearer ${waapiApiKey}`,
//           },
//           body: JSON.stringify({
//             chatId: phoneNumber,
//             mediaCaption,
//             mediaName,
//             mediaBase64,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Failed to send Waapi media message:', error);
//       throw error;
//     }
//   },

//   getWaapiInstances: async (waapiApiKey: string): Promise<any> => {
//     try {
//       const response = await fetch(`${WAAPI_BASE_URL}/instances`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//           Authorization: `Bearer ${waapiApiKey}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Failed to get Waapi instances:', error);
//       throw error;
//     }
//   },

//   getWaapiQrCode: async (
//     waapiApiKey: string,
//     instanceId: string
//   ): Promise<any> => {
//     try {
//       const response = await fetch(
//         `${WAAPI_BASE_URL}/instances/${instanceId}/client/qr`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             Authorization: `Bearer ${waapiApiKey}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Failed to get Waapi QR code:', error);
//       throw error;
//     }
//   },

//   getCorrectChatId: async ({
//     phoneNumber,
//     waapiApiKey,
//     instanceId,
//   }: CorrectChatId): Promise<any> => {
//     try {
//       const response = await fetch(
//         `${WAAPI_BASE_URL}/instances/${instanceId}/client/action/get-number-id`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json',
//             Authorization: `Bearer ${waapiApiKey}`,
//           },
//           body: JSON.stringify({
//             number: phoneNumber,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Failed to get correct chat ID:', error);
//       throw error;
//     }
//   },
// };
