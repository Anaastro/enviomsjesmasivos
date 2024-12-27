import { useCallback, useContext, useEffect, useState } from "react";
import { databaseRealtime } from "../utils/firebase";
import {
	endAt,
	get,
	onValue,
	orderByChild,
	query,
	ref,
	startAt,
} from "firebase/database";
import { UserContext } from "../context/UserContext";
import { clientService } from "@/services/clientService";

export default function SentMessagesCounter() {
	const [counterMessages, setCounterMessages] = useState({
		today: 0,
		week: 0,
		month: 0,
	});
	const { instanceId } = useContext(UserContext);

	const getNumberPhone = useCallback(async () => {
		const rawInformation = await clientService.getInformation({ instanceId });
		const { formattedNumber } = rawInformation.me.data;

		return formattedNumber;
	}, [instanceId]);

	const getMessagesQuery = async ({
		formattedNumber,
	}: {
		formattedNumber: string;
	}) => {
		const messageRef = ref(
			databaseRealtime,
			`messagesSent/${formattedNumber.replace(" ", "")}`
		);

		const today = new Date();
		const startOfMonth = new Date(
			today.getFullYear(),
			today.getMonth(),
			1
		).getTime();

		const endOfMonth =
			new Date(today.getFullYear(), today.getMonth() + 1, 1).getTime() - 1;

		const messagesThisMonthQuery = query(
			messageRef,
			orderByChild("createdAt"),
			startAt(startOfMonth),
			endAt(endOfMonth)
		);

		return messagesThisMonthQuery;
	};

	const getMessagesOfMonth = (data: any) => {
		const totalMessages = Object.values(data).reduce(
			(acc: number, message: any) => acc + Object.values(message).length,
			0
		);

		return totalMessages;
	};

	const getMessagesOfWeek = (data: any) => {
		const today = new Date();
		const startOfWeek = new Date(
			today.setDate(today.getDate() - today.getDay())
		).getTime();

		const endOfWeek = new Date(
			today.setDate(today.getDate() - today.getDay() + 6)
		).getTime();

		const filterData = Object.values(data).filter(
			(message: any) =>
				message.createdAt >= startOfWeek && message.createdAt <= endOfWeek
		);

		const totalMessages = filterData.reduce(
			(acc: number, message: any) => acc + Object.values(message).length,
			0
		);

		return totalMessages;
	};

	const getMessagesToday = (data: any) => {
		const today = new Date();
		const startOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		).getTime();
		const endOfDay =
			new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 1
			).getTime() - 1;

		const filterData = Object.values(data).filter(
			(message: any) =>
				message.createdAt >= startOfDay && message.createdAt <= endOfDay
		);

		const totalMessages = filterData.reduce(
			(acc: number, message: any) => acc + Object.values(message).length,
			0
		);

		return totalMessages;
	};

	const fetchCounterMessages = useCallback(async () => {
		try {
			const formattedNumber = await getNumberPhone();
			const messagesThisMonthQuery = await getMessagesQuery({
				formattedNumber,
			});

			onValue(messagesThisMonthQuery, (snapshot) => {
				const rawData = snapshot.val() || {};
				const messagesOfMonth = getMessagesOfMonth(rawData);
				const messagesOfWeek = getMessagesOfWeek(rawData);
				const messagesToday = getMessagesToday(rawData);

				setCounterMessages({
					today: messagesToday,
					week: messagesOfWeek,
					month: messagesOfMonth,
				});
			});
		} catch (error) {
			console.error("Error al recuperar los mensajes del mes:", error);
			setCounterMessages({
				today: 0,
				week: 0,
				month: 0,
			});
		}
	}, [getNumberPhone]);

	useEffect(() => {
		fetchCounterMessages();
	}, [fetchCounterMessages]);

	return (
		<div className="bg-transparent p-4 rounded-2xl border-5 border-blue-700">
			<div className="p-4 [&>*]:p-2 [&>*]:bg-gray-100 flex flex-col gap-2 [&>*]:rounded-lg ">
				<div className="flex justify-between items-center">
					<p className="text-black font-extralight">Mensajes enviados hoy:</p>
					<p>{counterMessages.today}</p>
				</div>

				<div className="flex justify-between items-center">
					<p className="text-black font-extralight">Mensajes enviados esta semana:</p>
					<p>{counterMessages.week}</p>
				</div>

				<div className="flex justify-between items-center">
					<p className="text-black font-extralight">Mensajes enviados este mes:</p>
					<p>{counterMessages.month}</p>
				</div>
			</div>
		</div>
	);
}
