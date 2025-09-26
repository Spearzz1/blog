// pages/api/blogs/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middleware/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === "GET") {
    const blog = await prisma.blog.findUnique({ where: { id: String(id) } });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    return res.status(200).json(blog);
  }

  if (req.method === "PUT") {
    const { title, content } = req.body;
    const updatedBlog = await prisma.blog.update({
      where: { id: String(id) },
      data: { title, content },
    });
    return res.status(200).json(updatedBlog);
  }

  if (req.method === "DELETE") {
    await prisma.blog.delete({ where: { id: String(id) } });
    return res.status(204).end();
  }

  return res.status(405).end();
};

export default auth(handler);
