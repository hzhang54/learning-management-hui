import express from "express";
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse, getUploadVideoUrl, } from "../controllers/courseController.js";
import { requireAuth } from "@clerk/express";
import multer from "multer";


const router = express.Router();
// use multer to temporarily store files and images until we are ready to upload to aws
const upload = multer( { storage: multer.memoryStorage() })
router.get("/", listCourses);
// a post route for createCourse, requireAuth
router.post("/", requireAuth(), createCourse);
// a put route for updateCourse, requireAuth, upload a single image
router.put("/:courseId", requireAuth(), upload.single("image"), updateCourse);
// route for deleting course
router.delete("/:courseId", requireAuth(), deleteCourse);
// route for getting a single course
router.get("/:courseId", getCourse);


router.post(
    "/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url",
    requireAuth(),
    getUploadVideoUrl
  );

export default router;
