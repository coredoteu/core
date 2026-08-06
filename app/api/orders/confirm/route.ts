import { NextResponse } from 'next/server';
import { syncStripeSessionToSupabase } from '@/lib/orders';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const order = await syncStripeSessionToSupabase(sessionId);
    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Order confirmation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to confirm order' }, { status: 500 });
  }
}
