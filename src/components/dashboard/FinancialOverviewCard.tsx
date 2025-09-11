"use client";

import React, { useEffect, useState } from 'react';
import { reportService, IncomeStatementData, BalanceSheetData } from '@/services/report.service';

export default function FinancialOverviewCard() {
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatementData | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeData, balanceData] = await Promise.all([
        reportService.getIncomeStatement(),
        reportService.getBalanceSheet(),
      ]);
      setIncomeStatement(incomeData);
      setBalanceSheet(balanceData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch financial data');
      }
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);


  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  if (loading) {
    return <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">Loading financial data...</div>;
  }

  if (error) {
    return <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-red-500">Error: {error}</div>;
  }

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Financial Overview</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Revenue (YTD)</span>
          <span className="font-semibold text-green-600">{formatCurrency(incomeStatement?.revenue || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Expense (YTD)</span>
          <span className="font-semibold text-red-600">{formatCurrency(incomeStatement?.expense || 0)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Net Profit (YTD)</span>
          <span className={incomeStatement && incomeStatement.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(incomeStatement?.netProfit || 0)}</span>
        </div>
        <div className="flex justify-between pt-2">
          <span>Total Assets</span>
          <span className="font-semibold">{formatCurrency(balanceSheet?.assets.total || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Liabilities</span>
          <span className="font-semibold">{formatCurrency(balanceSheet?.liabilities.total || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Equity</span>
          <span className="font-semibold">{formatCurrency(balanceSheet?.equity.total || 0)}</span>
        </div>
      </div>
    </div>
  );
}
