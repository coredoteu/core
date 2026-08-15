import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { recalculateOrderProfit } from "@/lib/funding-engine";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, parcel } = body;

        if (action !== "parcel_status_changed" || !parcel) {
            return NextResponse.json({ message: "Ignored action" }, { status: 200 });
        }

        const customerEmail = parcel.email;
        const customerName = String(parcel.name || "customer").toLowerCase();
        const orderNumber = String(parcel.order_number || parcel.reference || "").toLowerCase();
        const trackingUrl = parcel.tracking_url || "https://bycore.eu";
        const trackingNumber = parcel.tracking_number || "";
        const carrierName = typeof parcel.carrier === "string" ? parcel.carrier : parcel.carrier?.name || "postnl";
        const statusCode = parcel.status?.id;

        let shippingStatus = "label_created";
        if (statusCode === 12) shippingStatus = "delivered";
        else if (statusCode === 13) shippingStatus = "out_for_delivery";
        else if (statusCode === 11) shippingStatus = "in_transit";
        else if (statusCode === 1000 || statusCode === 1 || statusCode === 3) shippingStatus = "picked_up";

        if (orderNumber) {
            const { data: updatedOrders } = await supabaseAdmin
                .from("orders")
                .update({
                    carrier: carrierName,
                    tracking_number: trackingNumber,
                    tracking_url: trackingUrl,
                    shipping_status: shippingStatus,
                })
                .or(`id.ilike.%${orderNumber}%,stripe_session_id.ilike.%${orderNumber}%`)
                .select("id");

            // Update shipping_cogs with the actual carrier cost if Sendcloud provides it
            // Sendcloud surfaces this in parcel.shipment.price or parcel.price (carrier cost in EUR)
            const actualShippingCost: number | undefined =
                parcel.shipment?.price ?? parcel.price ?? undefined;

            if (actualShippingCost !== undefined && updatedOrders && updatedOrders.length > 0) {
                for (const row of updatedOrders) {
                    await supabaseAdmin
                        .from("orders")
                        .update({ shipping_cogs: actualShippingCost })
                        .eq("id", row.id);

                    // Recalculate profit now that we have the real shipping cost
                    await recalculateOrderProfit(row.id);
                    console.log(
                        `[Sendcloud Webhook] Updated shipping_cogs to ${actualShippingCost} and recalculated profit for order ${row.id}`,
                    );
                }
            }
        }

        if (statusCode === 11) {
            await resend.emails.send({
                from: "CORE. <contact@bycore.eu>",
                to: customerEmail,
                subject: `your order ${orderNumber} is on its way / CORE.`,
                html: `
        <div style="background-color: #0d0d0d; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #0d0d0d; text-align: left;">
            <a href="https://bycore.eu" target="_blank" style="text-decoration: none; display: inline-block; margin-bottom: 30px;">
              <img src="https://bycore.eu/CORE_logo_trans.png" alt="CORE." width="120" style="display: block; width: 120px; border: 0;" />
            </a>
            <p style="font-family: monospace; font-size: 11px; color: #888888; margin: 0 0 16px 0;">// logistics : shipment update</p>
            <h2 style="font-size: 20px; font-weight: 500; color: #ffffff; margin: 0 0 16px 0;">your order is on its way.</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #cccccc; margin: 0 0 24px 0;">
              hi ${customerName}, your order ${orderNumber} has been packed and handed over to the courier. you can track your package in real-time below.
            </p>
            <div style="margin: 0 0 28px 0;">
              <a href="${trackingUrl}" target="_blank" style="background-color: #ffffff; color: #0d0d0d; text-decoration: none; padding: 12px 28px; font-size: 12px; font-weight: 600; display: inline-block;">
                track shipment
              </a>
            </div>
            <p style="font-size: 12px; line-height: 1.5; color: #666666; margin: 0 0 20px 0;">
              delivery estimates are managed directly by the courier. if you have questions regarding your order, reply to this email.
            </p>
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px;">
              <p style="font-size: 11px; color: #666666; margin: 0 0 6px 0;">button not working? copy this tracking link:</p>
              <p style="font-family: monospace; font-size: 11px; color: #888888; word-break: break-all; margin: 0;">
                <a href="${trackingUrl}" style="color: #888888; text-decoration: underline;">${trackingUrl}</a>
              </p>
            </div>
          </div>
        </div>
        `,
            });
        } else if (statusCode === 12) {
            await resend.emails.send({
                from: "CORE. <contact@bycore.eu>",
                to: customerEmail,
                subject: `your order ${orderNumber} has been delivered / CORE.`,
                html: `
        <div style="background-color: #0d0d0d; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #ffffff;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #0d0d0d; text-align: left;">
            <a href="https://bycore.eu" target="_blank" style="text-decoration: none; display: inline-block; margin-bottom: 30px;">
              <img src="https://bycore.eu/CORE_logo_trans.png" alt="CORE." width="120" style="display: block; width: 120px; border: 0;" />
            </a>
            <p style="font-family: monospace; font-size: 11px; color: #888888; margin: 0 0 16px 0;">// logistics : delivery confirmation</p>
            <h2 style="font-size: 20px; font-weight: 500; color: #ffffff; margin: 0 0 16px 0;">your order has been delivered.</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #cccccc; margin: 0 0 24px 0;">
              hi ${customerName}, package for order ${orderNumber} was successfully delivered. we hope you enjoy your routine.
            </p>
            <div style="margin: 0 0 28px 0;">
              <a href="https://bycore.eu" target="_blank" style="background-color: #ffffff; color: #0d0d0d; text-decoration: none; padding: 12px 28px; font-size: 12px; font-weight: 600; display: inline-block;">
                visit CORE.
              </a>
            </div>
            <p style="font-size: 12px; line-height: 1.5; color: #666666; margin: 0 0 20px 0;">
              if you have any questions regarding your system, actives, or routine, contact us directly at contact@bycore.eu.
            </p>
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px;">
              <p style="font-family: monospace; font-size: 11px; color: #666666; margin: 0;">
                refined to the core.
              </p>
            </div>
          </div>
        </div>
        `,
            });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("[Sendcloud Webhook Error]", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}