import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import userSchema from "./schema";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}
