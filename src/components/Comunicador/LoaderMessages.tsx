import { auth, database, databaseRealtime } from "@/lib/utils/firebase";
import { onValue, ref } from "firebase/database";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";

interface Props {
	instanceId: string;
	userId: string;
	messageId: string;
	totalMessages: number;
	setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MessageCounters {
	totalMessages: number;
	sentMessages: number;
	failedMessages: number;
}

export default function LoaderMessages({
	instanceId,
	userId,
	messageId,
	totalMessages,
	setIsSending,
}: Props) {
	const [data, setData] = useState<MessageCounters | null>(null);
	const [completionMessage, setCompletionMessage] = useState<string | null>(
		null
	);
	const hasUpdated = useRef(false);

	useEffect(() => {
		if (!instanceId || !userId || !messageId) return;

		const dataRef = ref(
			databaseRealtime,
			`messageCounters/${instanceId}/${userId}/${messageId}`
		);

		const unsubscribe = onValue(dataRef, (snapshot) => {
			const newData = snapshot.val();
			setData(newData);
		});

		return () => unsubscribe();
	}, [instanceId, userId, messageId]);

	useEffect(() => {
		const updateFirestore = async () => {
			if (data?.totalMessages === totalMessages && !hasUpdated.current) {
				// Evitar múltiples ejecuciones
				hasUpdated.current = true;

				await setDoc(
					doc(database, "users", auth.currentUser!.uid),
					{
						isSending: false,
						dataSending: {
							instanceId: null,
							messageId: null,
						},
					},
					{ merge: true }
				);

				setCompletionMessage("Mensajes enviados correctamente");

				// Esperar 3 segundos antes de cambiar el estado
				await new Promise((resolve) => setTimeout(resolve, 3000));
				setIsSending(false);
				setCompletionMessage(null);
			}
		};

		if (data) {
			updateFirestore();
		}
	}, [data, totalMessages, setIsSending]);

	return (
		<div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full bg-black opacity-50">
			<div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
			{completionMessage && (
				<p className="text-white mt-5">{completionMessage}</p>
			)}
			{!completionMessage && (
				<>
					<p className="text-white mt-5">{`Enviando mensajes... ${data?.totalMessages || 0}/${totalMessages}`}</p>
					<p className="text-white mt-5">{`Mensajes Enviados ${data?.sentMessages || 0}`}</p>
					<p className="text-white mt-5">{`Mensajes Fallidos ${data?.failedMessages || 0}`}</p>
				</>
			)}
		</div>
	);
}
