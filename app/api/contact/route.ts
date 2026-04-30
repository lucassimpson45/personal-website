import { NextResponse } from "next/server";

/**
 * Server-side contact relay. Reads WEB3FORMS_ACCESS_KEY from env (never exposed to the client).
 *
 * Note: Web3Forms may return 403 for server-side fetches on the free tier; their docs require
 * a paid plan + outbound IP safelist for server-to-server calls.
 */
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const MAX = { name: 200, email: 320, subject: 300, message: 20_000 } as const;

type Body = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function validString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey) {
    return NextResponse.json(
      { success: false, message: "Contact form is not configured." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON." }, { status: 400 });
  }

  const name = body.name;
  const email = body.email;
  const subject = body.subject;
  const message = body.message;

  if (
    !validString(name, MAX.name) ||
    !validString(email, MAX.email) ||
    !validString(subject, MAX.subject) ||
    !validString(message, MAX.message)
  ) {
    return NextResponse.json({ success: false, message: "Invalid fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ success: false, message: "Invalid email." }, { status: 400 });
  }

  const upstream = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    }),
  });

  const payload = (await upstream.json().catch(() => null)) as { success?: boolean; message?: string } | null;

  if (upstream.status === 403) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Web3Forms blocked this server request. Their docs require a paid plan and outbound IP safelist for server-side API calls; client-only calls work on the free tier.",
      },
      { status: 503 },
    );
  }

  if (!upstream.ok || !payload?.success) {
    return NextResponse.json({ success: false }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
