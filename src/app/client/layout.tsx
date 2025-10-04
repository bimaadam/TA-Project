"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar"; // Import AppSidebar instead of ClientSidebar
import { SidebarProvider } from "@/context/SidebarContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isReady } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    if (!user || user.role !== "CLIENT") {
      router.push("/signin");
      return;
    }
  }, [user, loading, isReady, router]);

  if (loading || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading client dashboard...</p>
      </div>
    );
  }

  if (!user || user.role !== "CLIENT") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="flex h-screen overflow-hidden">
          <AppSidebar userRole={user?.role} /> {/* Pass userRole to AppSidebar */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <AppHeader />
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
