import { NextApiRequest, NextApiResponse } from "next";
import { adminService } from "../../services/adminService";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { phoneNumber, message, instanceId } = req.body;
  try {
    if (instanceId) {
      await adminService.sendWaapiWaMessage({
        waapiApiKey,
        instanceId,
        message,
        phoneNumber,
      });
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Whatsapp message sent:", error);
    res.status(404).json({ success: false });
  }
};
export default handler;
