import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar";
  import {
    BookOpen,
    Briefcase,
    DollarSign,
    LogOut,
    PanelLeft,
    Settings,
    User,
  } from "lucide-react";
import Loading from "./Loading";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AppSidebar = () => {
  // adding some imports
  // we need to add a signout button on the side bar
  // use useUser to make sure user is signed in
  const { user, isLoaded } = useUser();
  // grab a signOut hook from useClerk, we can have the button to call this function to signout
  const { signOut } = useClerk();
  // grab pathname from usePathname from navigation
  const pathname = usePathname();
  // useSidebar from ui directory to get togglesidebar
  const { toggleSidebar } = useSidebar();

  // creating different sets of nav links for the entire side bar
  const navLinks = {
    student: [
      {
        // set icon to lucide BookOpen, set label to "Courses", href to /user/courses
        icon: BookOpen,
        label: "Courses",
        href: "/user/courses",
      },
      {
        icon: Briefcase,
        label: "Billing",
        href: "/user/billing",
      },
      {
        icon: User,
        label: "Profile",
        href: "/user/profile",
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/user/settings",
      },
    ],
    teacher: [
      {
        // set icon to lucide BookOpen, set label to "Courses", href to /user/courses
        icon: BookOpen,
        label: "Courses",
        href: "/teacher/courses",
      },
      {
        icon: DollarSign,
        label: "Billing",
        href: "/teacher/billing",
      },
      {
        icon: User,
        label: "Profile",
        href: "/teacher/profile",
      },
      {
        icon: Settings,
        label: "Settings",
        href: "/teacher/settings",
      },
    ],
  };

  // if isLoaded is false, return Loading component
  if (!isLoaded) {
    return <Loading />;
  }
  // if user doesn't exist, return a div saying User not found
  if (!user) {
    return <div>User not found</div>;
  }

  // Nav link is dependent on userType, grab it from publicMetadata.userType as "student" for typing
  const userType =
    (user.publicMetadata.userType as "student" | "teacher") || "student";
  // depending on the user role, set the currentNavLinks to the correct type of nav links
  const currentNavLinks = navLinks[userType];

  // return app component ui sidebar, set it collapsible to the icon size of sidebar
  // set style to height of 100 viewport height,
  // class name set to bg-customgreys-primarybg border-none shadow-lg
  // pass in SidebarMenu with calss name app-sidebar__menu
  // followed by SidebarMenuItem, with SidebarMenuButton with size set to "lg", onClick function set to toggleSidebar from clerk
  // className of SidebarMenuButton set to group hover:bg-customgreys-secondarybg (this is to the button at the top of sidebar)
  // within two divs put in Image with src /logo.svg, alt with logo, width 25, height 20, classname is app-sidebar__logo
  // the class name of the two divs are app-sidebar__logo-container group, and one ends with log-wrapper
  // followed with a p tag with className app-sidebar__title with the text HuiZhang
  // followed by a PanelLife with classname app-sidebar__collapse-icon
  // below that is SidebarContent, followed by SidebarMenu with className app-sidebar__nav-menu, followed by
  // currentNavLinks mapped out passing links into the lambda.  check if the link is active, if so, 
  // give a different color. and return a SidebarMenuItem, if its active, set clas name to bg-gray-800.
  // below is a SidebarMenuButton, with props, asChild, size lg, className is cn(app-sidebar-nav-button),
  // if not active, passin another color: dirty grey
  // pass in link.href, with class name ending with nav-link
  // set link.icon with different className depending on if isActive
  // followed by a span, with class anem, app-sidebar__nav-text, with styling passed in dependent on isActive
  return (
    <Sidebar
      collapsible="icon"
      style={{ height: "100vh" }}
      className="bg-customgreys-primarybg border-none shadow-lg"
    >
      <SidebarHeader>
        <SidebarMenu className="app-sidebar__menu">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => toggleSidebar()}
              className="group hover:bg-customgreys-secondarybg"
            >
              <div className="app-sidebar__logo-container group">
                <div className="app-sidebar__logo-wrapper">
                  <Image
                    src="/logo.svg"
                    alt="logo"
                    width={25}
                    height={20}
                    className="app-sidebar__logo"
                  />
                  <p className="app-sidebar__title">HZhang</p>
                </div>
                <PanelLeft className="app-sidebar__collapse-icon" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="app-sidebar__nav-menu">
          {currentNavLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <SidebarMenuItem
                key={link.href}
                className={cn(
                  "app-sidebar__nav-item",
                  isActive && "bg-gray-800"
                )}
              >
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className={cn(
                    "app-sidebar__nav-button",
                    !isActive && "text-customgreys-dirtyGrey"
                  )}
                >
                  <Link
                    href={link.href}
                    className="app-sidebar__nav-link"
                    scroll={false}
                  >
                    <link.icon
                      className={isActive ? "text-white-50" : "text-gray-500"}
                    />
                    <span
                      className={cn(
                        "app-sidebar__nav-text",
                        isActive ? "text-white-50" : "text-gray-500"
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className="app-sidebar__active-indicator" />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => signOut()}
                className="app-sidebar__signout"
              >
                <LogOut className="mr-2 h-6 w-6" />
                <span>Sign out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );

};

export default AppSidebar;
