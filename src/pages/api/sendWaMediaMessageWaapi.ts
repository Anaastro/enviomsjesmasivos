// import { NextApiRequest, NextApiResponse } from 'next'
// import { adminService } from '../../services/adminService'

// const waapiApiKey = process.env.WAAPI_API_KEY as string

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { phoneNumber, message, mediaBase64, mediaCaption, mediaName } =
//     req.body

//   const noPlusPhoneNumber = phoneNumber.replace('+', '')
//   const finalPhoneNumber = `${noPlusPhoneNumber}@c.us`

//   try {
//     // Send a confirmation message with the URL in plain text

//     const instances = (await adminService.getWaapiInstances(waapiApiKey)) as any

//     const firstInstance = instances?.instances[0]
//     const instanceId = firstInstance?.id

//     if (instanceId) {
//       await adminService.sendWaapiWaMediaMessage({
//         waapiApiKey,
//         instanceId,
//         message,
//         phoneNumber: finalPhoneNumber,
//         mediaCaption,
//         mediaName,
//         mediaBase64,
//       })
//     }

//     res.status(200).json({ success: true })
//     // Additional logic for storing ad details or handling success
//   } catch (error: any) {
//     console.error('Whatsapp message sent:', error)
//     res.status(200).json({ success: false })
//   }
// }
// export default handler

import { NextApiRequest, NextApiResponse } from "next";
import { adminService } from "../../services/adminService";

const waapiApiKey = process.env.WAAPI_API_KEY as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { phoneNumber, message, mediaBase64, mediaCaption, mediaName } =
    req.body;

  try {
    // Obtener instancias de WAAPI
    const instances = (await adminService.getWaapiInstances(
      waapiApiKey
    )) as any;
    const firstInstance = instances?.instances[0];
    const instanceId = firstInstance?.id;

    if (!instanceId) {
      throw new Error("Instance ID not found");
    }
    if (instanceId) {
      // if (mediaBase64 && mediaCaption && mediaName) {
      // Enviar mensaje con medios
      await adminService.sendWaapiWaMediaMessage({
        waapiApiKey,
        instanceId,
        phoneNumber,
        mediaCaption,
        mediaName,
        mediaBase64,
        message,
      });
    } else {
      // Enviar mensaje de texto
      // await adminService.sendWaapiWaMessage({
      //   waapiApiKey,
      //   instanceId,
      //   message,
      //   phoneNumber,
      // });
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error al enviar el mensaje de WhatsApp:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
