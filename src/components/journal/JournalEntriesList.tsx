"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { journalService, JournalEntry } from '@/services/journal.service';

export default function JournalEntriesList() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await journalService.getJournalEntries();
      setEntries(response);
    } catch (err: unknown) {
      if (err instanceof Error)
      setError(err.message || 'Failed to fetch journal entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (loading) {
    return <div>Loading journal entries...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/finance/journal-entries/tambah">
          <Button>Add Journal Entry</Button>
        </Link>
      </div>
      
      {/* Journal Entry Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-100 dark:border-white/[0.05]">
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Reference #</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Recorded By</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {entries.map(entry => (
                <tr key={entry.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-left">{entry.referenceNumber}</td>
                  <td className="py-3 px-6 text-left">{entry.description}</td>
                  <td className="py-3 px-6 text-left">{entry.recordedByUser.fullName}</td>
                  <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                          {/* Action buttons (View, Edit, Delete) can be added here */}
                          <Link href={`/finance/journal-entries/${entry.id}`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">View</Link>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
