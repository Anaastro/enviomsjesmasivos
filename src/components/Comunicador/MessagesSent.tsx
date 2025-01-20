import { useEffect, useState, useCallback, useMemo, useContext } from "react";
import {
	ref,
	onValue,
	child,
	get,
	query,
	orderByChild,
} from "firebase/database";
import { databaseRealtime } from "@/lib/utils/firebase";
import DotLoader from "../DotLoader";
import { clientService } from "@/services/clientService";
import { UserContext } from "@/lib/context/UserContext";

interface Log {
	timestamp: number;
	phoneNumber: string;
	sentBy: string;
	status: string;
}

export const MessagesSent = () => {
	const [data, setData] = useState<Log[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { instanceId } = useContext(UserContext);
	const [numberPhone, setNumberPhone] = useState<string>("");

	const getNumberPhone = useCallback(async () => {
		const rawInformation = await clientService.getInformation({ instanceId });
		console.log(rawInformation);
		const { formattedNumber } = rawInformation.me.data;

		return formattedNumber;
	}, [instanceId]);

	const loadMoreLogs = useCallback(async () => {
		if (loading) return;
		setLoading(true);

		const messagesRef = ref(
			databaseRealtime,
			`messagesSent/${numberPhone.replace(" ", "")}`
		);

		onValue(messagesRef, async (snapshot) => {
			const messagesArray: Log[] = [];

			if (snapshot.exists()) {
				const messagesData = snapshot.val();

				for (const id in messagesData) {
					const logsRef = child(messagesRef, `${id}/logs`);

					const logsQuery = query(logsRef, orderByChild("timestamp"));

					const logsSnapshot = await get(logsQuery);
					if (logsSnapshot.exists()) {
						const logsData = logsSnapshot.val();

						Object.values(logsData).forEach((log: any) => {
							messagesArray.push(log);
						});
					}
				}
			}

			messagesArray.sort((a, b) => b.timestamp - a.timestamp);

			setData(messagesArray);
			setLoading(false);
		});
	}, [loading]);

	useEffect(() => {
		getNumberPhone().then((number) => {
			setNumberPhone(number);
		});
	}, [getNumberPhone, numberPhone, setNumberPhone]);

	useEffect(() => {
		loadMoreLogs();
	}, [loadMoreLogs]);

	return (
		<div className=" bg-transparent text-black p-4 rounded-2xl h-[50vh] overflow-y-auto border-5 border-purple-700">
			<p className=" text-[#efefef] font-extralight text-xl mb-2 text-center">
				Mensajes Enviados
			</p>

			<div className=" bg-[#9CFFCB] h-[85%] overflow-y-auto px-4 py-2 rounded-lg">
				{loading ? (
					<div className="flex justify-center items-center w-full h-full">
						<DotLoader />
					</div>
				) : (
					data.map((log, index) => (
						<div
							key={log.timestamp}
							className="border-b-1 border-black p-2 text-black font-extralight"
						>
							<p>
								Enviado por {log.sentBy} a {log.phoneNumber}
							</p>
							<p>Estado: {log.status === "sent" ? "Enviado" : "No enviado"}</p>
							<p>Fecha: {new Date(log.timestamp).toLocaleString()}</p>
						</div>
					))
				)}
			</div>
		</div>
	);
};
