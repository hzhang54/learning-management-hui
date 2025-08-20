import Stripe from "stripe";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import Course from "../models/courseModel.js";
import Transaction from "../models/transactionModel.js";
import UserCourseProgress from "../models/userCourseProgressModel.js";

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

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  // grab info from front end
  const { userId, courseId, transactionId, amount, paymentProvider } = req.body;

  try {
    // 1. get course info
    //   We use course info to update course.  First we make sure the course exists, and
    // so we can connect to our transaction.
    const course = await Course.get(courseId);

    // 2. create transaction record
    // new Transaction from transaction model, include all props, such as dateTime, userId, courseId, transactionId, amount, and paymentProvider
    const NewTransaction = new Transaction({
      dateTime: new Date().toISOString(),
      userId,
      courseId,
      transactionId,
      amount,
      paymentProvider,
    });
    // also save the transaction to database
    await NewTransaction.save();

    // 3. create initial course progress
    // also need to create user's progress. new a usercourseprogress from data model, passing in object
    // consisting of user id, course id, and enrollment date, with overall progress of zero,
    // as well as sections, that is sections in the course mapped out to section id, chapters, which is section.chapters
    // mapped out to chapter id and completed set to 0

    const initialProgress = new UserCourseProgress({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0,
      sections: course.sections.map((section: any) => ({
        sectionId: section.sectionId,
        chapters: section.chapters.map((chapter: any) => ({
          chapterId: chapter.chapterId,
          completed: false,
        })),
      })),
      lastAccessedTimestamp: new Date().toISOString(),
    });
    await initialProgress.save();

    // add the enrollment to the course by updating the course, by passing in course id and enrollments with userid
    // 4. add enrollment to relevant course
    await Course.update(
      { courseId },
      {
        $ADD: {
          enrollments: [{ userId }],
        },
      }
    );

    // keep the message blank to prevent front end from seeing the message.
    // in the data we include transaction and courseProgress
    res.json({
      message: "Purchase Course successfully",
      data: {
        transaction: NewTransaction,
        courseProgress: initialProgress,
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating transaction and enrollment", error });
  }
};

export const listTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  // grab the userId passed as query string
  const { userId } = req.query;

  try {
    // define a transaction by passing userId to a Transaction.query, filter by userId and exec it
    // it allows us to grab the entire transaction list if we don't have an userid
    // or grab just that user. In most case we just need the userId, but it is a multi-function endpoint

    const transactions = userId
      ? await Transaction.query("userId").eq(userId).exec()
      : await Transaction.scan().exec();

    // keep the message blank to prevent front end from seeing the message.
    res.json({
      message: "Transactions retrieved successfully",
      // data is not object, it's just the transactions
      data: transactions,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving transactions", error });
  }
};

export default stripe;
