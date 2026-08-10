const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
async function test() {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'custom',
      mode: 'payment',
      return_url: 'http://localhost:3000/success',
      line_items: [{
        price_data: { currency: 'eur', product_data: { name: 'test' }, unit_amount: 1000 },
        quantity: 1
      }]
    });
    console.log(session.client_secret ? 'Has client_secret' : 'No client_secret');
  } catch (e) {
    console.log(e.message);
  }
}
test();
