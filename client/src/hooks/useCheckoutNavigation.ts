import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect } from 'react'

// it is not a react component, so we remove the return
export const useCheckoutNavigation = () => {
    // get router from useRouter from next/navigation
    const router = useRouter();
    // get search params from useSearchParams
    const searchParams = useSearchParams();
    // use useUser from clerk js to get isLoaded and user isSignedIn
    const { isLoaded, isSignedIn } = useUser();

    // grab the id from the url and save in courseId variable using searchParams, if none, assign empty string
    const courseId = searchParams.get('id') ?? "";
    // grab the step from the url and save in step variable using searchParams, if none, 
    // instantiate default to 1, and parseInt to make sure it is a number
    const checkoutStep = parseInt(searchParams.get("step") ?? "1", 10);

    // useCallback for the navitageToStep function, takes an argument step: number, and first
    // cap and floor the number between 1 and 3
    const navigateToStep = useCallback((step: number) => {
        const newStep = Math.min(Math.max(1, step), 3);
        // if user isSignedIn, then showSignUp is "true" in string form, otherwise, it is false in string
        const showSignUp = isSignedIn ? "true" : "false";
        // push the url using the values we have created like below:
        // `/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`
        router.push(
            `/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`, {
                scroll: false,
              }
        );
    }, [courseId, isSignedIn, router]);
    


    // set up useEffect, and check if use isloaded, and is signed in, and checkout step is greater than 1,
    // then we navigate to step 1.  This is because we don't want them to hit the payment details page, if they are not check in.
    useEffect(() => {
        if ( isLoaded && !isSignedIn && checkoutStep > 1) {
            // after making sure the user is signed in, we navigate to new route
            navigateToStep(1);
        }   
    }, [isLoaded, isSignedIn, checkoutStep, navigateToStep]);

    return { checkoutStep, navigateToStep };
  
}

