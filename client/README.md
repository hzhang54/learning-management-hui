This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Application Description

Create a providers.tsx in the app directory that inputs StoreProvider from state/redux, which includes everything we need to create our Redux store. This is the place where we want to keep all the providers that we want to put on the global state for our nextjs application. We enclose children with StoreProvider tag within the function that we export from Providers. We just need to enclose the children in a pair of Providers tag in the layout.tsx under app directory. This is all we need to do to set up redux.

The next public api base url is then added to local env file

Use block element modifier defined classes in globals.css for styling and construct the landing page in src/app/page.tsx that load the ui component NonDashboardNavbar.tsx which has a link to the home page "/" and a link to a /search route.

In Page.tsx, below the nondashboard-navbar section, we have the main part of the landing page, with a button to search for courses, and the featurd courses pop up below.

For this main part, we will create a landing component, which uses animation.
There is a button for search for courses, and a image curasel. The carousel is created by adding a hook in the hooks folder.

The courses to be display are coming from the backend. We will create api point to fetch that data.

ALso add a footer component for copy right imported from te Footer components in the components directory.

For data model, the course has nested objects such as section, chapters and comments. Section groups chapters together, and chapters has the video URL stored.

Transaction and user course progress schemas are per user. When we grab course object, we get everything from API that is relevant to the course. But we don't grab the user related info such as user course progress.

The backend db will be hosted in dynamoDB.

The backend will live in a folder called server. We will set up package.json with npm command and install aws dynamodb, body-parser, express, cors, dotenv, helmet, morgan, dynamoose, uuid packages, as well as dev dependencies such as rimraf, concurrently, nodemon, ts-node, typescript, types related to the packages.

Start an index.ts to listen on a port specified in .env

Update the package.json and specify build scripts with rimraf, as well as other commonly used scripts.

Before future development, run typescript init to set us tsconfig.json.

setup data model schema in the src/models directory.

Once we get the server running and tested with curl or postman, create a controller directory and define the backend apis. Then create route folder and have all of them route to index page.

Create two controllers to get course by category and get single course by id. category is passed in by query, and id is passed in by params.

Create routes by creating a new file in src/routes/courseRoutes.ts. Create two express.Router() for / and /:courseId and export the router.

Then in the index.ts file, add the entry point for this category of routes as these routes are specifically for courses.

These will be app.use ("/courses",...) as we list courses by curl http://localhost:8002/courses

The tables can be seeded by runing npm run seed, and the function is in seedDynamodb.ts

Now with the data seeded, we can go to nosql benchmark and add a connection in DynamoDB local.

We can test with curl or postman the end points we have set up.

Now we go to front end src directory and call backend in src/state/api.ts's api.endpoints

We also add query for courses, as well single course by id. For single course, we add providesTags: (result, error, id) => [{ type: "Courses", id }], as a way to invalidate the course, this is similar to react.

Then go to landing page src/app/(nondashboard)/landing/page.tsx to make the api call-- useGetCoursesQuery({});

In api.ts under state, define a base query and do await baseQuery here and directly get result.data, applicable to all end points. This is a good feature of redux toolkit query.

In redux, we query from state/api.ts. It makes query to both front end and backend, which sometimes might has some performance loss. We do not attempt to improve performance for now.

Now we go down to src/app/(nondashboard)/landing/page.tsx and display courses in the div for courses.

We show a slice of first 4 courses in a motion.div.

Add a CourseCardSearch.tsx in components directory. The SearchCourseCardProps is already defined in types.

AI should generate the next.config.ts that take care of getting images from external websites without instruction upon showing the error messages.

in the app/layout.tsx, add a root-layout class name that will be applicable to the entire app.

add a app/(nondashboard)/layout.tsx that will be applied to every nondashboard page. This will be applicable to app/(nondashboard)/search folder that we will create. This layout is to mimic app/component/ui/NonDashboardNavbar.tsx, so we can copy over app/page.tsx to start with. Unlike with home, we will pass in a children.

We want to be able to click on a course and pass the course id to the backend and show both a list of available course as well as the detailed info on the content selected course using an accordion ui component. All the info for the course content such as chapters and sections and prices are coming from the backend. And on the selected course box, we want to show the title, the authors, the number of enrollment, the price, as well as a button that says "enroll now". These will be implemented in app/(nondashboard)/search/page.tsx starting from rafce snipet.

Create a Loading spiner in app/component/Loading.tsx to be used for all loading situation. Start with rafce snipet. Use loader2 from lucidreact.

Create SelectedCourse.tsx in the same directory as app/(nondashboard)/search/page.tsx because it will not be reused. This implement the selected course box with button "enroll now" we talked about above. Again, start with rafce snipet.

create a AccordionSections.tsx to be a reusable component in src/components starting with rafce snipet.

Follow clerk's AI prompt and the AI agent will set you the clerk sign in/sign up on your layout.tsx

Middleware is used to protect certain pages, while other pages don't need protection as users can just browse the courses without having to sign in. There are also pages that are only accessible to teachers, and pages accessible by students. We need to differentiate them. This is what the middleware file is for.

We have not created user roles yet. Before that, we will create signin, singup, user button and user profile components. Since we will use the signin component etc in several different place, we create SignIn.tsx in components folder, starting with rafce snipet.

create app/(auth)/signin/[[...signin]]/page.tsx for the clerk identification component one get when one signout. It simply export function Page() that returns the SignInComponent defined above in SignIn.tsx.
We can see this page at localhost:3000/signin (after we sign ourself out)

To style this page, we create a new layout.tsx in the (auth) folder. Starting with rafce. When we style by wrapping <main> component around children.

Also create a SignUp.tsx in component directory, starting with SignIn and replace all SignIn with SignUp.

create app/(auth)/signup/[[...signup]]/page.tsx, copy over page.tsx from signin, and change to sign up.
We can now see it at localhost:3000/signup.

The authentication flow is the following: in the navbar, we have login and signup. They will take us to the signin and signup pages we have created. And the signin and signup text buttons on signup and signin pages will take us to the signin and signup pages respectively. We will need to configure that.

Also, later in our checkout, we will need to handle the authentication flow. We will ignore the guest checkout, and make sure the user will sign in or sign up before they can go to the payment page. After they sign in, we take them to the payment page.

Also when we click on the user's image button and go to manage account and they can configure the settings for their user profile. But they can also sign out here. When they click signout, it will transfer them to the landing page.

So there are a few route set up in these components.

Since signin component appear in the signin page and also in the checkout page, they will be redirected to different places based on if the user is signed in already or if they sign in at the sign in page or at check out.

Rewire the SignIn.tsx component and since we are looking at the url to determine if we are on the checkout page or not, we need to turn in into a client component with use client.

We also need to specify which url the user is being redirected to after he/she signin/ signup.

SignUp.tsx is similar. We copy over those functions to get user type and searchParams.

Now go back to app/(nondashboard)/landing/page.tsx and we can see the details about user information in chrome console

Add a sign in button in the src/component/NonDashboardNavbar.tsx, this gives the logged in user a button that they can manage profile or signout. We will style it using props of UserButton from clerk nextjs.

we will style this user button to dark mode, and give it the url for looking at user profile according to its role that we grab from useUser in clerk nextjs. To do this, we have to turn the NonDashboardNavBar.tsx to use client.

3:35:39 Now we set the user types or roles. User metadata in web portal of clerk is a way for us to administrate the user. It keeps user info on clerk itself, not in our db. We could put it in our db, but that would be more complex. We could create another type of user like admin, but it would be out of scope. For paid account (not development accout), you would be able to use organization feature.

The current design, put settings of userType in public Metadata, with value of object "user" | "teacher"

Now in src/components/NondashboardNavbar.tsx, we can console log the userRole and see if we added
{"userType": "student"} in the public metadata in the user console in clerk web interface, what we get out in the front end.

Next we use clerk component to add a user profile page.

We put all the pages behind authentication in (dashboard), this includes all the user pages and teacher pages (they both have the profile component), while those in front of authentication in (nondashboard).

For the user and teacher, We create two corresponding folder under (dashboard). Under each create profile/[[...profile]]/page.tsx
We need to do this anytime we use clerk component.

starting with rafce and call it UserProfilePage. It return a header component within an empty <> for the text in the profile page. This header will be reused, so it's under components/Header.tsx

Starting again with rafce, and follow the comments.

To see the results, look at localhost:3000/user/profile. We can see this when we are logged. It's fully interactive.

We do the same thing for teacher, by copying and pasting all the profile folder under user.

{{
=================================
\*\* kiro convo

why is the search area under    <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      transition={{ duration: 0.5 }}

      className="search"

    > not dark background like other components?

=================================

but now the text color in the search area is still dark, making it hard to read against the new dark background. How to fix that?
}}


Next add a side bar that contains link to the profile page and other administrative stuff. To do this, we crate a layout.tsx under (dashboard), which will apply to all the pages in our dashboard.

Use the nondashboard layout component as a starting point.
The main component will be a Navbar in component directory that we will create shortly. 

Create AppSidebar.tsx in components
Also create Navbar.tsx there, copying over nondashboardnavbar as basis.

Next we look at user setting page.  These user setting will store information in the clerk user setting.
Things like course notification, email alers, sms alerts etc. To do that, we need to create an endpoint.
4:15:57

Start by going to server, and create a new file in src/controllers/userClerkController.ts
Use getCourse () in the courseController.ts as template. 
But instead of getCourse

To receive info from clerk, we need a clerk client.  Go to server/src/index.ts it will be called updateUser as it is for the end point to update user setting.

instantiate clerk client when the server starts using createClerkClient from @clerk/express.
we pass in secret key from env.  This is how we connect to clerk from express server. For that we need  to install @clerk/express in the server directory

We will use the clerk client from index.ts in userClerkController.ts 

Here we have copied the clerk secret key from client side .env.local to server side .env

Finally, we need to set up routes for the end point.  creates src/routes/userClerkRoutes.ts
Copy over courseRoutes.ts as an example. Finally add the app.use in the route section of index.ts 

Now we got to front end src/state/api.ts to add the endpont. This will be a build.mutation(because the method is put), and we pass in userId, and url is `users/clerk/${userId}`, we will invalidate tag "Users" so that it will be refetched after update. And the const to be exported is useUpdateUserMutation.

To use this end point, create src/app/(dashboard)/user/settings, which is the url from the front end.
Create page.tsx, start with rafce and change to UserSettings.  

put a SharedNotificationSettings component inside the div, because it is the same as the teacher.

Then go to component page and create a new  SharedNotificationSettings component

Finally make SharedNotificationSettings.tsx use client.

Now we need to create the form.
in components/CustomFormField.tsx we have premade form fields for chadcn.

We need to install a bunch of things:
npm i react-filepond filepond-plugin-image-preview filepond-plugin-image-exif-orientation filepond 

Now we need to copy the (dashboard)/user/settings/page.tsx to teacher.

Currently one can directly hit the backend, to list courses, get course.  We want to have backend secured with authentication. Especially they can access clerk user info and change user accout without authentication at the end points.

4:44:32
For now, we will just secure the update user.

In server/src/index.ts, Following app.use(clerkMiddleware), requireAuth() in app.use("route") prevent  updating user settings
how can we authentical?  redux toolkit allow authetication every api call.

in src/state/api.ts customBaseQuery, add a prepareHeaders in the fetchBaseQuery prop.
setting headers to `Bearer ${token}` to authenticate API is very common. Even Cognito does this. 

Also on the backend, we need to change the .env publishable key to CLERK_PUBLISHABLE_KEY.  This is different from the front end.

When we update user setting, we as developers can see response from console, but user don't see any feedback.  We want to add things like chadcn Toast notifications. But recomment Sonner instead of Toast.
Sonner is good for multiple notification.

Redux tool kit do this easily.  We start by going to layout.tsx under src/app/root-layout and pass in toaster and import toaster from sonner.

Then we go to backend and got to client/state/api.ts customBaseQuery to configure this.
We don't want to get messages when we list courses etc.  We only want notification when we update a user or delete a user, and its easier to do this from backend and directly connect error message to toast in api.ts.  Then if it is a mutation request, we can pass the success message to toast.

## The start of the checkout page ##

When the user signup and hit continue, the checkout flow take it to a stripe page to get credit card and billing information. Once they hit pay with credit card, it will do multiple things.  

First if everything goes successfully, it takes them to the completed page. But also it will create multiple things. It creates a stripe payment and goes directly to stripe to handle transaction.  It also creates transaction records, so that the user can fetch later. This is in our transaction database. This will later be used on our payment history page where it shows the amount and payment method.

It also add the user enrollment to the course. 

It also adds progress data for the initial enrollment. It plays the role when the user is playing the video and tracks progress, so we can access it later on.

We start by creating an account in test mode in stripe.  open .env.local and paste in stripe publishable and secrete keys.

We set both publishable key and redirect url on the front end env, and secret key in the backend env.

Do installation of stripe packages on both client and server sides.

Now go to the backend and create a new file in src/controllers called transactionController.ts
create a payment intent on the backend and we need to connect it to the front end

In transaction controller, create a stripe payment intent with request and response from express. 
Use getCourse and copy and paste as an example.

This is necessary when we first initialize the stripe payment card checkout. With this, we created the endpint.  We also need to create routes.

create routes/transactionRoutes.ts, copy courseRoutes.ts as a template. The route is "/stripe/payment-intent"

Then in index.ts, add app.use for /transactions, and it will requireAuth, and pass in the transactionRoutes created above.

Now we got to frontend, state/api.ts, in api endpoint section, create endpoints for transactions. The end point url in the api.ts is /transactions/stripe/payment-intent (combination of the routes and index.ts app use)

in src/app/(nondashboard) folder, create a checkout folder. In this folder, create page.tsx

Start with rafce, and call it CheckoutWizard.

create in component directory WizardStepper.tsx, starting with rafce.

We will create a separate hook called useCheckoutNavigation in the src/hooks folder to keep track of the checkout step

The url for the checkout pages are like
`/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`

The signup component can change into signin if the user already has an account, but we don't want to navigate to the signin page we created earlier. That state is kept on the url above. This is only applicable for step 1.

back in checkout/page.tsx, we will render to different component depending on the step.  First create a checkout/details/index.tsx.   We will not make a page for this. Start with rafce, call it CheckoutDetailsPage.

Factor out the repeated used code to hooks/useCurrentCourse.ts start with
export const useCurrentCourse = () => {
        // get an instance of searchparams with useSearchParams()
    const searchParams = useSearchParams();
    // grab courseId by get id, and default to ""
    const courseId = searchParams.get("id") ?? "";
    // pass courseId into the hook useGetCourseQuery to get data: course
    const { data: course } = useGetCourseQuery(courseId);

}

**Test what we have so far**

(nondashboard)/checkout/page.tsx needs a "use client"

in search courses page, click on enroll now. and get redirected to checkout page. 
and we see the step wizard.

we will use CoursePreview component to fill out the checkout detail.  Create CoursePreview.tsx in components directory.  Start with rafce.

This finishes the checkout details page.

In case 2 of the (nondashboard)/checkout/page.tsx, we pass in PaymentPage component, and create a file in (nondashboard)/checkout/payment/index.tsx, rafce, call it PaymentPageContent.

In the same directory, create another file StripeProvider.tsx and wrap the payment page content with StripeProvider inside the PaymentPage.

StripeProvider starts with rafce. Once we follow the stripe spec to set up provider,
we come back to index.tsx and define the payment page content.

with form handling button onclicking functions commented out, we can check out how the step 2 payment page styling look like on the front end. Note here, the credit info are handled here, instead on stripe payment page.

The payment links are based on what you have on the stripe dashboard.

Handle transaction will involving creating transaction, course enrollment, course progress etc. So we need to go to backend first and set that up before we create handle submit. 

go back to transactionControllers in the backend. Copy createStripePaymentIntent() and leave only the try catch blocks to get start with, and rename it to createTransaction and go from there.

with createTrasaction in the controller, we got to transactionRoutes.ts and add the post router, with route "/".

Then go to api on the front end, and set a endpoint in our api redux toolkit query create transaction.

now go to app/(nondashboard)/checkout/payment/index.tsx to import the cerateTransaction function from the api, and use that to implement handleSubmit, which is what happens when we submit the payment info form.

We can test out the payment using strike fake credit card number and check in noSQL Workbench and see in the transaction table a record created today.

next we work on the completion page.

create completion/index.tsx in app/(nondashboard)/checkout
This is the component we include in the check wizard in app/(nondashboard)/checkout/page.tsx