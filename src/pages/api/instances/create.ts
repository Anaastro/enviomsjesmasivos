import { NextApiRequest, NextApiResponse } from "next";
import { InstanceResponse } from "@/lib/interfaces/instances-responce.interface";
import InstancesService from "@/services/instances-service";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { instance }: InstanceResponse =
      await InstancesService.createInstance();

    res.status(200).json({ instance });
  } catch (error: any) {
    console.error("Error al enviar el mensaje de WhatsApp:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
