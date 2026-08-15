import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { orderId, requestType, newAddress } = await req.json();
  if (!orderId || !requestType) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const shortRef = String(orderId).slice(0, 8).toLowerCase();

  // Persist cancellation request to Supabase so it remains locked upon page refresh
  if (requestType === "cancel") {
    await supabaseAdmin
      .from("orders")
      .update({
        cancellation_requested: true,
        cancellation_requested_at: new Date().toISOString(),
      })
      .eq("id", orderId);
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.warn("Order change request (no RESEND_API_KEY):", {
      orderId,
      requestType,
      newAddress,
      customerEmail: session.user.email,
    });
    return NextResponse.json({ success: true });
  }

  // 1. Support Team Email (pure black bgcolor + style, 100% lowercase except CORE.)
  const supportSubject =
    requestType === "cancel"
      ? `[action required] pre-order cancellation - #${shortRef} / CORE.`
      : `[action required] shipping address update - #${shortRef} / CORE.`;

  const supportHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title></title>
</head>
<body bgcolor="#000000" style="margin: 0; padding: 0; background-color: #000000; color: #ffffff; width: 100% !important;">
  <table role="presentation" bgcolor="#000000" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; width: 100%; margin: 0; padding: 0;">
    <tr>
      <td align="center" bgcolor="#000000" style="background-color: #000000; padding: 40px 20px;">
        <table role="presentation" bgcolor="#000000" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #000000; width: 100%;">
          <tr>
            <td align="left" bgcolor="#000000" style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              
              <div style="margin-bottom: 28px;">
                <a href="https://bycore.eu" target="_blank" style="text-decoration: none;">
                  <img src="https://bycore.eu/CORE_logo_trans.png" alt="CORE." width="110" style="display: block; width: 110px; border: 0;" />
                </a>
              </div>

              <p style="font-family: monospace; font-size: 11px; color: #888888; margin: 0 0 12px 0;">// internal : support action required</p>
              
              <h1 style="font-size: 22px; font-weight: 500; color: #ffffff; margin: 0 0 24px 0; letter-spacing: -0.02em; line-height: 1.3;">
                ${requestType === "cancel" ? "pre-order cancellation request" : "shipping address change request"}
              </h1>

              <div style="background-color: #111111; border: 1px solid #222222; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #cccccc;">
                  <tr>
                    <td style="padding: 6px 0; font-family: monospace; color: #888888; width: 130px;">request type:</td>
                    <td style="padding: 6px 0; font-family: monospace; color: #ffffff;">${requestType === "cancel" ? "cancellation" : "address change"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-family: monospace; color: #888888;">order ref:</td>
                    <td style="padding: 6px 0; font-family: monospace; color: #ffffff;">#${shortRef}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-family: monospace; color: #888888;">order id:</td>
                    <td style="padding: 6px 0; font-family: monospace; font-size: 11px; color: #aaaaaa;">${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-family: monospace; color: #888888;">customer:</td>
                    <td style="padding: 6px 0; color: #ffffff;">
                      <a href="mailto:${session.user.email}" style="color: #ffffff; text-decoration: underline;">${session.user.email}</a>
                    </td>
                  </tr>
                  ${
                    newAddress
                      ? `
                  <tr>
                    <td style="padding: 6px 0; font-family: monospace; color: #888888; vertical-align: top;">new address:</td>
                    <td style="padding: 6px 0; color: #ffffff; font-weight: 500; line-height: 1.4;">${newAddress}</td>
                  </tr>`
                      : ""
                  }
                </table>
              </div>

              <p style="font-size: 13px; color: #888888; line-height: 1.6; margin: 0 0 24px 0;">
                ${
                  requestType === "cancel"
                    ? "database state updated to cancellation_requested = true. please process refund via stripe dashboard."
                    : "please update shipping address in sendcloud dashboard."
                }
              </p>

              <div style="border-top: 1px solid #222222; padding-top: 20px; margin-top: 32px;">
                <p style="font-family: monospace; font-size: 11px; color: #555555; margin: 0;">
                  CORE. system notification
                </p>
              </div>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "CORE. <contact@bycore.eu>",
      to: "contact@bycore.eu",
      reply_to: session.user.email,
      subject: supportSubject,
      html: supportHtml,
    }),
  });

  // 2. Customer Confirmation Email (pure black bgcolor + style, 100% lowercase except CORE.)
  if (session.user.email.toLowerCase() !== "contact@bycore.eu") {
    const customerSubject =
      requestType === "cancel"
        ? `cancellation request received for order #${shortRef} / CORE.`
        : `address change request received for order #${shortRef} / CORE.`;

    const customerHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title></title>
</head>
<body bgcolor="#000000" style="margin: 0; padding: 0; background-color: #000000; color: #ffffff; width: 100% !important;">
  <table role="presentation" bgcolor="#000000" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; width: 100%; margin: 0; padding: 0;">
    <tr>
      <td align="center" bgcolor="#000000" style="background-color: #000000; padding: 40px 20px;">
        <table role="presentation" bgcolor="#000000" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #000000; width: 100%;">
          <tr>
            <td align="left" bgcolor="#000000" style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              
              <div style="margin-bottom: 28px;">
                <a href="https://bycore.eu" target="_blank" style="text-decoration: none;">
                  <img src="https://bycore.eu/CORE_logo_trans.png" alt="CORE." width="110" style="display: block; width: 110px; border: 0;" />
                </a>
              </div>

              <p style="font-family: monospace; font-size: 11px; color: #888888; margin: 0 0 12px 0;">// logistics : request confirmation</p>
              
              <h1 style="font-size: 22px; font-weight: 500; color: #ffffff; margin: 0 0 18px 0; letter-spacing: -0.02em; line-height: 1.3;">
                ${requestType === "cancel" ? "cancellation request received." : "address change request received."}
              </h1>

              <p style="font-size: 14px; line-height: 1.6; color: #cccccc; margin: 0 0 28px 0;">
                ${
                  requestType === "cancel"
                    ? `we have received your cancellation request for order <strong style="color: #ffffff;">#${shortRef}</strong>. our support team is processing your request and will follow up shortly.`
                    : `we have received your address update request for order <strong style="color: #ffffff;">#${shortRef}</strong>. new address: <strong style="color: #ffffff;">${newAddress}</strong>. our team is updating your shipping details.`
                }
              </p>

              <div style="margin: 0 0 32px 0;">
                <a href="https://bycore.eu/account" target="_blank" style="background-color: #ffffff; color: #000000; border-radius: 6px; padding: 10px 22px; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-block;">
                  view account
                </a>
              </div>

              <div style="border-top: 1px solid #222222; padding-top: 20px; margin-top: 32px;">
                <p style="font-family: monospace; font-size: 11px; color: #555555; margin: 0;">
                  refined to the core.
                </p>
              </div>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "CORE. <contact@bycore.eu>",
        to: session.user.email,
        subject: customerSubject,
        html: customerHtml,
      }),
    });
  }

  return NextResponse.json({ success: true });
}
