import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { userSchema } from "@/validations/schema.validation";

const prisma = new PrismaClient();

type TUser = {
  firstname: string;
  lastname: string;
  email: string;
  country: string;
  phonenumber: string;
  password: string;
  image?: string;
};

export async function POST(req: Request, res: NextResponse) {
  try {
    const body: TUser = await req.json();

    // Validate the request body against the schema
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      console.log("Validation Errors:", validation.error.errors);
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const {
      firstname,
      lastname,
      email,
      country,
      phonenumber,
      password,
      image,
    } = validation.data;

    console.log("body", body);

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
        firstname,
        lastname,
        email,
        country,
        phonenumber,
        password: hashedPassword,
        image,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
