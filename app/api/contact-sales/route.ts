import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/prisma/client";
import { contactSalesSchema } from "@/validations/schema.validation";
import { ContactSalesFormData } from "@/types";

async function sendNotificationEmail(contactData: ContactSalesFormData) {
  const {
    firstName,
    lastName,
    workEmail,
    jobTitle,
    phoneNumber,
    expectedUsers,
  } = contactData;

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

  // Sales Team Notification Email
  const salesTeamEmail = {
    from: process.env.GOOGLE_EMAIL,
    to: process.env.SALES_TEAM_EMAIL || process.env.GOOGLE_EMAIL,
    subject: "New Sales Inquiry from Potential Customer",
    html: `
    <!DOCTYPE">
    <html dir="ltr" lang="en">

      <head>
        <link rel="preload" as="image" href="https://www.iotdatahub.rw/_next/image?url=%2FIOT_DATA_HUB.png&w=256&q=75" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" /><!--$-->
      </head>
      <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">New Sales Contact Request<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
      </div>

      <body style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;background-color:#ffffff">
        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:100%;margin:0 auto;padding:20px 0 48px;width:660px">
          <tbody>
            <tr style="width:100%">
              <td>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                          <tbody style="width:100%">
                            <tr style="width:100%">
                              <td data-id="__react-email-column"><img alt="IoT DATA HUB Logo" height="42" src="https://www.iotdatahub.rw/_next/image?url=%2FIOT_DATA_HUB.png&w=256&q=75" style="display:block;outline:none;border:none;text-decoration:none" width="42" /></td>
                              <td align="right" data-id="__react-email-column" style="display:table-cell">
                                <p style="font-size:32px;line-height:24px;margin:16px 0;font-weight:300;color:#888888">New Sales Contact Request</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody>
                    <tr>
                      <td>
                        <p style="font-size:14px;line-height:24px;margin:36px 0 40px 0;text-align:center;font-weight:500;color:#111111">Customer Details</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;color:rgb(51,51,51);background-color:rgb(250,250,250);border-radius:3px;font-size:12px">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="height:46px">
                          <tbody style="width:100%">
                            <tr style="width:100%">
                              <td colSpan="2" data-id="__react-email-column">
                                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                                          <tbody style="width:100%">
                                              <td data-id="__react-email-column" style="padding-left:20px;border-style:solid;border-color:white;border-width:0px 1px 1px 0px;height:44px">
                                                <p style="font-size:10px;line-height:1.4;margin:0;padding:0;color:rgb(102,102,102)">USER NAME</p><a style="color:#15c;text-decoration-line:none;font-size:12px;margin:0;padding:0;line-height:1.4;text-decoration:underline" target="_blank">${firstName} ${lastName}</a>
                                              </td>
                                          </tbody>
                                        </table>
                                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                                          <tbody style="width:100%">
                                            <tr style="width:100%">
                                              <td data-id="__react-email-column" style="padding-left:20px;border-style:solid;border-color:white;border-width:0px 1px 1px 0px;height:44px">
                                                <p style="font-size:10px;line-height:1.4;margin:0;padding:0;color:rgb(102,102,102)">WORK EMAIL</p><a style="color:#15c;text-decoration-line:none;font-size:12px;margin:0;padding:0;line-height:1.4;text-decoration:underline" target="_blank">${workEmail}</a>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                                          <tbody style="width:100%">
                                            <tr style="width:100%">
                                              <td data-id="__react-email-column" style="padding-left:20px;border-style:solid;border-color:white;border-width:0px 1px 1px 0px;height:44px">
                                                <p style="font-size:10px;line-height:1.4;margin:0;padding:0;color:rgb(102,102,102)">Job Title</p>
                                                <p style="font-size:12px;line-height:1.4;margin:0;padding:0">${jobTitle}</p>
                                              </td>
                                              <td data-id="__react-email-column" style="padding-left:20px;border-style:solid;border-color:white;border-width:0px 1px 1px 0px;height:44px">
                                                <p style="font-size:10px;line-height:1.4;margin:0;padding:0;color:rgb(102,102,102)">INQUIRY DATE</p>
                                                <p style="font-size:12px;line-height:1.4;margin:0;padding:0">${new Date().getFullYear()}</p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td colSpan="2" data-id="__react-email-column" style="padding-left:20px;border-style:solid;border-color:white;border-width:0px 1px 1px 0px;height:44px">
                                <p style="font-size:10px;line-height:1.4;margin:0;padding:0;color:rgb(102,102,102)">EXPECTED NUMBER OF USERS</p>
                                <p style="font-size:12px;line-height:1.4;margin:0;padding:0">${expectedUsers}</p>
                                <p style="font-size:12px;line-height:1.4;margin:0;padding:0">${phoneNumber}</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                          <tbody style="width:100%">
                            <tr style="width:100%">
                              <td align="center" data-id="__react-email-column" style="display:block;margin:40px 0 0 0"><img alt="IoT DATA HUB" height="26" src="https://www.iotdatahub.rw/_next/image?url=%2FIOT_DATA_HUB.png&w=256&q=75" style="display:block;outline:none;border:none;text-decoration:none" width="26" /></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:12px;line-height:24px;margin:25px 0 0 0;text-align:center;color:rgb(102,102,102)">Copyright © ${new Date().getFullYear()} IoT DATA HUB. <br /> <a href="${process.env.NEXTAUTH_URL}" style="color:#067df7;text-decoration-line:none" target="_blank">All rights reserved</a></p>
              </td>
            </tr>
          </tbody>
        </table><!--/$-->
      </body>

    </html>
    `,
  };

  // Customer Auto-Reply Email
  const customerEmail = {
    from: process.env.GOOGLE_EMAIL,
    to: contactData.workEmail,
    subject: "Your Sales Inquiry with IoT Data Hub",
    html: `
    <!DOCTYPE">
    <html dir="ltr" lang="en">

      <head>
        <link rel="preload" as="image" href="https://www.iotdatahub.rw/_next/image?url=%2FIOT_DATA_HUB.png&w=256&q=75" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" /><!--$-->
      </head>
      <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Thank You for Contacting IoT Data Hub<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
      </div>

      <body style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;background-color:#ffffff">
        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:100%;margin:0 auto;padding:20px 0 48px;width:660px">
          <tbody>
            <tr style="width:100%">
              <td>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                          <tbody style="width:100%">
                            <tr style="width:100%">
                              <td data-id="__react-email-column"><img alt="IoT DATA HUB Logo" height="42" src="https://www.iotdatahub.rw/_next/image?url=%2FIOT_DATA_HUB.png&w=256&q=75" style="display:block;outline:none;border:none;text-decoration:none" width="42" /></td>
                              <td align="right" data-id="__react-email-column" style="display:table-cell">
                                <p style="font-size:32px;line-height:24px;margin:16px 0;font-weight:300;color:#888888">Dear ${firstName},</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;margin:0 0 75px 0" />
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;margin:65px 0 20px 0" />
                <p style="font-size:12px;line-height:auto;margin:0;color:rgb(102,102,102);margin-bottom:16px">Thank you for reaching out to IoT Data Hub's sales team. We have received your inquiry and will review the details shortly.</p>
                <p style="font-size:12px;line-height:auto;margin:0;color:rgb(102,102,102);margin-bottom:16px">Our sales representatives will contact you at ${workEmail} within 1-2 business days to discuss how our solutions can meet your needs.</p>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                          <tbody style="width:100%">
                            <tr style="width:100%">
                              <td align="center" data-id="__react-email-column" style="display:block;margin:40px 0 0 0"><img alt="IoT DATA HUB" height="26" src="https://www.iotdatahub.rw/_next/image?url=%2FIOT_DATA_HUB.png&w=256&q=75" style="display:block;outline:none;border:none;text-decoration:none" width="26" /></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:12px;line-height:24px;margin:25px 0 0 0;text-align:center;color:rgb(102,102,102)">Copyright © ${new Date().getFullYear()} IoT DATA HUB. <br /> <a href="${process.env.NEXTAUTH_URL}" style="color:#067df7;text-decoration-line:none" target="_blank">All rights reserved</a></p>
              </td>
            </tr>
          </tbody>
        </table><!--/$-->
      </body>

    </html>
    `,
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
    return NextResponse.json(
      { error: "Error processing contact request" },
      { status: 500 },
    );
  }
}
