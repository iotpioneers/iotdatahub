import { NextResponse, NextRequest } from "next/server";
import * as XLSX from "xlsx";
import prisma from "@/prisma/client";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
    hour: "numeric",
    second: "numeric",
    minute: "numeric",
  }).format(new Date(date));

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const urlSearchParams = new URLSearchParams(request.url.split("?")[1]);
  const format = urlSearchParams.get("format");

  // Define the autoIncrement function
  let nextId = 1;

  function autoIncrement() {
    const currentId = nextId;
    nextId++;
    return currentId;
  }

  try {
    const channel = await prisma.channel.findUnique({
      where: { id: params.id },
    });

    if (!channel)
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    // Find a data points
    const dataPoint = await prisma.dataPoint.findMany({
      where: { channelId: channel.id },
      orderBy: { createdAt: "desc" },
    });

    if (dataPoint === null || dataPoint.length === 0)
      return NextResponse.json("No found on this channel", { status: 404 });

    const dataGenerated: Array<any> = [];

    // Fetch additional information based on fieldId for each data point
    for (let i = 0; i < dataPoint.length; i++) {
      const { value, createdAt } = dataPoint[i];

      const fieldId = dataPoint[i].fieldId;
      const field = await prisma.field.findFirst({
        where: { id: fieldId },
      });

      if (!field) {
        continue;
      }

      dataGenerated.push({
        id: autoIncrement(),
        Field: field.name,
        Value: value,
        createdAt: formatDate(createdAt),
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(dataGenerated);

    if (format === "csv") {
      const csv = XLSX.utils.sheet_to_csv(worksheet, {
        forceQuotes: true,
      });

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${dataGenerated}.csv"`,
          "Content-Type": "text/csv",
        },
      });
    } else if (format === "txt") {
      // tab-separated values

      const txt = XLSX.utils.sheet_to_txt(worksheet, {
        forceQuotes: true,
      });

      return new Response(txt, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${dataGenerated}.txt"`,
          "Content-Type": "text/csv",
        },
      });
    } else if (format === "xlsx") {
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet");

      const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      return new Response(buf, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${dataGenerated}.xlsx"`,
          "Content-Type": "application/vnd.ms-excel",
        },
      });
    } else if (format === "json") {
      return Response.json(dataGenerated);
    } else {
      const html = XLSX.utils.sheet_to_html(worksheet);

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, {
        status: 400,
      });
    }
  }
}
