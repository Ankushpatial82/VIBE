'use client';

import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, ShieldCheck, ArrowRight, Loader2, PartyPopper } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  badge?: string;
  description: string;
  popular?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: 'plan_weekly',
    name: 'Weekly Pass',
    price: 29,
    duration: '7 Days',
    description: 'Chai se bhi sasta! ☕ 7 din bina kisi ad ke',
  },
  {
    id: 'plan_monthly',
    name: 'Monthly Pro',
    price: 79,
    duration: '30 Days',
    badge: 'MOST POPULAR',
    description: 'Full Ad-Free + Unlimited AI Prompts + VIP Rooms',
    popular: true,
  },
  {
    id: 'plan_annual',
    name: 'Annual VIP',
    price: 399,
    duration: '1 Year',
    badge: 'SAVE 60%',
    description: 'Best deal! Poore 1 saal ka complete access',
  },
];

declare global {
  interface Window {
    Razorpay?: unknown;
  }
}

export const PremiumModal: React.FC = () => {
  const { isPremiumModalOpen, setPremiumModalOpen, updateProfile, user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(PLANS[1]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isPremiumModalOpen) return null;

  // Load Razorpay checkout script on demand
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.price,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Could not initiate checkout');
      }

      // If Razorpay live credentials exist, open Razorpay popup
      if (orderData.isLive && orderData.keyId) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Could not load Razorpay payment gateway. Please check internet connection.');
        }

        const RazorpayConstructor = window.Razorpay as new (options: Record<string, unknown>) => { open: () => void };
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'VIBE Music',
          description: `${selectedPlan.name} Subscription`,
          order_id: orderData.orderId,
          prefill: {
            name: user.name,
            email: 'listener@vibe.app',
          },
          theme: {
            color: '#7c3aed',
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            // Verify payment
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                isLive: true,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              completeUpgrade();
            } else {
              setErrorMessage('Verification failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false);
            },
          },
        };

        const rzp = new RazorpayConstructor(options);
        rzp.open();
        setIsLoading(false);
        return;
      }

      // If in sandbox/demo mode (before live keys are pasted), simulate realistic UPI checkout
      await new Promise((r) => setTimeout(r, 1200));
      completeUpgrade();
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      setErrorMessage((err as Error).message || 'Payment initiation failed. Please try again.');
      setIsLoading(false);
    }
  };

  const completeUpgrade = () => {
    updateProfile({ isPremium: true });
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07070b]/90 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#101018] border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl shadow-amber-950/80">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/15 blur-3xl rounded-full pointer-events-none" />

        <button
          onClick={() => {
            setPremiumModalOpen(false);
            setIsSuccess(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center text-center py-8 gap-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xl shadow-amber-500/40 animate-bounce">
              <Crown className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Welcome to <span className="text-amber-400">VIBE VIP!</span> 🎉
            </h2>
            <p className="text-sm text-slate-300 max-w-sm">
              Aapka payment successful raha! Saari ads band ho gayi hain aur Master Quality audio + VIP Badge unlock ho gaya hai.
            </p>
            <button
              onClick={() => {
                setPremiumModalOpen(false);
                setIsSuccess(false);
              }}
              className="mt-4 px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
            >
              Start Listening Now
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Instant UPI & Card Activation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Upgrade to VIBE VIP</h2>
              <p className="text-xs text-slate-400 mt-1">100% Ad-Free • FLAC Audio • Unlimited AI Playlists</p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Plans Selection */}
            <div className="flex flex-col gap-3">
              {PLANS.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-transparent border-amber-400/80 shadow-lg shadow-amber-950/50 scale-[1.01]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-sm">
                        {plan.badge}
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-500'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                          <span className="text-xs text-slate-400 font-medium">({plan.duration})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{plan.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-amber-300">₹{plan.price}</div>
                      <span className="text-[10px] text-slate-500 block">UPI / Card</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Perks List */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-white/5 p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Zero Audio/Banner Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Lossless 320kbps Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>VIP Crown Profile Badge</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Host 100-Member Rooms</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="flex flex-col items-center gap-2.5">
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-600 hover:from-amber-400 hover:via-purple-500 hover:to-pink-500 text-white font-black text-sm shadow-xl shadow-amber-950/60 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Secure UPI Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{selectedPlan.price} via UPI / Cards</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Activation • GPay, PhonePe, Paytm & Cards Supported</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
