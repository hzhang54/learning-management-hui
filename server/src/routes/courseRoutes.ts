import express from "express";
import { getCourse, listCourses } from "../controllers/courseController.js";

const router = express.Router();

router.get("/", listCourses);
router.get("/:courseId", getCourse);

export default router;
