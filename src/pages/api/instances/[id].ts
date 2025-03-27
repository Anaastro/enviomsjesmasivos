import { NextApiRequest, NextApiResponse } from "next";
import { InstanceInformationResponse } from "@/lib/interfaces/instances-responce.interface";
import InstancesService from "@/services/instances-service";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const { clientStatus }: InstanceInformationResponse =
      await InstancesService.getWaapiInformationInstance(
        waapiApiKey,
        id as string
      );

    res.status(200).json(clientStatus);
  } catch (error: any) {
    console.error("Error al enviar el mensaje de WhatsApp:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
