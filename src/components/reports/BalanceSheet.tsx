"use client";

import React, { useEffect, useState } from 'react';
import { reportService, BalanceSheetData } from '@/services/report.service';
import Button from '@/components/ui/button/Button';

export default function BalanceSheet() {
  const [reportData, setReportData] = useState<BalanceSheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asOfDate, setAsOfDate] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getBalanceSheet(asOfDate);
      setReportData(data);
    } catch (err: unknown) {
      if (err instanceof Error)
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate report on initial load for current date
    setAsOfDate(new Date().toISOString().split('T')[0]);
    generateReport();
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <input type="date" value={asOfDate} onChange={e => setAsOfDate(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
        <Button onClick={generateReport} disabled={loading}>{loading ? 'Generating...' : 'Generate Report'}</Button>
      </div>

      {loading && <div>Generating report...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {reportData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Laporan Neraca</h2>
          <p className="text-center mb-6">Per Tanggal: {new Date(reportData.asOfDate).toLocaleDateString()}</p>
          
          <div className="space-y-4">
            {/* Assets */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Aset ({formatCurrency(reportData.assets.total)})</h3>
              <ul className="space-y-1 ml-4">
                {reportData.assets.accounts.map((acc, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{acc.name}</span>
                    <span>{formatCurrency(acc.balance)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Liabilities */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Liabilitas ({formatCurrency(reportData.liabilities.total)})</h3>
              <ul className="space-y-1 ml-4">
                {reportData.liabilities.accounts.map((acc, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{acc.name}</span>
                    <span>{formatCurrency(acc.balance)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equity */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Ekuitas ({formatCurrency(reportData.equity.total)})</h3>
              <ul className="space-y-1 ml-4">
                {reportData.equity.accounts.map((acc, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{acc.name}</span>
                    <span>{formatCurrency(acc.balance)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between font-bold text-lg bg-gray-100 dark:bg-gray-700 p-2 rounded mt-6">
              <span>Total Liabilitas & Ekuitas</span>
              <span>{formatCurrency(reportData.liabilities.total + reportData.equity.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
