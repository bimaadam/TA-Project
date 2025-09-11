"use client";

import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import { useRouter } from 'next/navigation';
import { journalService, JournalEntry } from '@/services/journal.service';
import { accountService, Account } from '@/services/account.service';
import { projectService, Project } from '@/services/project.service';
import Button from '@/components/ui/button/Button';
import html2canvas from 'html2canvas'; // Import html2canvas
import jsPDF from 'jspdf'; // Import jspdf

interface ViewJournalEntryProps {
  entryId: string;
}

export default function ViewJournalEntry({ entryId }: ViewJournalEntryProps) {
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [accounts, setAccounts] = useState<Map<string, Account>>(new Map());
  const [projects, setProjects] = useState<Map<string, Project>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null); // Ref for the content to be exported

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [entryData, accs, projs] = await Promise.all([
          journalService.getJournalEntryById(entryId),
          accountService.getAccounts(),
          projectService.getProjects(),
        ]);

        // Create maps for quick lookup
        const accountMap = new Map<string, Account>();
        accs.forEach(acc => accountMap.set(acc.id, acc));
        setAccounts(accountMap);

        const projectMap = new Map<string, Project>();
        projs.forEach(proj => projectMap.set(proj.id, proj));
        setProjects(projectMap);

        setEntry(entryData);
      } catch (err: unknown) {
        if (err instanceof Error)
        setError(err.message || 'Failed to fetch journal entry details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entryId]);

  const handleDownloadPdf = async () => {
    if (contentRef.current) {
      const input = contentRef.current;
      const canvas = await html2canvas(input, { scale: 2 }); // Scale for better quality
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`journal_entry_${entry?.referenceNumber || entryId}.pdf`);
    }
  };

  if (loading) {
    return <div>Loading journal entry details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!entry) {
    return <div>Journal entry not found.</div>;
  }

  const totalDebit = entry.lines.filter(line => line.isDebit).reduce((sum, line) => sum + line.amount, 0);
  const totalCredit = entry.lines.filter(line => !line.isDebit).reduce((sum, line) => sum + line.amount, 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between mb-4"> {/* Changed to justify-between */}
        <Button onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-black">Back</Button>
        <Button onClick={handleDownloadPdf}>Download PDF</Button>
      </div>
      <div ref={contentRef} className="p-4 border rounded shadow-sm bg-white dark:bg-gray-800"> {/* Added ref and styling for content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
            <p><strong>Reference Number:</strong> {entry.referenceNumber}</p>
            <p><strong>Description:</strong> {entry.description || '-'}</p>
          </div>
          <div>
            <p><strong>Recorded By:</strong> {entry.recordedByUser.fullName}</p>
            <p><strong>Project:</strong> {entry.projectId ? projects.get(entry.projectId)?.name : '-'}</p>
            <p><strong>Invoice:</strong> {entry.invoiceId || '-'}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Transaction Lines</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
            <thead>
              <tr className="w-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Account Code</th>
                <th className="py-3 px-6 text-left">Account Name</th>
                <th className="py-3 px-6 text-right">Debit</th>
                <th className="py-3 px-6 text-right">Credit</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {entry.lines.map((line, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left">{accounts.get(line.accountId)?.code}</td>
                  <td className="py-3 px-6 text-left">{accounts.get(line.accountId)?.name}</td>
                  <td className="py-3 px-6 text-right">{line.isDebit ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(line.amount) : '-'}</td>
                  <td className="py-3 px-6 text-right">{!line.isDebit ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(line.amount) : '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="w-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal font-bold">
                <td colSpan={2} className="py-3 px-6 text-left">Total</td>
                <td className="py-3 px-6 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalDebit)}</td>
                <td className="py-3 px-6 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCredit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
