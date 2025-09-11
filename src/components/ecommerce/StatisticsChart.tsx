"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { journalService, JournalEntry } from '@/services/journal.service';
import { accountService, Account } from '@/services/account.service';

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function FinancialTrendChart() {
  const [seriesData, setSeriesData] = useState<{
    name: string;
    data: number[];
  }[]>([
    { name: "Laba Bersih", data: [] },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [journalRes, accountRes] = await Promise.all([
          journalService.getJournalEntriesWithLines(), // Get all journal entries with lines
          accountService.getAccounts(),
        ]);

        const monthlyNetProfit: number[] = Array(12).fill(0);

        journalRes.forEach(entry => {
          const month = new Date(entry.date).getMonth(); // 0-11
          let entryRevenue = 0;
          let entryExpense = 0;

          entry.lines.forEach(line => {
            const account = accountRes.find(acc => acc.id === line.accountId);
            if (account) {
              if (account.categoryType === 'REVENUE' || account.categoryType === 'OTHER_INCOME') {
                entryRevenue += line.isDebit ? -line.amount : line.amount;
              } else if (account.categoryType === 'EXPENSE' || account.categoryType === 'COST_OF_GOODS_SOLD' || account.categoryType === 'OTHER_EXPENSE') {
                entryExpense += line.isDebit ? line.amount : -line.amount;
              }
            }
          });
          monthlyNetProfit[month] += (entryRevenue - entryExpense);
        });

        setSeriesData([
          { name: "Laba Bersih", data: monthlyNetProfit },
        ]);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch financial data for trend chart');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#22c55e"], // Green for Net Profit
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth", // Changed to smooth for trend
      width: 2,
      colors: ["#22c55e"],
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "white",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        format: "MMM", // Format for x-axis tooltip
      },
      y: {
        formatter: (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val),
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', notation: 'compact' }).format(val),
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Net Profit Trend
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Performance over the last 12 months
        </p>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={seriesData}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}