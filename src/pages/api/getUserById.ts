import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/config/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "No userId provided" });
      }

      const user = await auth.getUser(id as string);

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Error fetching user" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
