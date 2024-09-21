import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import prisma from "@/prisma/client";

type User = {
  userEmail: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: User = await req.json();
    const { userEmail } = body;

    // Generate verification token
    const token = crypto.randomInt(100000, 999999).toString();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 30);

    let config = {
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let message = {
      from: process.env.GOOGLE_EMAIL,
      to: userEmail,
      subject: "Password Reset",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
        }
        .content {
            padding: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
            <p>Your password reset code is: <strong>${token}</strong></p>
            <br /><p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <br /><br /><p>Best regards,<br>Your Support Team</p>
        </div>
    </div>
</body>
</html>`,
    };

    await transporter.sendMail(message);

    // Save token in the database
    await prisma.verificationToken.create({
      data: {
        email: userEmail,
        token,
        expires: expiryTime,
      },
    });

    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
