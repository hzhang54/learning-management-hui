import express from "express";
import { createStripePaymentIntent, createTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction)
// router should be post, and the route is /stripe/payment-intent, and the controler is createStripePaymentIntent
router.post("/stripe/payment-intent", createStripePaymentIntent);


export default router;
