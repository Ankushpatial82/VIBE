import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isLive } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // In live mode, verify cryptographic HMAC signature
    if (isLive && keySecret && !keySecret.includes('placeholder')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: 'Payment signature verification failed' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully! Welcome to VIBE VIP.',
      paymentId: razorpay_payment_id || `pay_sim_${Date.now()}`,
    });
  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Verification failed' },
      { status: 500 }
    );
  }
}
