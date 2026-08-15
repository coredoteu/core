import { Resend } from "resend";

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  amount: number,
  currency: string,
  items: { name: string; quantity: number; price: number }[] = [],
) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping email confirmation.");
    return { success: false, error: "RESEND_API_KEY is not set" };
  }

  const resend = new Resend(RESEND_API_KEY);

  const itemsHtml = items.length
    ? `
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0; font-size: 13px; color: #cccccc;">
        <thead>
          <tr style="border-bottom: 1px solid #222222; text-align: left; font-family: monospace; color: #888888;">
            <th style="padding: 8px 0; font-weight: normal;">item</th>
            <th style="padding: 8px 0; font-weight: normal;">qty</th>
            <th style="padding: 8px 0; text-align: right; font-weight: normal;">price</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (i) => `
            <tr style="border-bottom: 1px solid #1a1a1a;">
              <td style="padding: 10px 0; color: #ffffff;">${i.name}</td>
              <td style="padding: 10px 0; font-family: monospace; color: #aaaaaa;">${i.quantity}</td>
              <td style="padding: 10px 0; text-align: right; font-family: monospace; color: #ffffff;">€${i.price.toFixed(2)}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    `
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <style>
    :root { color-scheme: dark; supported-color-schemes: dark; }
    body { background-color: #000000 !important; margin: 0 !important; padding: 0 !important; width: 100% !important; -webkit-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; }
  </style>
</head>
<body style="background-color: #000000; margin: 0; padding: 0; width: 100%; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000; width: 100%;">
    <tr>
      <td align="center" style="background-color: #000000; padding: 40px 20px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #000000;">
          <tr>
            <td align="left" style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              
              <div style="margin-bottom: 28px;">
                <a href="https://bycore.eu" target="_blank" style="text-decoration: none;">
                  <img src="https://bycore.eu/CORE_logo_trans.png" alt="CORE." width="110" style="display: block; width: 110px; border: 0;" />
                </a>
              </div>

              <p style="font-family: monospace; font-size: 11px; color: #888888; margin: 0 0 12px 0; text-transform: lowercase;">// logistics : order confirmation</p>
              
              <h1 style="font-size: 22px; font-weight: 500; color: #ffffff; margin: 0 0 18px 0; letter-spacing: -0.02em; line-height: 1.3; text-transform: lowercase;">
                your order is confirmed.
              </h1>

              <p style="font-size: 14px; line-height: 1.6; color: #cccccc; margin: 0 0 20px 0;">
                thank you for your order <strong style="color: #ffffff;">${orderNumber}</strong>. your system is being prepared.
              </p>

              ${itemsHtml}

              <div style="margin: 20px 0; border-top: 1px solid #222222; border-bottom: 1px solid #222222; padding: 14px 0;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="font-family: monospace; font-size: 12px; color: #888888;">total paid:</td>
                    <td align="right" style="font-family: monospace; font-size: 14px; font-weight: 600; color: #ffffff;">€${(amount / 100).toFixed(2)} ${currency.toLowerCase()}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 13px; line-height: 1.5; color: #888888; margin: 0 0 28px 0;">
                you will receive a tracking link as soon as your package is handed over to the courier.
              </p>

              <div style="margin: 0 0 32px 0;">
                <a href="https://bycore.eu/account" target="_blank" style="background-color: #ffffff; color: #000000; border-radius: 6px; padding: 10px 22px; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-block; text-transform: lowercase;">
                  view account & order history
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

  try {
    const { data, error } = await resend.emails.send({
      from: "CORE. <contact@bycore.eu>",
      to: email,
      subject: `order confirmation ${orderNumber.toLowerCase()} / CORE.`,
      html: html,
    });

    if (error) {
      console.error("[Resend Error] Failed to send order confirmation:", error);
      return { success: false, error };
    }

    console.log("[Resend Success] Order confirmation sent:", data);
    return { success: true, data };
  } catch (err) {
    console.error("[Resend Exception] Error sending order confirmation:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function createSendcloudParcel(session: any) {
  console.log("Sendcloud integration placeholder called for session:", session.id);
}
