"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { reportService, ProjectSummaryData } from '@/services/report.service';
import Badge from "@/components/ui/badge/Badge";

export default function ProjectReportTable() {
  const [projects, setProjects] = useState<ProjectSummaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await reportService.getProjectSummary(startDate, endDate);
    setProjects(response);
  } catch (err: unknown) {
    if (err instanceof Error)
      setError(err.message || 'Failed to fetch project report data');
  } finally {
    setLoading(false);
  }
}, [startDate, endDate]);

useEffect(() => {
  fetchData();
}, [fetchData]);


  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  if (loading) {
    return <div>Loading project report...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center gap-4 mb-4">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded dark:bg-gray-700" />
        <Button onClick={fetchData} disabled={loading}>Generate Report</Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Project Name</th>
              <th className="py-3 px-6 text-left">Client</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-right">Revenue</th>
              <th className="py-3 px-6 text-right">Expense</th>
              <th className="py-3 px-6 text-right">Net Profit</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
            {projects.map(project => (
              <tr key={project.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                <td className="py-3 px-6 text-left whitespace-nowrap">{project.name}</td>
                <td className="py-3 px-6 text-left">{project.clientName}</td>
                <td className="py-3 px-6 text-left">
                  <Badge size="sm" color={project.status === 'COMPLETED' ? 'success' : 'warning'}>
                    {project.status}
                  </Badge>
                </td>
                <td className="py-3 px-6 text-right">{formatCurrency(project.totalRevenue)}</td>
                <td className="py-3 px-6 text-right">{formatCurrency(project.totalExpense)}</td>
                <td className="py-3 px-6 text-right">{formatCurrency(project.netProfit)}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <Link href={`/reports/project-detail/${project.id}`}><Button size="sm" variant="outline">View Details</Button></Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}