import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-07-29.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Use the service role key (or anon key as fallback) to insert orders from the webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Extract details
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;
      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
      const currency = session.currency || 'eur';
      const paymentStatus = session.payment_status;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shippingDetails = (session as any).shipping_details ?? session.customer_details;

      // Insert Order into Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_session_id: session.id,
          customer_email: customerEmail,
          customer_name: customerName,
          amount_total: amountTotal,
          currency: currency,
          payment_status: paymentStatus,
          shipping_details: shippingDetails,
        })
        .select('id')
        .single();

      if (orderError) {
        console.error('Error inserting order:', orderError);
        throw orderError;
      }

      // Fetch line items with expanded product data to get our internal catalog productId from metadata
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      });
      
      const orderItemsToInsert = lineItems.data.map((item) => {
        const stripeProduct = item.price?.product as Stripe.Product | undefined;
        const catalogProductId = stripeProduct?.metadata?.productId || null;

        return {
          order_id: orderData.id,
          product_id: catalogProductId,
          quantity: item.quantity || 1,
          price_at_purchase: (item.amount_total || 0) / 100,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.error('Error inserting order items:', itemsError);
        throw itemsError;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
