import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

// pass in {currentStep} with type WizardStepperProps
const WizardStepper = ({ currentStep }: WizardStepperProps) => {
  // return a div with class name wizard-stepper
  // all the class names we used here start with wizard-stepper following by __ then by postfix
  // the div inside has class name ending with container
  // inside the contain, we map out [1,2,3] with step and index, and passing to React.Fragment component
  // with step as the key.  You can not pass the key with React.Fragment directly.
  // inside Fragment is a div with classname ending with circle, passed to cn()
  // within cn, we will have different conditions to determine the color and appearance of the wizard stepper
  // we use the wizard-stepper__circle--completed css if the currentStep > step, or (currentStep is 3 and step is 3)
  // we use the css ending with --current, if the current step is step and the step is not step 3.
  // we use the css ending with --upcoming, if current step is less than the actual step we are at
  return (
    <div className="wizard-stepper">
      <div className="wizard-stepper__container">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            {/* Add a div with class name ending with step */}
            <div className="wizard-stepper__step">
              <div
                className={cn("wizard-stepper__circle", {
                  "wizard-stepper__circle--completed":
                    currentStep > step || (currentStep === 3 && step === 3),
                  "wizard-stepper__circle--current":
                    currentStep === step && step !== 3,
                  "wizard-stepper__circle--upcoming": currentStep < step,
                })}
              >
                {currentStep > step || (currentStep === 3 && step === 3) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              {/* handle text part with a p tag with class ane ending with text
                if current step is greater or equal to step, use css ending with action
                if current step is less than step, use the css ending with inactive
                 */}
              <p
                className={cn("wizard-stepper__text", {
                  "wizard-stepper__text--action": currentStep >= step,
                  "wizard-stepper__text--inactive": currentStep < step,
                })}
              >
                {/* if step is 1, the text is "Details", 2: "Payment", 3: "Completion"*/}
                {step === 1 && "Details"}
                {step === 2 && "Payment"}
                {step === 3 && "Completion"}
              </p>
            </div>
            {/* if the process is completed, the line is green */}
            {index < 2 && (
              <div
                className={cn("wizard-stepper__line", {
                  "wizard-stepper__line--completed": currentStep > step,
                  "wizard-stepper__line--incomplete": currentStep <= step,
                })}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WizardStepper;
