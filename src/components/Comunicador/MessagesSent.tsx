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
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<div className=" bg-transparent text-black p-4 rounded-2xl h-[50vh] overflow-y-auto border-5 border-purple-700">
			<p className=" text-[#efefef] font-extralight text-xl mb-2 text-center">
				Notas
			</p>

			<div className="  h-[85%] overflow-y-auto px-4 py-2 rounded-lg">
				{loading ? (
					<div className="flex justify-center items-center w-full h-full">
						<DotLoader />
					</div>
				) : (
					// data.map((log, index) => (
					// 	<div
					// 		key={log.timestamp}
					// 		className="border-b-1 border-black p-2 text-black font-extralight"
					// 	>
					// 		<p>
					// 			Enviado por {log.sentBy} a {log.phoneNumber}
					// 		</p>
					// 		<p>Estado: {log.status === "sent" ? "Enviado" : "No enviado"}</p>
					// 		<p>Fecha: {new Date(log.timestamp).toLocaleString()}</p>
					// 	</div>
					// )
					<p>Update</p>
				)}
			</div>
		</div>
	);
};
