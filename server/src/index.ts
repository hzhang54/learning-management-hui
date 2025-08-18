import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dynamoose from "dynamoose";

/* ROUTE IMPORTS */
import courseRoutes from "./routes/courseRoutes.js";
import { createClerkClient } from "@clerk/express";
import userClerkRoutes from "./routes/userClerkRoutes.js";

/* CONFIGURATIONS */

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// all we need to do to set up local dynamo db
if (!isProduction) {
  dynamoose.aws.ddb.local("http://localhost:8001");
}

// instantiate clerk client when the server starts using createClerkClient from @clerk/express.
// we pass in secret key from env.  This is how we connect to clerk from express server
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is required");
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/courses", courseRoutes);
// /users/clerk for userClerkRoutes
app.use("/users/clerk", userClerkRoutes);


/* SERVER */

const PORT = process.env.PORT || 3000;

if (!isProduction) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
