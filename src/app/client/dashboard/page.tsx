"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { projectService, Project } from '@/services/project.service';
import { invoiceService, Invoice } from '@/services/invoice.service';

export default function ClientDashboardPage() {
  const { user } = useUser();
  const [totalProjects, setTotalProjects] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [newMessages] = useState(0); // Placeholder for now
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return; // Ensure user ID is available

      setLoading(true);
      setError(null);

      try {
        const [projectsRes, invoicesRes] = await Promise.all([
          projectService.getProjectsByClientId(user.id),
          invoiceService.getInvoicesByClientId(user.id),
        ]);

        setTotalProjects(projectsRes.length);
        setCompletedProjects(projectsRes.filter((p: Project) => p.status === 'COMPLETED').length);
        setPendingInvoices(invoicesRes.filter((inv: Invoice) => inv.status === 'PENDING' || inv.status === 'UNPAID').length);
        // New messages remains 0 for now as there's no API for it

      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch client dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading client dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {/* Icon for Total Projects */}
          <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.25 3.4375H2.75C2.0625 3.4375 1.5 4.00001 1.5 4.6875V17.3125C1.5 17.9999 2.0625 18.5625 2.75 18.5625H19.25C19.9375 18.5625 20.5 17.9999 20.5 17.3125V4.6875C20.5 4.00001 19.9375 3.4375 19.25 3.4375ZM19.25 4.6875V6.5625H2.75V4.6875H19.25ZM2.75 17.3125V7.8125H19.25V17.3125H2.75ZM10.3125 10.3125H11.6875V14.6875H10.3125V10.3125Z" fill=""/>
          </svg>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              {totalProjects}
            </h4>
            <span className="text-sm font-medium">Total Projects</span>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {/* Icon for Pending Invoices */}
          <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.25 3.4375H2.75C2.0625 3.4375 1.5 4.00001 1.5 4.6875V17.3125C1.5 17.9999 2.0625 18.5625 2.75 18.5625H19.25C19.9375 18.5625 20.5 17.9999 20.5 17.3125V4.6875C20.5 4.00001 19.9375 3.4375 19.25 3.4375ZM19.25 4.6875V6.5625H2.75V4.6875H19.25ZM2.75 17.3125V7.8125H19.25V17.3125H2.75ZM10.3125 10.3125H11.6875V14.6875H10.3125V10.3125Z" fill=""/>
          </svg>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              {pendingInvoices}
            </h4>
            <span className="text-sm font-medium">Pending Invoices</span>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {/* Icon for Messages */}
          <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.25 3.4375H2.75C2.0625 3.4375 1.5 4.00001 1.5 4.6875V17.3125C1.5 17.9999 2.0625 18.5625 2.75 18.5625H19.25C19.9375 18.5625 20.5 17.9999 20.5 17.3125V4.6875C20.5 4.00001 19.9375 3.4375 19.25 3.4375ZM19.25 4.6875V6.5625H2.75V4.6875H19.25ZM2.75 17.3125V7.8125H19.25V17.3125H2.75ZM10.3125 10.3125H11.6875V14.6875H10.3125V10.3125Z" fill=""/>
          </svg>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              {newMessages}
            </h4>
            <span className="text-sm font-medium">New Messages</span>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {/* Icon for Completed Projects */}
          <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.25 3.4375H2.75C2.0625 3.4375 1.5 4.00001 1.5 4.6875V17.3125C1.5 17.9999 2.0625 18.5625 2.75 18.5625H19.25C19.9375 18.5625 20.5 17.9999 20.5 17.3125V4.6875C20.5 4.00001 19.9375 3.4375 19.25 3.4375ZM19.25 4.6875V6.5625H2.75V4.6875H19.25ZM2.75 17.3125V7.8125H19.25V17.3125H2.75ZM10.3125 10.3125H11.6875V14.6875H10.3125V10.3125Z" fill=""/>
          </svg>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md font-bold text-black dark:text-white">
              {completedProjects}
            </h4>
            <span className="text-sm font-medium">Completed Projects</span>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 2xl:mt-7.5">
        <h2 className="text-xl font-bold mb-4">Welcome to Your Client Dashboard, {user?.fullName || 'Client'}!</h2>
        <p>This is your personalized dashboard. Here you can view your projects, invoices, and other relevant information.</p>
      </div>
    </div>
  );
}
