import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, planId, planName } = body;

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live/test credentials exist, create order via Razorpay REST API
    if (keyId && keySecret && !keyId.includes('placeholder')) {
      const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // convert to paise (₹29 → 2900)
          currency: 'INR',
          receipt: `vibe_rcpt_${Date.now()}`,
          notes: {
            planId: planId || 'vip_monthly',
            planName: planName || 'VIBE VIP',
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.description || 'Razorpay order creation failed');
      }

      const order = await response.json();

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        isLive: true,
      });
    }

    // Sandbox / no-credentials fallback
    const mockOrderId = `order_sim_${Date.now()}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      keyId: keyId || 'rzp_test_placeholder',
      isLive: false,
    });
  } catch (error: unknown) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Order creation failed' },
      { status: 500 }
    );
  }
}
