import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// create a is student route const by passing an array into create route matcher
// this is everything in the /user directory
// do the same for is teacher route, that has /teacher/ as part of the url
const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

// we will store the user role, whether he is a student or teacher
// in the metadata of the session.  So, inside clerk middle ware,
// get a session claims from auth,and get user rule from session. 
// the user type will be either student or teacher, with student being the default
export default clerkMiddleware( async (auth, req) => {
  // wait on auth() to return a session claim
  const { sessionClaims } = await auth();
  // get the user role from the session claims, cast as userType student or teacher,
  // with default as "student"
  const userRole = 
    (sessionClaims?.metadata as { userType: "student" | "teacher" })
      ?.userType || "student";

  // check if the req is a student route, if the user role is not student, 
  // construct a url as a new URL /teacher/courses, and return a redirect to that url
  if (isStudentRoute(req))  {
    if (userRole !== "student") {
      const url = new URL("/teacher/courses", req.url);
      return NextResponse.redirect(url);
    }
  }

  // check if the req is a teacher route, if the user role is not teacher,
  // construct a url as a new URL /user/courses, and return a redirect to that url
  if (isTeacherRoute(req))  {
    if (userRole !== "teacher") {
      const url = new URL("/user/courses", req.url);
      return NextResponse.redirect(url);
    }
  }
})


//export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};