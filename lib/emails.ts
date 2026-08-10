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
    return;
  }

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
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CORE. <contact@bycore.eu>",
        to: email,
        subject: `CORE. / Order Confirmation ${orderNumber}`,
        html: html,
      }),
    });

    if (!res.ok) {
      console.error("Failed to send Resend email:", await res.text());
    }
  } catch (err) {
    console.error("Error sending order confirmation:", err);
  }
}

export async function createSendcloudParcel(session: any) {
  // Placeholder for Sendcloud integration
  // This function would map the Stripe session details to a Sendcloud Parcel object
  // and POST it to the Sendcloud API.
  console.log("Sendcloud integration placeholder called for session:", session.id);
  // Example API call:
  // await fetch("https://panel.sendcloud.sc/api/v2/parcels", {
  //   method: "POST",
  //   headers: {
  //     Authorization: \`Basic \${Buffer.from(process.env.SENDCLOUD_KEY + ":" + process.env.SENDCLOUD_SECRET).toString('base64')}\`,
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({ ... })
  // });
}
