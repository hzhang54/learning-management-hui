import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

// pass in course.section as argument and use the type defined for the prop type.
const AccordionSections = ({ sections }: AccordionSectionsProps) => {
  return (
    // return an Accordion component with type multiple, class name w-full
    // inside the Accordion, map through the sections array and return an AccordionItem component
    // for each section, with the value of the section as the key and the section title as value
    // and class name accordion-section,
    // followed by an accordionTrigger with classname ending with trigger. Inside trigger is a h5, with
    // className ending with title.
    <Accordion type="multiple" className="w-full">
      {sections.map((section) => (
        <AccordionItem
          key={section.sectionId}
          value={section.sectionTitle}
          className="accordion-section"
        >
            {/* this is what appear before accordion is triggered */}
          <AccordionTrigger className="accordion-section__trigger">
            <h5 className="accordion-section__title">{section.sectionTitle}</h5>
          </AccordionTrigger>
          {/* Add accordion content to show what will happen when you open it 
          The class name is accordion-section__content,  and inside it is a ul, with section.chapters mapped out
          into li, with the chapter Id as key, and class name ending in chapter, and inside it is a FileText component
          with class name mr-2 w-4 h-4. Followed by a span for chapter.title, in the class name text-sm
          */}
          <AccordionContent className="accordion-section__content">
            <ul>
              {section.chapters.map((chapter) => (
                <li key={chapter.chapterId} className="accordion-section__chapter">
                  <FileText className="mr-2 w-4 h-4" />
                  <span className="text-sm">{chapter.title}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionSections;
