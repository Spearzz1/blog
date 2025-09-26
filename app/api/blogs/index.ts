// pages/api/blogs/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middleware/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json(blogs);
  }

  if (req.method === "POST") {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Missing fields" });

    const blog = await prisma.blog.create({ data: { title, content } });
    return res.status(201).json(blog);
  }

  return res.status(405).end();
};

export default auth(handler);
