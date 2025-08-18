import express from "express";
// import updateUser from userClerkController
import { updateUser } from "../controllers/userClerkController.js";

const router = express.Router();
// create router for update user info
router.put("/:userId", updateUser);


export default router;
