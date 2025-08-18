"use client";

import Loading from "@/components/Loading";
import { useGetCoursesQuery } from "@/state/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCardSearch from "@/components/CourseCardSearch";
import SelectedCourse from "./SelectedCourse";

const Search = () => {
  // grab search params so we can grab it from the url
  // and use it to search for courses.  Use next to grab id value from the search params
  const searchParams = useSearchParams();
  // instead of using url in local state or redux, we can use next to grab the id value
  // from the search params because it is more reliable
  const id = searchParams.get("id");
  // grab courses list with useGetCoursesQuery, passing in empty object
  // to get all courses
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});

  // create a state called selectedCourse and set it to null
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // grab a router (from next/navigation) because we want to change the page when we click on a course
  // we have useRouter, so we need to use client.
  const router = useRouter();
  // if we have a course id and it is not null, we want to set that one as the selected course,
  // but if it doesn't exist, we want to set the first course as the selected course. Use useEffect to do this
  // Don't use useEffect too often because of the asynchronous issues, but no need to avoid it everywhere
  useEffect(() => {
    // if courses exist, and if id exist, grab the course by finding by the course id that we have
    // and set it as the selected course, otherwise set the first course as the selected course
    if (courses) {
      if (id) {
        const course = courses.find((c) => c.courseId === id);
        setSelectedCourse(course || courses[0]);
      } else {
        setSelectedCourse(courses[0]);
      }
    }
    // add dependencies so anytime courses, or id change
  }, [courses, id]);

  // if we are loading, return a Loading component
  if (isLoading) {
    return <Loading />;
  }
  // check for errors or no courses, if there is error return a div that says failed to fetch courses
  if (isError || !courses) {
    return <div>Failed to fetch courses</div>;
  }

  // handleCourseSelect  function, takes in a course and sets it as the selected course
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    // update the url with the course id
    router.push(`/search?id=${course.courseId}`);
  };

  // create a handleEnrollNow function, takes in a courseId, 
  // and push a route like /checkout?step-1&id=courseid
  // 2:41:40
  const handleEnrollNow = (courseId: string) => {
    router.push(`/checkout?step-1&id=${courseId}&showSignUp=false`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search"
    >
      <h1 className="search__title">List of available courses</h1>
      <h2 className="search__subtitle"> {courses.length} courses available</h2>
      <div className="search__content">
        {/*  create a div for search content, following the same structure 
            as the motion.div  in the course landing page
        */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="search__courses-grid"
        >
          {/* map through courses and create a course card for each course */}
          {/*  pass in the selected course and the handleCourseSelect function
           */}
          {courses.map((course) => (
            <CourseCardSearch
              key={course.courseId}
              course={course}
              isSelected={selectedCourse?.courseId === course.courseId}
              onClick={() => handleCourseSelect(course)}
            />
          ))}
        </motion.div>
        {/*
            if selectedCourse exists, create a motion.div similar t the previous one,
            but with a delay of 0.5, and change the class name to search__selected-course.
            Use a SelectedCourse card, passing in selectedCourse, and handleEnrollNow function.
        */}
        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="search__selected-course"
          >
            <SelectedCourse
              course={selectedCourse}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
