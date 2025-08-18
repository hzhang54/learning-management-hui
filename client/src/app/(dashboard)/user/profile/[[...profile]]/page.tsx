import Header from "@/components/Header";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

// return a header component within an empty <> for the text in the profile page.
// this head will be reused, so it's under components/Header.tsx
// pass in a Header component from @component/header.tsx, passing in title as "Profile", and subtitle as "View your profile"
// then pass in UserProfile component from @clerk/nextjs
const UserProfilePage = () => {
  return (
    <>
      <Header title="Profile" subtitle="View your profile" />
      {/* UserProfile: set path to /user/profile, routing to "path",
      appearance has baseTheme: dark, elements: scrollbox: bg-customgreys-darkGrey etc
      */}
      <UserProfile
        path="/user/profile"
        routing="path"
        appearance={{
          baseTheme: dark,
          elements: {
            scrollBox: "bg-customgreys-darkGrey",
            navbar: {
              "& > div:nth-child(1)": {
                background: "none",
              },
            },
          },
        }}
      />
    </>
  );
};

export default UserProfilePage;
