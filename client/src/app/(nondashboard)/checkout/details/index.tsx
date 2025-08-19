import CoursePreview from "@/components/CoursePreview";
import Loading from "@/components/Loading";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useGetCourseQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";
import React from "react";
import { GuestFormData, guestSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpComponent from "@/components/SignUp";
import SignInComponent from "@/components/SignIn";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomFormField } from "@/components/CustomFormField";

const CheckoutDetailsPage = () => {
  // THE FOLLOWING HAVE BEEN FACTORED OUT TO HOOKS/USECURRENTCOURSE.ts, because it will be reused
  // get an instance of searchparams with useSearchParams()
  //const searchParams = useSearchParams();
  // grab courseId by get id, and default to ""
  //const courseId = searchParams.get("id") ?? "";
  // pass courseId into the hook useGetCourseQuery to get data: course
  //const { data: course } = useGetCourseQuery(courseId);

  const { course: selectedCourse, isLoading, isError } = useCurrentCourse();

  const searchParams = useSearchParams();
  // use searchParams to decide if showSignUp is "true"
  const showSignUp = searchParams.get("showSignUp") === "true";

  const methods = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      email: "",
    },
  });

  // if isLoading is true, return Loading component
  if (isLoading) return <Loading />;
  // if isError is true, return Error component
  if (isError) return <div>Failed to fetch course data</div>;
  // if no selectCourse, return a div saying "Course not found"
  if (!selectedCourse) return <div>Course not found</div>;

  // fill in checkout details below using a div with class name checkout-details.  The rest of the class anmes
  // all starts with checkout-details followed by __ followed bu ending
  // inside, we have a div with class name ending with container.
  // inside, we have a div with class name ending with preview
  // inside is a CoursePreview component, with course props passed in as selectedCourse
  return (
    <div className="checkout-details">
      <div className="checkout-details__container">
        <div className="checkout-details__preview">
          <CoursePreview course={selectedCourse} />
        </div>
        {/* STRETCH FEATURE */}
        <div className="checkout-details__options">
          <div className="checkout-details__guest">
            <h2 className="checkout-details__title">Guest Checkout</h2>
            <p className="checkout-details__subtitle">
              Enter email to receive course access details and order
              confirmation. You can create an account after purchase.
            </p>
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit((data) => {
                  console.log(data);
                })}
                className="checkout-details__form"
              >
                <CustomFormField
                  name="email"
                  label="Email address"
                  type="email"
                  className="w-full rounded mt-4"
                  labelClassName="font-normal text-white-50"
                  inputClassName="py-3"
                />
                <Button type="submit" className="checkout-details__submit">
                  Continue as Guest
                </Button>
              </form>
            </Form>
          </div>

          <div className="checkout-details__divider">
            <hr className="checkout-details__divider-line" />
            <span className="checkout-details__divider-text">Or</span>
            <hr className="checkout-details__divider-line" />
          </div>

          <div className="checkout-details__auth">
            {showSignUp ? <SignUpComponent /> : <SignInComponent />}
          </div>
        </div>


      </div>
    </div>
  );
};

export default CheckoutDetailsPage;
