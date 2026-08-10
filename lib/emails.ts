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
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <thead>
          <tr style="border-bottom:1px solid #ddd; text-align:left;">
            <th style="padding:6px 0;">item</th>
            <th style="padding:6px 0;">qty</th>
            <th style="padding:6px 0; text-align:right;">price</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (i) => `
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:6px 0;">${i.name}</td>
              <td style="padding:6px 0;">${i.quantity}</td>
              <td style="padding:6px 0; text-align:right;">€${i.price.toFixed(2)}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    `
    : "";

  const html = `
    <div style="font-family: monospace; color: #000; background: #fff; padding: 20px;">
      <h1 style="text-transform: lowercase; font-weight: normal;">order confirmation.</h1>
      <p>thank you for your order.</p>
      <p>order number: <strong>${orderNumber}</strong></p>
      ${itemsHtml}
      <p>total: <strong>${(amount / 100).toFixed(2)} ${currency.toUpperCase()}</strong></p>
      <br/>
      <p>your system will be prepared for shipping shortly. you will receive a tracking link once it is handed over to our shipping partner.</p>
      <br/>
      <p style="color: #666;">CORE. team</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "CORE. <contact@bycore.eu>",
      to: email,
      subject: `CORE. / Order Confirmation ${orderNumber}`,
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

