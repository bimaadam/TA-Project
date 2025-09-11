"use client";

import React, { useEffect, useState } from "react";
import { projectService, Project } from "@/services/project.service";
import { journalService, JournalEntry } from "@/services/journal.service";
import { accountService, Account } from "@/services/account.service";
import { invoiceService, Invoice } from "@/services/invoice.service";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

interface ProjectDetailReportProps {
  projectId: string;
}

interface ProjectSummary {
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
}

export default function ProjectDetailReport({
  projectId,
}: ProjectDetailReportProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [projectData, allJournalEntriesWithLines, allAccounts, allInvoices] =
          await Promise.all([
            projectService.getProjectById(projectId),
            journalService.getJournalEntriesWithLines(),
            accountService.getAccounts(),
            invoiceService.getInvoices(),
          ]);

        setProject(projectData);
        setAccounts(allAccounts);

        // Filter data for this project
        const projectJournalEntries = allJournalEntriesWithLines.filter(
          (entry) => entry.projectId === projectId
        );
        setJournalEntries(projectJournalEntries);

        const projectInvoices = allInvoices.filter(
          (invoice) => invoice.projectId === projectId
        );
        setInvoices(projectInvoices);

        // --- Hitung summary (Revenue/Expense detail) ---
        let revenue = 0,
          otherIncome = 0,
          expense = 0,
          otherExpense = 0;

        projectJournalEntries.forEach((entry) => {
          entry.lines?.forEach((line) => {
            const account = allAccounts.find((acc) => acc.id === line.accountId);
            if (!account) return;

            switch (account.categoryType) {
              case "REVENUE":
                revenue += line.isDebit ? -line.amount : line.amount;
                break;
              case "OTHER_INCOME":
                otherIncome += line.isDebit ? -line.amount : line.amount;
                break;
              case "EXPENSE":
              case "COST_OF_GOODS_SOLD":
                expense += line.isDebit ? line.amount : -line.amount;
                break;
              case "OTHER_EXPENSE":
                otherExpense += line.isDebit ? line.amount : -line.amount;
                break;
            }
          });
        });

        const totalRevenue = revenue + otherIncome;
        const totalExpense = expense + otherExpense;
        const netProfit = totalRevenue - totalExpense;

        setSummary({ totalRevenue, totalExpense, netProfit });
      } catch (err: any) {
        setError(err.message || "Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);

  const getEntryAmount = (entry: JournalEntry) => {
    return entry.lines.reduce((total, line) => {
      return total + (line.isDebit ? line.amount : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <span>Loading project report...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Project Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
        <p>
          <strong>Description:</strong> {project.description || "-"}
        </p>
        <p>
          <strong>Client:</strong> {project.client?.fullName || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        <p>
          <strong>Budget:</strong> {formatCurrency(project.budget || 0)}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(project.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {project.endDate
            ? new Date(project.endDate).toLocaleDateString()
            : "-"}
        </p>
      </div>

      {/* Financial Summary */}
      {summary && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(summary.totalRevenue)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Expense</p>
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(summary.totalExpense)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Net Profit</p>
              <p
                className={`text-xl font-bold ${
                  summary.netProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(summary.netProfit)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Related Invoices */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Related Invoices</h3>
        {invoices.length === 0 ? (
          <p>No invoices found for this project.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-4 text-left">Number</th>
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-right">Total Amount</th>
                  <th className="py-2 px-4 text-left">Due Date</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-2 px-4">{invoice.number}</td>
                    <td className="py-2 px-4">{invoice.title}</td>
                    <td className="py-2 px-4 text-right">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-center">{invoice.status}</td>
                    <td className="py-2 px-4 text-center">
                      <Link href={`/finance/invoices/edit/${invoice.id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Related Journal Entries */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Related Journal Entries</h3>
        {journalEntries.length === 0 ? (
          <p>No journal entries found for this project.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Reference #</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-right">Amount</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {journalEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-2 px-4">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">{entry.referenceNumber}</td>
                    <td className="py-2 px-4">{entry.description}</td>
                    <td className="py-2 px-4 text-right">
                      {formatCurrency(getEntryAmount(entry))}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Link href={`/finance/journal-entries/${entry.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
