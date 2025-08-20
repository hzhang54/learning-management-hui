import React from "react";
import StripeProvider from "./StripeProvider";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useClerk, useUser } from "@clerk/nextjs";
import CoursePreview from "@/components/CoursePreview";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTransactionMutation } from "@/state/api";
import { toast } from "sonner";

const PaymentPageContent = () => {
  // how stripe provide is wraping the children, we can access the stripe and elements from parent.
  // get stripe from useStrike
  const stripe = useStripe();
  // get elements from useElements
  const elements = useElements();
  const [ createTransaction ] = useCreateTransactionMutation();

  // grab navigateToStep from useCheckoutNavigation hook
  const { navigateToStep } = useCheckoutNavigation();

  // grab course and courseId from the hook useCurrentCours
  const { course, courseId } = useCurrentCourse();

  // get user with useUser from clerk next js
  const { user } = useUser();
  // get signOut from useClerk. This is for the switch account button on this page.
  // If you hit that, it will sign you out
  const { signOut } = useClerk();

  // handle submit payment info function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if stripe doesn't exist, or elements don't exist,
    // tell toast an error "Stripe service is not available"
    if (!stripe || !elements) {
      toast.error("Stripe service is not available");
      return;
    }

    // await stripe.confirmPayment and save result into const result,
    // passing in elements, with confirm params set to return_url, which is the url in the env file
    // followed by id = course id
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL}?id=${courseId}`,
      },
      redirect: "if_required",
    });

    // if result.paymentIntent's status is succeeded
    // we can create the transaction data we need to send to the backend
    if (result.paymentIntent?.status === "succeeded") {
        // with transaction id coming from result.paymentIntent.id, so id is from stripe,
        // and we can use the id to grab payment info from stripe.  So our transaction table
        // has connection to stripe.  User id is from clerk, course id is from courseId, paymentProvider is only stripe
        // amount is course's price
        const transactionData: Partial<Transaction> = {
            transactionId: result.paymentIntent.id,
            userId: user?.id,
            courseId: courseId,
            paymentProvider: "stripe",
            amount: course?.price || 0,
          };

          await createTransaction(transactionData);
        // after transaction is complete, we redirect to step 3
        navigateToStep(3);

    }
  };

  // for the switch account button, we signout using clerk
    const handleSignOutAndNavigate = async () => {
        await signOut();
        navigateToStep(1);
      };

  // if there is no course, return null
  if (!course) return null;
  // the outer div has className payment, the rest have className of the form payment__ followed by an ending
  // inside is a div with class name ending with container
  return (
    <div className="payment">
      <div className="payment__container">
        {/* Order Summary, which is a preview by bring in CoursePreview component*/}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>
        {/* Pyament Form */}
        <div className="payment__form-container">
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="payment__form"
          >
            <div className="payment__content">
              <h1 className="payment__title">Checkout</h1>
              <p className="payment__subtitle">
                Fill out the payment details below to complete your purchase.
              </p>

              <div className="payment__method">
                <h3 className="payment__method-title">Payment Method</h3>

                <div className="payment__card-container">
                  <div className="payment__card-header">
                    <CreditCard size={24} />
                    <span>Credit/Debit Card</span>
                  </div>
                  <div className="payment__card-element">
                    <PaymentElement />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>
        {/* disable this button if no stripe or element*/}
        <Button
          form="payment-form"
          type="submit"
          className="payment__submit"
          disabled={!stripe || !elements}
        >
          Pay with Credit Card
        </Button>
      </div>
    </div>
  );
};

// create a component called PaymentPage and wrap a StripeProvider component around PaymentPageContent
const PaymentPage = () => (
  <StripeProvider>
    <PaymentPageContent />
  </StripeProvider>
);

export default PaymentPage;
