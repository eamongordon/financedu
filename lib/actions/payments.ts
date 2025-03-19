"use server";

import Stripe from "stripe";
import { headers } from "next/headers";

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
    throw new Error("Missing Stripe secret key");
}

const stripe = new Stripe(stripeKey);

type CheckoutOptions = {
    name?: string;
    dollarAmount: number;
    frequency?: 'month' | 'year';
}

export async function createCheckoutSession(checkoutOptions: CheckoutOptions) {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const { name, dollarAmount, frequency } = checkoutOptions;
    const unitAmount = dollarAmount * 100;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: name ?? "Donation",
                    },
                    unit_amount: unitAmount,
                    recurring: frequency ? { interval: frequency } : undefined,
                },
                quantity: 1,
            },
        ],
        mode: frequency ? 'subscription' : 'payment',
        success_url: `${origin}/thankyou`,
        cancel_url: `${origin}/donate?status=cancelled`,
    });

    return session.url;
}