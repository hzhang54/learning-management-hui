import { formatPrice } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import AccordionSections from "@/components/AccordionSections";

// pass in course, with prop type as CoursePreviewProps
const CoursePreview = ({ course }: CoursePreviewProps) => {
  // use util formatPrice to format course.price and save in variable price
  const price = formatPrice(course.price);
  // the first div use a className of course-preview.  The rest of the classname inside all start with course-preview
  // the followed by __, followed by ending
  // inside is another div with classname ending with container
  // inside is another div with classname ending with image-wrapper
  // inside is an Image with src from course.image, with /course-preview-placeholder.png as placeholder
  // alt is Course Preview
  // width 640, height 360, class name is w-full
  return (
    <div className="course-preview">
      <div className="course-previous__container">
        <div className="course-preview__image-wrapper">
          <Image
            src={course.image || "/course-preview-placeholder.png"}
            alt="Course Preview"
            width={640}
            height={360}
            className="w-full"
          />
        </div>
        <div>
          {/* an h2 with class name ending in title, with course.title as text
            followed by a p tag with class name text-gray-400 text-md mb-4 with text by course.teacherName
            followed by a p tag with class name text-sm text-customgreys-dirtyGrey with text by course.description
            */}
          <h2 className="course-preview__title">{course.title}</h2>
          <p className="text-gray-400 text-md mb-4">by {course.teacherName}</p>
          <p className="text-sm text-customgreys-dirtyGrey">
            {course.description}
          </p>
        </div>
        <div>
          <h4 className="text-white-50/90 font-semibold mb-2">
            Course Content
          </h4>
          <AccordionSections sections={course.sections} />
        </div>
      </div>

      <div className="course-preview__container">
        <h3 className="text-xl mb-4">Price Details (1 item)</h3>
        <div className="flex justify-between mb-4 text-customgreys-dirtyGrey text-base">
          <span className="font-bold">1x {course.title}</span>
          <span className="font-bold">{price}</span>
        </div>
        <div className="flex justify-between border-t border-customgreys-dirtyGrey pt-4">
          <span className="font-bold text-lg">Total Amount</span>
          <span className="font-bold text-lg">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
