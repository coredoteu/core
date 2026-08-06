import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CATALOG } from '@/lib/catalog';
import { FREE_SHIPPING_THRESHOLD_EUR } from '@/lib/constants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123');

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate items against catalog to prevent price manipulation
    const lineItems = items.map((item: any) => {
      const catalogItem = CATALOG.find((p) => p.id === item.product?.id || p.id === item.product);
      if (!catalogItem) {
        throw new Error(`Product ${item.product?.id || item.product} not found in catalog`);
      }

      const activePrice = typeof item.product?.price === 'number' ? item.product.price : catalogItem.price;

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `CORE. ${catalogItem.name}`,
            images: catalogItem.image ? [`https://bycore.eu${catalogItem.image}`] : [],
            metadata: {
              productId: catalogItem.id,
            },
          },
          unit_amount: Math.round(activePrice * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    const subtotal = lineItems.reduce((acc: number, item: any) => acc + (item.price_data.unit_amount * item.quantity), 0);
    const isFreeShipping = subtotal >= (FREE_SHIPPING_THRESHOLD_EUR * 100);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'], // Ideal is popular in EU
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bycore.eu'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bycore.eu'}/cart`,
      shipping_address_collection: {
        allowed_countries: ['NL', 'BE', 'DE', 'FR', 'GB', 'US', 'IT', 'ES'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: isFreeShipping ? 0 : 500, currency: 'eur' },
            display_name: isFreeShipping ? 'Free Standard Shipping' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
