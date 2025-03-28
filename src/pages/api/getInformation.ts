import { adminService } from "@/services/adminService";
import { clientService } from "@/services/clientService";
import { NextApiRequest, NextApiResponse } from "next";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { instanceId } = req.body;

    const data = await clientService.getClientInformation({
      instanceId,
      waapiApiKey,
    });

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error al obtener los chats de WhatsApp:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
