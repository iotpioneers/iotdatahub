import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { userSchema } from "@/validations/schema.validation";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    // Validate the request body against the schema
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      console.log(
        "Validation Errors:",
        validation.error.errors.map((err) => err.message)
      );
      return NextResponse.json(
        validation.error.errors.map((err) => err.message),
        { status: 400 }
      );
    }

    const { name, email, country, phonenumber, password, image } =
      validation.data;

    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        country,
        phonenumber,
        password: hashedPassword,
        image,
      },
    });

    return NextResponse.json(
      { message: "Registration successful", user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
