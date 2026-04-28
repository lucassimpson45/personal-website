import { Resend } from "resend";
import { NextResponse } from "next/server";

const TO = "lucas@goluda.ai";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing RESEND_API_KEY." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a JSON object." }, { status: 400 });
  }

  const { name, email, subject, message } = body as Record<string, unknown>;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(subject) || !isNonEmptyString(message)) {
    return NextResponse.json(
      { error: "name, email, subject, and message are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const nameTrim = name.trim().slice(0, 200);
  const emailTrim = email.trim().slice(0, 320);
  const subjectTrim = subject.trim().slice(0, 200);
  const messageTrim = message.trim().slice(0, 20000);

  const from =
    process.env.RESEND_FROM?.trim() ||
    "Lucas Simpson <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  const text = [
    `From: ${nameTrim}`,
    `Email: ${emailTrim}`,
    "",
    messageTrim,
  ].join("\n");

  const { data, error } = await resend.emails.send({
    from,
    to: [TO],
    replyTo: emailTrim,
    subject: `[Portfolio] ${subjectTrim}`,
    text,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Failed to send email." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, id: data?.id ?? null });
}
