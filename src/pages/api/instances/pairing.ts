import { NextApiRequest, NextApiResponse } from "next";
import { RequestPairingCodeResponse } from "@/lib/interfaces/instances-responce.interface";
import InstancesService from "@/services/instances-service";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { id, phone } = req.body;

		const rawData: RequestPairingCodeResponse =
			await InstancesService.requestWaapiPairingCode(waapiApiKey, id, phone);
		const requestData = rawData.data;
		const { pairingCode } = requestData.data;

		res.status(200).json({
			pairingCode,
		});
	} catch (error: any) {
		console.error("Error al enviar el mensaje de WhatsApp:", error.message);
		res.status(500).json({ success: false, error: error.message });
	}
};

export default handler;
