"use client";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// pass in {isCoursePage} which is a boolean.  Depending on
// if its course page, nav bar is different
const Navbar = ({ isCoursePage }: { isCoursePage: boolean }) => {
  // set up state for isDarkMode
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // grab user from useUser from clerk nextjs
  const { user } = useUser();
  // get userRole from metaData
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  // console log the publicMetadata we get from clerk
  //console.log("user?.publicMetadata?.userType:", user?.publicMetadata?.userType);

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">
        <div className="dashboard-navbar__search">
          {/* pass in a div with class name md:hidden, inside is a SidebarTrigger from chadcn */}
          <div className="md:hidden">
            <SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link
                href="/search"
                className={cn("dashboard-navbar__search-input", {
                  "!bg-customgreys-secondarybg": isCoursePage,
                })}
              >
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen className="dashboard-navbar__search-icon" size={18} />
            </div>
          </div>
        </div>
        <div className="dashboard-navbar__actions">
            <span className="nondashboard-navbar__notification-indicator"></span>
          <button className="nondashboard-navbar__notification-button">
            <Bell className="nondashboard-navbar__notification-icon"></Bell>
          </button>

          {/* a UserButton component from clerk nextjs */}

            <UserButton
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                  userButtonBox: "scale-90 sm:scale-100",
                },
              }}
              showName={true}
              userProfileMode="navigation"
              userProfileUrl={
                userRole === "teacher" ? "/teacher/profile" : "/user/profile"
              }
            ></UserButton>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
