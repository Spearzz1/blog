import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("token")?.value;
    if (!cookie) return NextResponse.json({ valid: false }, { status: 200 });

    const decoded = jwt.verify(cookie, JWT_SECRET);
    return NextResponse.json({ valid: true, user: decoded });
  } catch (err) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }
}
