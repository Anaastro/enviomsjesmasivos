import { useCallback, useContext, useEffect, useState } from "react";
import { databaseRealtime } from "../utils/firebase";
import {
	query,
	ref,
	orderByChild,
	startAt,
	endAt,
	onValue,
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
		return rawInformation.me.data.formattedNumber.replace(" ", "");
	}, [instanceId]);

	const getMessagesCount = (
		formattedNumber: string,
		startTime: number,
		endTime: number
	) => {
		const messageRef = ref(databaseRealtime, `messagesSent/${formattedNumber}`);
		const messagesQuery = query(
			messageRef,
			orderByChild("createdAt"),
			startAt(startTime),
			endAt(endTime)
		);

		return messagesQuery;
	};

	const fetchCounterMessages = useCallback(async () => {
		try {
			const formattedNumber = await getNumberPhone();
			const today = new Date();

			const startOfDay = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate()
			).getTime();
			const endOfDay = startOfDay + 86400000 - 1;

			const startOfWeek = new Date(
				today.setDate(today.getDate() - today.getDay())
			).getTime();
			const endOfWeek = startOfWeek + 6 * 86400000 + 86399999;

			const startOfMonth = new Date(
				today.getFullYear(),
				today.getMonth(),
				1
			).getTime();
			const endOfMonth =
				new Date(today.getFullYear(), today.getMonth() + 1, 1).getTime() - 1;

			const todayQuery = getMessagesCount(
				formattedNumber,
				startOfDay,
				endOfDay
			);
			const weekQuery = getMessagesCount(
				formattedNumber,
				startOfWeek,
				endOfWeek
			);
			const monthQuery = getMessagesCount(
				formattedNumber,
				startOfMonth,
				endOfMonth
			);

			const handleSnapshot = (
				snapshot: any,
				setState: React.Dispatch<React.SetStateAction<any>>
			) => {
				const data = snapshot.val() || {};
				const totalMessages = Object.values(data).reduce(
					(acc: number, message: any) => {
						if (message.logs) {
							return acc + Object.values(message.logs).length;
						}
						return acc;
					},
					0
				);
				setState(totalMessages);
			};

			onValue(todayQuery, (snapshot) =>
				handleSnapshot(snapshot, (messages) =>
					setCounterMessages((prev) => ({ ...prev, today: messages }))
				)
			);
			onValue(weekQuery, (snapshot) =>
				handleSnapshot(snapshot, (messages) =>
					setCounterMessages((prev) => ({ ...prev, week: messages }))
				)
			);
			onValue(monthQuery, (snapshot) =>
				handleSnapshot(snapshot, (messages) =>
					setCounterMessages((prev) => ({ ...prev, month: messages }))
				)
			);
		} catch (error) {
			console.error("Error al recuperar los mensajes:", error);
			setCounterMessages({ today: 0, week: 0, month: 0 });
		}
	}, [getNumberPhone]);

	useEffect(() => {
		fetchCounterMessages();

		return () => {
			setCounterMessages({ today: 0, week: 0, month: 0 });
		};
	}, [fetchCounterMessages]);

	return (
		<div className="bg-transparent p-4 rounded-2xl border-5 border-blue-700">
			<div className="p-4 [&>*]:p-2 [&>*]:bg-gray-100 flex flex-col gap-2 [&>*]:rounded-lg ">
				<div className="flex justify-between items-center text-white">
					<p className="text-white font-extralight">Mensajes enviados hoy:</p>
					<p>{counterMessages.today}</p>
				</div>

				<div className="flex justify-between items-center text-white">
					<p className="text-white font-extralight">
						Mensajes enviados esta semana:
					</p>
					<p>{counterMessages.week}</p>
				</div>

				<div className="flex justify-between items-center text-white">
					<p className="text-white font-extralight">
						Mensajes enviados este mes:
					</p>
					<p>{counterMessages.month}</p>
				</div>
			</div>
		</div>
	);
}
