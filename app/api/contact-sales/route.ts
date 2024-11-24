import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/prisma/client";
import { contactSalesSchema } from "@/validations/schema.validation";
import { ContactSalesFormData } from "@/types";

async function sendNotificationEmail(contactData: ContactSalesFormData) {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const transporter = nodemailer.createTransport(config);

  // Email to sales team
  const salesTeamEmail = {
    from: process.env.GOOGLE_EMAIL,
    to: process.env.SALES_TEAM_EMAIL || process.env.GOOGLE_EMAIL,
    subject: "New Sales Contact Request",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Sales Contact Request</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
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
        .heading {
          color: #fff;
          background-color: #888;
          width: 100%;
          border-radius: 2px;
          padding: 10px;
          margin: 0;
          text-align: center;
        }
        .contents {
          text-align: left;
          padding: 20px;
        }
        .details {
          margin: 20px 0;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="outer-container">
        <div class="heading">
          <h1>New Sales Contact Request</h1>
        </div>
        <div class="contents">
          <p>A new sales contact request has been received:</p>
          <div class="details">
            <p><strong>Name:</strong> ${contactData.firstName} ${
              contactData.lastName
            }</p>
            <p><strong>Email:</strong> ${contactData.workEmail}</p>
            <p><strong>Job Title:</strong> ${contactData.jobTitle}</p>
            <p><strong>Phone:</strong> ${contactData.phoneNumber}</p>
            <p><strong>Expected Users:</strong> ${contactData.expectedUsers}</p>
            <p><strong>Message:</strong> ${
              contactData.message || "No message provided"
            }</p>
          </div>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>IoT Data Hub System</p>
        </div>
      </div>
    </body>
    </html>`,
  };

  // Auto-reply to the contact
  const customerEmail = {
    from: process.env.GOOGLE_EMAIL,
    to: contactData.workEmail,
    subject: "Thank you for contacting IoT Data Hub Sales",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Thank You for Contacting Us</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
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
        .heading {
          color: #fff;
          background-color: #888;
          width: 100%;
          border-radius: 2px;
          padding: 10px;
          margin: 0;
          text-align: center;
        }
        .contents {
          text-align: left;
          padding: 20px;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="outer-container">
        <div class="logo">
          <p>IoT Data Hub</p>
        </div>
        <div class="heading">
          <h1>Thank You for Contacting Us</h1>
        </div>
        <div class="contents">
          <p>Dear ${contactData.firstName},</p>
          <p>Thank you for your interest in IoT Data Hub. We have received your inquiry and our sales team will review it promptly.</p>
          <p>Our team will contact you within 1-2 business days to discuss how we can help you achieve your goals.</p>
          <p>In the meantime, feel free to explore our documentation and resources at ${process.env.NEXT_PUBLIC_BASE_URL}/docs</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>The IoT Data Hub Team</p>
        </div>
      </div>
    </body>
    </html>`,
  };

  await Promise.all([
    transporter.sendMail(salesTeamEmail),
    transporter.sendMail(customerEmail),
  ]);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = contactSalesSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const {
    firstName,
    lastName,
    workEmail,
    jobTitle,
    phoneNumber,
    expectedUsers,
    message,
    organizationId,
  } = validation.data;

  try {
    const newContactRequest = await prisma.contactSales.create({
      data: {
        firstName,
        lastName,
        workEmail,
        jobTitle,
        phoneNumber,
        expectedUsers,
        message,
        organizationId,
      },
    });

    // Send notification emails
    await sendNotificationEmail(validation.data);

    return NextResponse.json(newContactRequest, { status: 201 });
  } catch (error) {
    console.error("Error in contact sales:", error);
    return NextResponse.json(
      { error: "Error processing contact request" },
      { status: 500 },
    );
  }
}
