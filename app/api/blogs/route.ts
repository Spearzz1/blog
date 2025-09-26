import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const blogs = await prisma.post.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
