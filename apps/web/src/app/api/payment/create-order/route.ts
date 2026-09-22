import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

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

    // If live/test credentials exist, create order via Razorpay API
    if (keyId && keySecret && !keyId.includes('placeholder')) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // convert to paise (₹29 -> 2900)
        currency: 'INR',
        receipt: `vibe_rcpt_${Date.now()}`,
        notes: {
          planId: planId || 'vip_monthly',
          planName: planName || 'VIBE VIP',
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        isLive: true,
      });
    }

    // Sandbox testing mode (allows immediate preview and testing)
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
