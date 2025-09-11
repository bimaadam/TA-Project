"use client";

import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { journalService } from "@/services/journal.service";
import Button from "../ui/button/Button";

// Type definitions
interface User {
  fullName: string;
}

interface JournalLine {
  id: string;
  amount: number;
  isDebit: boolean;
  accountId: string;
}

interface IncomeEntry {
  id: string;
  date: string;
  description: string;
  lines: JournalLine[];
  recordedByUser: User;
}

export default function IncomeTransaction() {
  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncome = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await journalService.getRevenueEntries();
      setIncomeEntries(response as unknown as IncomeEntry[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch income");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const totalIncome = incomeEntries.reduce((sum, entry) => {
    const incomeLine = entry.lines.find((line: JournalLine) => !line.isDebit); // credit line
    return sum + (incomeLine?.amount || 0);
  }, 0);

  return (
    <div className="max-h-screen mx-auto p-0 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Income Transactions
              </h1>
              <p className="text-gray-600">
                Manage company revenues and other income
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchIncome}
              disabled={loading}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
            <Link href="/finance/income/tambah">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <Plus size={20} />
                Add Income
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Total Income</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Income List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recorded By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : incomeEntries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No income entries found.
                  </td>
                </tr>
              ) : (
                incomeEntries.map((entry: IncomeEntry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{entry.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(
                        entry.lines.find((l: JournalLine) => !l.isDebit)?.amount || 0
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.recordedByUser.fullName}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}