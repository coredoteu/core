import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Finds an existing Stripe Customer by exact email match, or creates one.
 * Because every checkout path (guest or logged-in) always calls this first,
 * a given email naturally converges on a single Stripe Customer over time —
 * there is never a separate "merge" step required.
 */
export async function getOrCreateStripeCustomer(
  email: string,
  name?: string | null,
): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]) {
    return existing.data[0].id;
  }

  const created = await stripe.customers.create({
    email,
    name: name ?? undefined,
  });
  return created.id;
}
