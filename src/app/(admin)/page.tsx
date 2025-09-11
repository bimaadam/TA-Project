"use client";
import FinancialOverviewCard from "@/components/dashboard/FinancialOverviewCard";
import ProductStockSummaryCard from "@/components/dashboard/ProductStockSummaryCard";
import ProductSummaryCard from "@/components/dashboard/ProductSummaryCard";
import RecentActivitiesCard from "@/components/dashboard/RecentActivitiesCard";
import MonthlyFinancialChart from "@/components/ecommerce/MonthlySalesChart"; // Renamed component
import FinancialTrendChart from "@/components/ecommerce/StatisticsChart"; // Renamed component
import { useUser } from "@/context/UserContext"; // Import useUser
export default function Dashboard() {
  const { user, loading } = useUser();

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {loading ? "Loading..." : `Selamat datang, ${user?.fullName || user?.email || "Pengguna"}!`}
        </h1>
      </div>
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <FinancialOverviewCard />
        <MonthlyFinancialChart /> {/* New chart component */}
      </div>

      <div className="col-span-12 xl:col-span-5">
        <ProductStockSummaryCard /> {/* Replaced ClientSummaryCard */}
        <ProductSummaryCard/>
      </div>

      <div className="col-span-12">
        <FinancialTrendChart /> {/* New chart component */}
      </div>

      <div className="col-span-12">
        <RecentActivitiesCard />
      </div>
    </div>
  );
}