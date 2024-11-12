import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/prisma/client";
import { enterpriseSchema } from "@/validations/schema.validation";

interface EnterpriseData {
  organizationName: string;
  industry: string;
  employeeCount: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  country: string;
  deviceCount: string;
}

async function sendEnterpriseNotificationEmails(
  enterpriseData: EnterpriseData
) {
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

  // Email to enterprise team
  const enterpriseTeamEmail = {
    from: process.env.GOOGLE_EMAIL,
    to: process.env.ENTERPRISE_TEAM_EMAIL || process.env.GOOGLE_EMAIL,
    subject: `New Enterprise Registration: ${enterpriseData.organizationName}`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Enterprise Registration</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f5f7fa;
        }
        .container {
          margin: 0 auto;
          width: 600px;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #1a365d;
          color: #ffffff;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .organization-details {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .contact-details {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }
        h1 {
          margin: 0;
          font-size: 24px;
        }
        h2 {
          color: #334155;
          margin-top: 0;
        }
        p {
          margin: 8px 0;
          color: #475569;
        }
        .highlight {
          color: #1a365d;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Enterprise Registration</h1>
        </div>
        <div class="content">
          <p>A new enterprise organization has registered for IoT Data Hub:</p>
          
          <div class="organization-details">
            <h2>Organization Information</h2>
            <p><span class="highlight">Organization:</span> ${enterpriseData.organizationName}</p>
            <p><span class="highlight">Industry:</span> ${enterpriseData.industry}</p>
            <p><span class="highlight">Employee Count:</span> ${enterpriseData.employeeCount}</p>
            <p><span class="highlight">Device Count:</span> ${enterpriseData.deviceCount}</p>
            <p><span class="highlight">Country:</span> ${enterpriseData.country}</p>
          </div>

          <div class="contact-details">
            <h2>Primary Contact</h2>
            <p><span class="highlight">Name:</span> ${enterpriseData.contactName}</p>
            <p><span class="highlight">Job Title:</span> ${enterpriseData.jobTitle}</p>
            <p><span class="highlight">Email:</span> ${enterpriseData.email}</p>
            <p><span class="highlight">Phone:</span> ${enterpriseData.phone}</p>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message from the IoT Data Hub System</p>
        </div>
      </div>
    </body>
    </html>`,
  };

  // Welcome email to the enterprise
  const enterpriseWelcomeEmail = {
    from: process.env.GOOGLE_EMAIL,
    to: enterpriseData.email,
    subject: "Welcome to IoT Data Hub Enterprise",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to IoT Data Hub Enterprise</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f5f7fa;
        }
        .container {
          margin: 0 auto;
          width: 600px;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #1a365d;
          color: #ffffff;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .next-steps {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }
        h1 {
          margin: 0;
          font-size: 24px;
        }
        h2 {
          color: #334155;
          margin-top: 0;
        }
        p {
          margin: 8px 0;
          color: #475569;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #1a365d;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to IoT Data Hub Enterprise</h1>
        </div>
        <div class="content">
          <p>Dear ${enterpriseData.contactName},</p>
          
          <p>Thank you for choosing IoT Data Hub Enterprise for ${enterpriseData.organizationName}. We're excited to help you harness the power of IoT data at scale.</p>
          
          <div class="next-steps">
            <h2>Next Steps</h2>
            <p>1. Our enterprise team will contact you within one business day to:</p>
            <ul>
              <li>Schedule your onboarding consultation</li>
              <li>Discuss your specific requirements</li>
              <li>Set up your enterprise workspace</li>
              <li>Configure your security and compliance settings</li>
            </ul>
            
            <p>2. In the meantime, you can:</p>
            <ul>
              <li>Review our enterprise documentation</li>
              <li>Prepare your team list for access management</li>
              <li>Gather your device inventory details</li>
            </ul>
          </div>

          <p>For immediate access to our resources:</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/docs/enterprise" class="button">View Enterprise Documentation</a>
          
          <p>If you have any questions before our team reaches out, please contact enterprise-support@iotdatahub.com</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>The IoT Data Hub Enterprise Team</p>
        </div>
      </div>
    </body>
    </html>`,
  };

  await Promise.all([
    transporter.sendMail(enterpriseTeamEmail),
    transporter.sendMail(enterpriseWelcomeEmail),
  ]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = enterpriseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const {
      organizationName,
      industry,
      employeeCount,
      contactName,
      jobTitle,
      email,
      phone,
      country,
      deviceCount,
    } = validation.data;

    // Create new organization
    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        type: "ENTREPRISE",
        industry,
        employeeCount,
        contactName,
        jobTitle,
        email,
        phoneNumber: phone,
        country,
        deviceCount,
      },
    });

    // Send notification emails
    await sendEnterpriseNotificationEmails(validation.data);

    return NextResponse.json(organization, { status: 201 });
  } catch (error) {
    console.error("Enterprise registration error:", error);
    return NextResponse.json(
      { error: "Error creating enterprise account" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        type: "ENTREPRISE",
      },
    });
    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching enterprise accounts:", error);
    return NextResponse.json(
      { error: "Error fetching enterprise accounts" },
      { status: 500 }
    );
  }
}
