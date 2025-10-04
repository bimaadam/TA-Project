"use client";
import React, { useEffect, useState } from "react";
import { dashboardService, DashboardSummary } from "@/services/dashboard.service";
import { GroupIcon, TableIcon } from "@/icons"; // Using TableIcon for projects

export const EcommerceMetrics = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getSummary();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div>Loading metrics...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Clients */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Clients
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {summary?.totalClients ?? 0}
          </h4>
        </div>
      </div>

      {/* Total Projects */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <TableIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Projects
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {summary?.totalProjects ?? 0}
          </h4>
        </div>
      </div>

      {/* You can add more metrics for totalRevenue and unpaidInvoices here */}

    </div>
  );
};