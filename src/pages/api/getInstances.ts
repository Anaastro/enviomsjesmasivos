import { NextApiRequest, NextApiResponse } from "next";
import { adminService } from "../../services/adminService";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const { instances } = (await adminService.getWaapiInstances(
			waapiApiKey
		)) as any;

		res.status(200).json({ instances });
	} catch (error: any) {
		console.error("Error al enviar el mensaje de WhatsApp:", error.message);
		res.status(500).json({ success: false, error: error.message });
	}
};

export default handler;
