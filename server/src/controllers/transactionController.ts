import Stripe from "stripe";
import dotenv from "dotenv";
import type { Request, Response } from "express";

dotenv.config();

// test if stripe secret key is not defined, then throw error
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is required but was not found in env variables"
  );
}

// instantiate a stripe object using secrete key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// create a stripe payment intent with request and response from express. Use getCourse() in ./courseController.ts as example
export const createStripePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  // get amount from req
  let { amount } = req.body;
  // if amount is <= 0, set amount to 50 which is the minimum amount allowed by stripe
  if (!amount || amount <= 0) {
    amount = 50;
  }

  // try to create payment intents with the amount, in currency "usd", and never allow redirects.
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    // keep the message blank to prevent front end from seeing the message.
    // in the data we include client secret, so that this gets sent to the front end
    res.json({
      message: "",
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating stripe payment intent", error });
  }
};

export default stripe;
