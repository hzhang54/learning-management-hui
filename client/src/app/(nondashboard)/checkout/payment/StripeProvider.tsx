import React, { useEffect, useState } from "react";

import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useCreateStripePaymentIntentMutation } from "@/state/api";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import Loading from "@/components/Loading";
import { Elements } from "@stripe/react-stripe-js";

// check if stripe public key is available from the environment
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

// define const stripePromise by calling loadStripe with Stripe public key from the env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// define apperance of the type Appearance
const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#0570de",
    colorBackground: "#18181b",
    colorText: "#d2d2d2",
    colorDanger: "#df1b41",
    colorTextPlaceholder: "#6e6e6e",
    fontFamily: "Inter, system-ui, sans-serif",
    spacingUnit: "3px",
    borderRadius: "10px",
    fontSizeBase: "14px",
  },
};

// pass in {children} with react.reactnode type
// and use State with type string or "" to get clientSecret
const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  const [clientSecret, setClientSecret] = useState<string | "">("");
  // use the api to get createStripePaymentIntent
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();
  // use useCurrentCourse hook to get course
  const { course } = useCurrentCourse();

  // have useEffect to first check if no course exist, then return
  // then define fetchPaymentIntent as async function, within it, define const result
  // that await createStripePaymentIntent, passing in amount from course?.price, if doesn't exist give it a large number.
  // then set client secret, and call fetchPaymentIntent function
  useEffect(() => {
    if (!course) return;
    const fetchPaymentIntent = async () => {
      const result = await createStripePaymentIntent({
        amount: course?.price ?? 9999999999999,
      }).unwrap();
      setClientSecret(result.clientSecret);
    };
    fetchPaymentIntent();
  }, [createStripePaymentIntent, course?.price, course]);

  // define options of the type StripeElementsOptions, passing in clientSecrete and appearance
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  //if clientecrete doesn't exist, return loading component
  if (!clientSecret) return <Loading />
  //return Element, passing stripePromise and options.  Wrap Element around children.

  return (
    
      <Elements stripe={stripePromise} options={options} key={clientSecret}>
        {children}
      </Elements>
  );
};

export default StripeProvider;
