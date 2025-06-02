"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // useEffect(() => {
  //   const token = document.cookie
  //     .split('; ')
  //     .find(row => row.startsWith('accessToken='))
  //     ?.split('=')[1];
  //   const protectedPaths = ['/', '/profile'];
  //   const currentPath = window.location.pathname;

  //   if (protectedPaths.some(path => currentPath.startsWith(path)) && !token) {
  //     router.push('/signin');
  //   }
  // }, []);

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
