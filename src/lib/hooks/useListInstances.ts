import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { adminService } from "@/services/adminService";
import { clientService } from "@/services/clientService";
import { InstanceNumber } from "../interfaces";

export const useListInstances = () => {
	const [instanceNumbers, setInstanceNumbers] = useState<InstanceNumber[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { setInstanceId } = useContext(UserContext);

	useEffect(() => {
		const fetchPhoneNumbers = async () => {
			try {
				const { instances } = (await adminService.getInstances()) as any;

				const getInstances = await Promise.all(
					instances.map(async (instance: any) => {
						const rawData = await clientService.getInformation({
							instanceId: instance.id,
						});

						return {
							instanceId: instance.id,
							phoneNumber: rawData.me?.data?.formattedNumber || null,
							message: rawData.me?.message || null,
							name: rawData.me?.data?.displayName || null,
						};
					})
				);

				setInstanceNumbers(getInstances);
			} catch (error: any) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchPhoneNumbers();
	}, []);

	return {
		instanceNumbers,
		loading,
		error,
		setInstanceId,
	};
};
