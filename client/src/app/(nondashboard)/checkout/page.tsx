"use client"

import Loading from "@/components/Loading";
import WizardStepper from "@/components/WizardStepper";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useUser } from "@clerk/nextjs";
import React from "react";
import CheckoutDetailsPage from "./details";
import PaymentPage from "./payment";
import CompletionPage from "./completion";


const CheckoutWizard = () => {
  // use useUser from clerk nextjs to check if use isLoaded
  const { isLoaded } = useUser();
  // we will create a separate hook in the hooks folder to keep track of the checkout step
  const { checkoutStep } = useCheckoutNavigation();

  // if not loaded, return loading
  if (!isLoaded) {
    return <Loading />;
  }

  // Create a renderStep function that determine the step we are on in the check out process.
  // There are three steps.  The first step is checkout details page, the second is the payment page,
  // and the third is the completion page.
  const renderStep = () => {
    //We determine the checkoutStep we are on by looking at the pages
    // switch based on checkoutStep, determining routing and navigation for the three pages. 5:22:31
    switch (checkoutStep) {
      case 1:
        return <CheckoutDetailsPage />;
      case 2:
        return <PaymentPage />;
      case 3:
        return <CompletionPage />;
      default:
        return <CheckoutDetailsPage />;
    }
  };
  // set up jsx, return a div with class name "checkout", inside is a div with class name checkout__content
  return (
    <div className="checkout">
      {/* Here we have the stepper component with detail, payment and completion stages, 
        while the renderStep represent those page content under it which is dependent 
        on the page we are at*/}
      <WizardStepper currentStep={checkoutStep} />
      <div className="checkout__content"> {renderStep()} </div>
    </div>
  );
};

export default CheckoutWizard;
