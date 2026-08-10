import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { orderNumber, name, email, reason } = data;

    if (!orderNumber || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      // In development, just return success if no API key is set
      console.warn("Withdrawal request received but RESEND_API_KEY is not set.");
      console.log("Data:", data);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const html = `
      <div style="font-family: monospace; padding: 20px;">
        <h2>Withdrawal Notice (Herroepingsformulier)</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reason (optional):</strong><br/> ${reason || "None provided"}</p>
        <br/>
        <p><em>Submitted via bycore.eu</em></p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CORE. System <contact@bycore.eu>",
        to: "contact@bycore.eu", // Send to shop owner
        reply_to: email,
        subject: `Withdrawal Request - Order ${orderNumber}`,
        html: html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Withdrawal API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
