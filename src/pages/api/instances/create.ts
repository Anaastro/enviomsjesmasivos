import { NextApiRequest, NextApiResponse } from "next";
import { InstanceResponse } from "@/lib/interfaces/instances-responce.interface";
import InstancesService from "@/services/instances-service";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
<<<<<<< HEAD
	try {
		const { instance }: InstanceResponse =
			await InstancesService.createWaapiInstance(waapiApiKey);
=======
  try {
    const { instance }: InstanceResponse =
      await InstancesService.createInstance();
>>>>>>> 413874d67b7d42e5eced25bed0f2f6fec41f151c

    res.status(200).json({ instance });
  } catch (error: any) {
    console.error("Error al enviar el mensaje de WhatsApp:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
