import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyInternalRequest } from "@/lib/internalAuth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = verifyInternalRequest(req);
  if (authError) return authError;

  const { id: callId } = await params;
  const { recordingUrl } = await req.json();

  if (!recordingUrl) {
    return NextResponse.json({ error: "recordingUrl is required" }, { status: 400 });
  }

  const call = await prisma.call.update({
    where: { id: callId },
    data: { recordingUrl },
  });

  return NextResponse.json({ call });
}