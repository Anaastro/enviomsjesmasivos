import { NextApiRequest, NextApiResponse } from "next";
// import firebaseAdmin from '@lib/firebaseAdmin'
import { auth } from "@/config/firebaseAdmin";
require("dotenv").config();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid } = req.body;

  // console.log(uid === process.env.ADMIN_ID, "process.env.ADMIN_ID");

  try {
    if (uid === process.env.ADMIN_ID) {
      // console.log(process.env.ADMIN_ID, "process.env.ADMIN_ID", uid);
      await auth.setCustomUserClaims(uid, { admin: true });
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(200).json({ success: false });
  }
};

export default handler;
