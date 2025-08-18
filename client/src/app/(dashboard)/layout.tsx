"use client";
import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
// this is the top nav bar on every page
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // grab pathname from usePathname, because the nav bar will look different on certain pages.
  // particularly when we show video, the sidebar is different for different url

  const pathname = usePathname();

  // set up useState with string|null for courseId and setCourseId,
  // passing in null
  const [courseId, setCourseId] = useState<string | null>(null);

  // grab user and isLoaded from clerk with useUser
  const { user, isLoaded } = useUser();
  const isCoursePage = /^\/user\/courses\/[^\/]+(?:\/chapters\/[^\/]+)?$/.test(
    pathname
  );
  // handle use effect isCoursePage
  useEffect(() => {
    if (isCoursePage) {
      const match = pathname.match(/\/user\/courses\/([^\/]+)/);
      setCourseId(match ? match[1] : null);
    } else {
      setCourseId(null);
    }
  }, [isCoursePage, pathname]);
  // is the user is not loaded, return a Loading component
  if (!isLoaded) {
    return <Loading />;
  }
  // is user is not signed in, return a div saying Please sign in to access this page.
  if (!user) {
    return <div> Please sign in to access this page. </div>;
  }
  // wrap the sidebar component with SidebarProvider, so that we can access the state
  return (
    <SidebarProvider>
      <div className="dashboard">
        {/* sidebar will go here, the dashboard className will flex the rest of the content */}
        <AppSidebar />
        {/* add a div with classname dashboard_content*/}
        <div className="dashboard__content">
          {/* chapter sidebar will go here if it is a course page */}
          {/* add a div with class name cn() from tailwind, passing it dashboard__main
        and set the style with a height of 100 view port height
        */}
          <div className={cn("dashboard__main")} style={{ height: "100vh" }}>
            <Navbar isCoursePage={isCoursePage} />
            <main className="dashboard__body">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
