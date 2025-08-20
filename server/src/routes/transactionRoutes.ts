import express from "express";
import { createStripePaymentIntent, createTransaction, listTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction)
// list transactions is get with route of "/"
router.get("/", listTransactions);
// router should be post, and the route is /stripe/payment-intent, and the controler is createStripePaymentIntent
router.post("/stripe/payment-intent", createStripePaymentIntent);


export default router;
