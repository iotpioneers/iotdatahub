import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import crypto from "crypto";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

type User = {
  userFullName: string;
  userEmail: string;
};

export const generateOTP = (expiryMinutes = 10) => {
  const otp = crypto.randomInt(100000, 999999);
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);

  return {
    token: otp.toString(),
    expires: expiryTime,
  };
};

export async function POST(req: Request) {
  try {
    const body: User = await req.json();

    const { userFullName, userEmail } = body;

    // Generate verification token
    const { token, expires } = generateOTP();

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
      subject: "Verify Your Email Address for IoT Data Hub",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email Address</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      background-color: #fdf7f6;
    }
    .outer-container {
      margin: 0 auto;
      width: 60%;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 150px;
    }
    .heading {
      color: #fff;
      background-color: #13544e;
      width: 100%;
      border-radius: 2px;
      padding: 10px;
      margin: 0;
      text-align: center;
    }
    .heading h1 {
      margin: 0;
    }
    .contents {
      text-align: left;
      padding: 20px;
    }
    p {
      color: #666;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #fff;
      background-color: #13544e;
      border-radius: 2px;
      text-align: center;
      text-decoration: none;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #0f413b;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="outer-container">
    <div class="logo">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}">
        <p>IoT Data Hub</p>
      </a>
    </div>
    <div class="heading">
      <h1>Verify Your Email Address</h1>
    </div>
    <div class="contents">
      <p>Dear ${
        userFullName ? userFullName.split(" ")[0] : "valuable user"
      }!,</p>
      <p>Thank you for registering with IoT Data Hub. To complete your registration and verify your email address, please click the button below.</p>
      <p>
        <a href="${
          process.env.NEXT_PUBLIC_BASE_URL
        }/email/verify?token=${token}" class="button">Verify Email</a>
      </p>
      <p>If you did not create an account, no further action is required.</p>
    </div>
    <div class="footer">
      <p>Best regards,</p>
      <p>The IoT Data Hub Team</p>
    </div>
  </div>
</body>
</html>
`,
    };

    const info = await transporter.sendMail(message);

    if (info.response !== "250 2.0.0 OK") {
      return NextResponse.json(
        { error: "Error sending email" },
        { status: 500 }
      );
    }

    console.log("Message sent: %s", info);
    // Save token in the database
    await prisma.verificationToken.create({
      data: {
        email: userEmail,
        token,
        expires,
      },
    });

    return NextResponse.json(
      { message: "Verification email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in email verification handler:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
