import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    const serverSecret = process.env.PASSWORD;

    if (!serverSecret) {
      return NextResponse.json({ success: false, error: "Server not configured (PASSWORD missing)" }, { status: 500 });
    }

    if (secret === serverSecret) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid secret" }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
