"use client"

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Bell, BookOpen } from "lucide-react";
import Link from "next/link";
import React from "react";

const NonDashboardNavbar = () => {
  // grab user from useUser from clerk nextjs
  const { user } = useUser();
  // get userRole from metaData
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";
  // console log the publicMetadata we get from clerk
  //console.log("user?.publicMetadata?.userType:", user?.publicMetadata?.userType);
  

  return (
    <nav className="nondashboard-navbar">
      <div className="nondashboard-navbar__container">
        <div className="nondashboard-navbar__search">
          <Link href="/" className="nondashboard-navbar__brand"  scroll={false}>
            HZHANG
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link
                href="/search"
                scroll={false}
                className="nondashboard-navbar__search-input"
              >
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen
                className="nondashboard-navbar__search-icon"
                size={18}
              />
            </div>
          </div>
        </div>
        <div className="nondashboard-navbar__actions">
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon"></Bell>
          </button>

          {/* SIGN IN BUTTONS: wrap a SignedIn around a UserButton component from clerk nextjs */}
          <SignedIn>
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
            >

            </UserButton>
          </SignedIn>
          {/* SIGN OUT LINK: wrap a SignedOut around a Link with href set to /signin, with class name nondashboard-navbar__auth-button */}
          <SignedOut>
          <Link href="/signin" className="nondashboard-navbar__auth-button--login" scroll={false}>
            Sign In
          </Link>
          <Link href="/signup" className="nondashboard-navbar__auth-button--signup" scroll={false}>
            Sign Up
          </Link>          
          </SignedOut>
          
        </div>
      </div>
    </nav>
  );
};

export default NonDashboardNavbar;
