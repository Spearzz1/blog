// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middleware/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const posts = await prisma.post.findMany();
    return res.status(200).json(posts);
  }

  return res.status(405).json({ message: "Method not allowed" });
};

export default auth(handler); // Wrap your handler with auth
