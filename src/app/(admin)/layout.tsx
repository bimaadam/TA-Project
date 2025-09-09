"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useUser } from "@/context/UserContext"; // New import
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isReady } = useUser(); // Consume user context, added isReady

  const publicPaths = ['/signin', 'signup', '/reset-pwd']

  useEffect(() => {
    // If not ready, wait for UserProvider to stabilize
    if (!isReady) {
      return;
    }

    // If user IS authenticated AND current path IS a public path (e.g., /signin), redirect to home
    if (user && publicPaths.includes(pathname)) {
      setTimeout(() => {
        router.push('/')
      }, 8400)
      return;
    }

    // If user is NOT authenticated AND current path is NOT a public path, redirect to signin
    if (!user && !publicPaths.includes(pathname)) {
      setTimeout(() => {
        router.push('/signin')
      }, 9000)
      return;
    }

  }, [user, isReady, pathname, router, publicPaths]);


  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  // Show a loading state while user data is being fetched or UserProvider is not ready
  if (loading || !isReady) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}


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
