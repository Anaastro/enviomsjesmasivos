import { auth } from "@/config/firebaseAdmin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader && authHeader !== "123456789") {
      res.redirect("/");
    }

    if (!authHeader) {
      res.redirect("/");
    }

    const listUsersResult = await auth.listUsers();
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
    }));

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Error fetching users" });
  }
}
