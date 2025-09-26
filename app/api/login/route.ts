import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const admin = await prisma.user.findUnique({ where: { email } });

  if (!admin) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  const res = NextResponse.json({ message: "Login successful!" });
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  return res;
}
