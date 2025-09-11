"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { journalService, JournalEntry } from '@/services/journal.service';
import { invoiceService, Invoice } from '@/services/invoice.service';
import Button from '../ui/button/Button';

export default function RecentActivitiesCard() {
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [journalRes, invoiceRes] = await Promise.all([
          journalService.getJournalEntries(), // Or getJournalEntriesWithLines() if you want full detail
          invoiceService.getInvoices(),
        ]);
        setRecentEntries(journalRes.slice(0, 5)); // Get top 5 recent journal entries
        setRecentInvoices(invoiceRes.slice(0, 5)); // Get top 5 recent invoices
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch Journal Entries data");
        }
      } finally {
      }setLoading(false)
      }
    fetchData();
  }, []);

  if (loading) {
    return <div className="col-span-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">Loading recent activities...</div>;
  }

  if (error) {
    return <div className="col-span-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-red-500">Error: {error}</div>;
  }

  return (
    <div className="col-span-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
      
      <h3 className="text-lg font-semibold mb-2">Recent Journal Entries</h3>
      {recentEntries.length === 0 ? (
        <p>No recent journal entries.</p>
      ) : (
        <ul className="space-y-2">
          {recentEntries.map(entry => (
            <li key={entry.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
              <span>{new Date(entry.date).toLocaleDateString()} - {entry.description || 'No Description'}</span>
              <Link href={`/finance/journal-entries/${entry.id}`}><Button size="sm" variant="outline">View</Button></Link>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-lg font-semibold mt-6 mb-2">Recent Invoices</h3>
      {recentInvoices.length === 0 ? (
        <p>No recent invoices.</p>
      ) : (
        <ul className="space-y-2">
          {recentInvoices.map(invoice => (
            <li key={invoice.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
              <span>{new Date(invoice.issuedDate).toLocaleDateString()} - {invoice.title}</span>
              <Link href={`/data-invoice/details-invoice/${invoice.id}`}><Button size="sm" variant="outline">View</Button></Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
