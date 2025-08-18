import AccordionSections from "@/components/AccordionSections";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import React from "react";

// this is the course info side box on the search page located in the same directory
// SelectedCourse component take course, and handleEnrollNow.  The type was already defined as SelectedCourseProps.
// it returns a div with class name selected-course.
// inside is another div, with an h3 with class name selected-course__title for course.title
// Then add a p tag for autor with class name selected-course__author. with text By followed by course.teacherName
// inside the p tag also add a | and space, with a span that shows the enrollment-count which is the
// course?.enrollments?.length

// below this div, is another div with classname ending with __content.
// Show course.description in a p tag in this div
// following the p tag is a div with class name ending with sections.  Within this div is a 
// h4 with class name for sections-title, with text Course Content.
// below the sections title, create a section with accordions from a separate component.

// below this div is another div with classname ending with footer. Within the div is a span that 
// show the price with classname ending with price.
// below the use a chadcn Button component. the onClick is the handle Enroll now function with courseId passed in
// the classname for the Button is bg-primary-700, hover:bg-primary-600.  The text on the button is Enroll Now.
const SelectedCourse = ({ course, handleEnrollNow }: SelectedCourseProps) => {
  return (
    <div className="selected-course">
      <div>
        <h3 className="selected-course__title">{course.title}</h3>
        <p className="selected-course__author">
          By {course.teacherName} |{" "}
          <span className="selected-course__enrollment-count">
            {course?.enrollments?.length}
          </span>
        </p>
      </div>
      <div className="selected-course__content">
        <p className="selected-course__description">{course.description}</p>

        <div className="selected-course__sections">
          <h4 className="selected-course__sections-title">Course Content</h4>
            {/* ACCORDION SECTIONS: it will be a reusable component that takes sections argument which is course.sections 
            */}
            <AccordionSections sections={course.sections} />
        </div>  

        <div className="selected-course__footer">
            <span className="selected-course__price">
              {formatPrice(course.price)}
            </span>
            <Button
              className="bg-primary-700 hover:bg-primary-600"
              onClick={() => handleEnrollNow(course.courseId)}
            >
              Enroll Now
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedCourse;
