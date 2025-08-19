import express from "express";
import { createStripePaymentIntent } from "../controllers/transactionController.js";

const router = express.Router();

// router should be post, and the route is /stripe/payment-intent, and the controler is createStripePaymentIntent
router.post("/stripe/payment-intent", createStripePaymentIntent);

export default router;
