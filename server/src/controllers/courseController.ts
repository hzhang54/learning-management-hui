import type { Request, Response } from "express";
import Course from "../models/courseModel.js";
// import uuid for setting default value for the courses
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

// grab courses by category, use query string in http
export const listCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { category } = req.query;
  try {
    const courses =
      category && category !== "all"
        ? await Course.scan("category").eq(category).exec()
        : await Course.scan().exec();
    res.json({ message: "Courses retrieved successfully", data: courses });
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving courses", error });
  }
};

// get a single course, use param in http
export const getCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;

  if (!courseId) {
    res.status(400).json({ message: "Course ID is required" });
    return;
  }

  try {
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    res.json({ message: "Course retrieved successfully", data: course });
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving course", error });
  }
};

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // grab the teacherId and teacherName from the front end in the request body
    const { teacherId, teacherName } = req.body;
    // if techerId or teacher name doesn't exist, send to the frontend with the message Teacher Id and name are required
    // so that people can't log in unless they are the correct teacher

    if (!teacherId || !teacherName) {
      res.status(400).json({ message: "Teacher Id and name are required" });
      return;
    }

    // create a new Course with default values. Set courseId as uuid
    // we set teacher id and teacher name, with title set to Untitled Course,
    // with the description of an empty string.
    // category as Uncategorized.
    // image as an empty string, and price of 0.
    // with a level of beginner and status being Draft.  There is only Draft and Published for status.
    // sections and enrollments are both empty array.

    const newCourse = new Course({
      courseId: uuidv4(),
      teacherId,
      teacherName,
      title: "Untitled Course",
      description: "",
      category: "Uncategorized",
      image: "",
      price: 0,
      level: "Beginner",
      status: "Draft",
      sections: [],
      enrollments: [],
    });

    // save the newCourse
    await newCourse.save();

    // send back the newCourse to the front end and say Course created successfully
    res.json({ message: "Course created successfully", data: newCourse });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating course", error });
  }
};

export const updateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  // grab courseId from the front end from the param which is the more required values
  const { courseId } = req.params;
  // updateData is all the extra information that we are grabing from the body.
  const updateData = { ...req.body };
  // grab userid from clerk express using getAuth.  This for authentication.
  const { userId } = getAuth(req);

  if (!courseId) {
    res.status(400).json({ message: "Course ID is required" });
    return;
  }

  try {
    // get course using courseId.  This gets all the info from the backend just to be sure.
    const course = await Course.get(courseId);
    if (!course) {
      // if course does not exist, send message Course not found to the front end
      res.status(404).json({ message: "Course not found" });
      return;
    }
    // make sure the userId that is authenticated is the teacher
    // if not, say Not authorized to update this course
    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to update this course" });
      return;
    }

    // check if price in the update data exists.
    // first parseInt the price and save in a local variable
    // then check isNaN on the price, if not a number, send a message: Invalid price format to the frontend
    // and also send an error "Price must be a vlid number"
    if (updateData.price) {
      const price = parseInt(updateData.price);
      if (isNaN(price)) {
        res.status(400).json({
          message: "Invalid price format",
          error: "Price must be a valid number",
        });
        return;
      }
      // multiply the price by 100
      updateData.price = price * 100;
    }

    // check if sections in update data exist
    // if so, check if typeof sections is string, if so, we will parse it with jason parse, otherwise no need to parse it
    // store the sections into a local variable called sectionsData
    // sections in the data model has nested arrays and objects. Sections have chapters, chapter may have videos.
    if (updateData.sections) {
      const sectionsData =
        typeof updateData.sections === "string"
          ? JSON.parse(updateData.sections)
          : updateData.sections;
      // map out sectionData, with section of type any, spread out section, and pass in sectionId an uuid if it doesn't already exist.
      // and set this in the update data's sections
      updateData.sections = sectionsData.map((section: any) => ({
        ...section,
        sectionId: section.sectionId || uuidv4(),
        // update chapters by mapping out chapters and spread out each chapter and pass in chapterId an uuid if it doesn't exist already
        chapters: section.chapters.map((chapter: any) => ({
          ...chapter,
          chapterId: chapter.chapterId || uuidv4(),
        })),
      }));
    }

    // replicate the object by assign, grab the course, and pass in update data.
    Object.assign(course, updateData);

    // save the course
    await course.save();

    // send back the newCourse to the front end and say Course updated successfully
    res.json({ message: "Course updated successfully", data: course });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating course", error });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  // get courseId from params
  const { courseId } = req.params;
  // get userId from clerk nextjs getAuth
  const { userId } = getAuth(req);
  // validate courseId, make sure it exists, otherwise, return, saying it is required
  if (!courseId) {
    res.status(400).json({ message: "Course ID is required" });
    return;
  }

  try {
    // get course by courseId
    const course = await Course.get(courseId);
    // check if course does not exist, send message Course not found
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // check teacherId is the same as userId,
    // if not say Not authorized to delete this course
    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to delete this course" });
      return;
    }
    // delete course
    await Course.delete(courseId);

    // send back the newCourse to the front end and say Course created successfully
    res.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting course", error });
  }
};

// creating an end point to upload video to S3,
// so that when aws distribute throu cloud front, the content is available with little laterncy
export const getUploadVideoUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  // from body, grab filename and filetype from frontend
  const { fileName, fileType } = req.body;
  // make sure filenames and filetypes are validated.
  if (!fileName || !fileType) {
    res.status(400).json({ message: "File name and type are required" });
    return;
  }

  try {
    // create an unique id
    const uniqueId = uuidv4();
    //construct a s3 key to store the video
    const s3Key = `videos/${uniqueId}/${fileName}`;

    // the S#_BUCKET_NAME will be an environment variable on the deployment environment
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Key: s3Key,
      Expires: 60,
      ContentType: fileType,
    };
    // a presigned url for the s3, which allows uploading large object
    // because api gateway has a limit of 10 mb. This is a front end thing that the client get.
    const uploadUrl = s3.getSignedUrl("putObject", s3Params); 
    // construct a video usr. 
    const videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${fileName}`;
    // send both url to the front end. Save the video url in the db so we know the link to section and chapter
    // while upload url is for uploading.
    res.json({
      message: "Upload URL generated successfully",
      data: { uploadUrl, videoUrl },
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating upload URL", error });
  }
};
