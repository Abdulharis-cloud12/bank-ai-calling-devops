import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: callId } = await params;

  const call = await prisma.call.findUnique({
    where: { id: callId },
    select: { recordingUrl: true },
  });

  if (!call?.recordingUrl) {
    return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID_PROXY || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN_PROXY || "";
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  const twilioResponse = await fetch(call.recordingUrl, {
    headers: { Authorization: `Basic ${credentials}` },
  });

  if (!twilioResponse.ok || !twilioResponse.body) {
    const errorText = await twilioResponse.text().catch(() => "");
    console.error(`[Recordings] Twilio fetch failed: status=${twilioResponse.status} body=${errorText}`);
    return NextResponse.json({ error: "Failed to fetch recording from Twilio" }, { status: 502 });
  }

  return new NextResponse(twilioResponse.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=3600",
    },
  });
}