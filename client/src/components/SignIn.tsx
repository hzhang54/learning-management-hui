"use client"

import { SignIn, useUser } from "@clerk/nextjs";
import React from "react";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";

const SignInComponent = () => {

    // grab user information using useUser from clerk
    const { user } = useUser();
    // grab searchParams from the url
    const searchParams  = useSearchParams();  
    // also check via the url route if it is a check out page
    // it is determined whether we grab a url that says showSignup
    // because on signin page, the url is localhost:3000/signIn
    const isCheckoutPage = searchParams.get("showSignUp") !== null;
    // when we are on the checkout page, the url will have course id.  Here we use searchParams to get the id
    const courseId = searchParams.get("id");
    // When we are on the signIn page, the text button signUp will redirect to the signup url.
    // But if we are on the checkout page, the text button on the signin component will nto redirect use to 
    // the signup url.  Instead, it will turn the signin component on the checkout page into a signup component.
    // Now we get the signup url for the case when we are not on the checkout page by testing if we are on check out page first.

    // initialize signup URL to a template starting with /checkout?step=1&id=${courseId}&showSignUp=true, so that we know we are changing component to signup instead of signin
    const signUpURL = isCheckoutPage ? `/checkout?step=1&id=${courseId}&showSignUp=true` : `/signup`;

    // define getRedirectUrl as a function that looks at isCheckoutPage, and if true, returns the template string
    // that is similar to above, but with step=2, but without the show sign up portion
    // The returned result from this function will be passed to forceRedirectUrl prop of the SignIn component below.
    const getRedirectUrl = () => {
        if (isCheckoutPage) {
            return `/checkout?step=2&id=${courseId}`;
        }
        // otherwise, we will do difference routes depending on userType is a teacher or a student
        // first get the userType from user's publicMetadata.userType.  AI is slow here. Why it didn't have enough info?
        const userType = user?.publicMetadata?.userType as string;
        // return route /teacher/courses or /user/courses depending on the uderType
        if (userType === "teacher") {
            return "/teacher/courses";
        } 
        return "/user/courses";

    }


  return (
    // use SignIn from @clerk/nextjs
    // pass appearance prop to the SignIn component, use base theme of dark from @clerk/themes
    // pass in elements:{} to appearance, with formFieldLabel set to text-white-50 font-normal
    // rootBox style to flex justify-center items-center
    // cardBox: shadow-none
    // card: bg-customgreys-secondarybg w-full shadow-none
    // footer: {background is #25262F, padding 0rem, 2.5rem}
    // "& > div > div:nth-child(1)": {background: #25262F}
    // {/* set formButtonPrimary to bg-customgreys-700 !shadow-none */}
    // set formFieldInput to bg-customgreys-primary text-white-50 !shadow-none
    // set footerActionLink to text-primary-750 hover:text-primary-600
    // routing need to be set to hash and after signout, we got to landing page "/"
    <SignIn
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "shadow-none",
          card: "bg-customgreys-secondarybg w-full shadow-none",
          footer: {
            background: "#25262F",
            padding: "0rem 2.5rem",
            "& > div > div:nth-child(1)": {
              background: "#25262F",
            },
          },
          formFieldLabel: "text-white-50 font-normal",
          formButtonPrimary:
            "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
          formFieldInput: "bg-customgreys-primarybg text-white-50 !shadow-none",
          footerActionLink: "text-primary-750 hover:text-primary-600",
        },
      }}
      signUpUrl={signUpURL}
      forceRedirectUrl={getRedirectUrl()}
      routing="hash"
      afterSignOutUrl="/"
    />
  );
};

export default SignInComponent;
