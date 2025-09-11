"use client";

import React, { useEffect, useState } from 'react';
import { reportService, IncomeStatementData } from '@/services/report.service';
import Button from '@/components/ui/button/Button';

export default function IncomeStatement() {
  const [reportData, setReportData] = useState<IncomeStatementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getIncomeStatement(startDate, endDate);
      setReportData(data);
    } catch (err: unknown) {
      if (err instanceof Error)
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate report on initial load for all time
    generateReport();
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
        <Button onClick={generateReport} disabled={loading}>{loading ? 'Generating...' : 'Generate Report'}</Button>
      </div>

      {loading && <div>Generating report...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {reportData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Laporan Laba Rugi</h2>
          <p className="text-center mb-6">Periode: {reportData.startDate || 'awal'} - {reportData.endDate || 'akhir'}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span>Pendapatan</span>
              <span>{formatCurrency(reportData.revenue)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Beban Pokok Penjualan</span>
              <span>({formatCurrency(reportData.cogs)})</span>
            </div>
            <div className="flex justify-between font-bold border-b-2 border-black pb-2">
              <span>Laba Kotor</span>
              <span>{formatCurrency(reportData.grossProfit)}</span>
            </div>
            <div className="flex justify-between pt-4">
              <span>Beban Operasional</span>
              <span>({formatCurrency(reportData.expense)})</span>
            </div>
            <div className="flex justify-between">
              <span>Pendapatan Lain-lain</span>
              <span>{formatCurrency(reportData.otherIncome)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Beban Lain-lain</span>
              <span>({formatCurrency(reportData.otherExpense)})</span>
            </div>
            <div className="flex justify-between font-bold text-lg bg-gray-100 dark:bg-gray-700 p-2 rounded">
              <span>Laba Bersih</span>
              <span>{formatCurrency(reportData.netProfit)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
