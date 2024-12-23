import { clientService } from "@/services/clientService";
import { useContext, useEffect, useState } from "react";
import { ClientInformation, InstanceStatus } from "../interfaces";
import { UserContext } from "../context/UserContext";

export const useInstance = () => {
	const [status, setStatus] = useState<string>();
	const [information, setInformation] = useState<ClientInformation>();
	const [qr, setQr] = useState<string | null>();
	const { instanceId, setInstanceId } = useContext(UserContext);

	const fetchStatus = async () => {
		if (!instanceId) return;

		try {
			const { clientStatus }: InstanceStatus = await clientService.getStatus({
				instanceId,
			});
			setStatus(clientStatus.instanceStatus);
		} catch (error) {
			console.error("Error al obtener el estado:", error);
		}
	};

	const updateStatus = async () => {
		if (!instanceId || !status) return;

		try {
			if (status === "qr") {
				const rawData = await clientService.getQr({ instanceId });
				setQr(rawData.data.qr_code);
			} else {
				setQr(null);
				const data = await clientService.getInformation({ instanceId });
				setInformation(data.me);
			}
		} catch (error) {
			console.error("Error al actualizar el estado:", error);
		}
	};

	useEffect(() => {
		fetchStatus();
	}, [instanceId]);

	useEffect(() => {
		updateStatus();
	}, [status, instanceId]);

	return {
		status,
		information,
		qr,
		instanceId,
		setInstanceId,
		fetchStatus,
	};
};
