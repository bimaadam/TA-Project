"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { journalService, CreateJournalEntryPayload } from '@/services/journal.service';
import { accountService, Account } from '@/services/account.service';
import { projectService, Project } from '@/services/project.service';
import { invoiceService, Invoice } from '@/services/invoice.service'; // New import
import Button from '@/components/ui/button/Button';

const initialLine = { accountId: '', amount: 0, isDebit: true };

export default function CreateJournalForm() {
  const router = useRouter();
  const { user } = useUser();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]); // New state for invoices
  const [lines, setLines] = useState([ { ...initialLine }, { ...initialLine, isDebit: false } ]);
  const [formData, setFormData] = useState({ date: '', description: '', referenceNumber: '', projectId: '', invoiceId: '' }); // Added invoiceId
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch accounts, projects, and invoices for dropdowns
    Promise.all([
      accountService.getAccounts(),
      projectService.getProjects(),
      invoiceService.getInvoices(), // Fetch invoices
    ]).then(([accs, projs, invs]) => {
      setAccounts(accs);
      setProjects(projs);
      setInvoices(invs); // Set invoices
    }).catch(() => setError('Failed to load initial data'));
  }, []);

  const handleLineChange = (index: number, field: string, value: unknown) => {
    const newLines = [...lines];
    (newLines[index] as unknown)[field] = value;
    setLines(newLines);
  };

  const addLine = () => setLines([...lines, { ...initialLine }]);
  const removeLine = (index: number) => setLines(lines.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError('You must be logged in to create a journal entry.');
        return;
    }

    // Basic validation
    const totalDebits = lines.filter(l => l.isDebit).reduce((sum, l) => sum + l.amount, 0);
    const totalCredits = lines.filter(l => !l.isDebit).reduce((sum, l) => sum + l.amount, 0);
    if (totalDebits !== totalCredits) {
        setError('Total debits must equal total credits.');
        return;
    }
    if (totalDebits === 0) {
        setError('Total amount cannot be zero.');
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateJournalEntryPayload = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        recordedByUserId: user.id,
        lines: lines.map(l => ({ ...l, amount: Number(l.amount) })),
        projectId: formData.projectId || undefined,
        invoiceId: formData.invoiceId || undefined, // Added invoiceId to payload
      };
      await journalService.createJournalEntry(payload);
      alert('Journal Entry created successfully!');
      router.push('/finance/journal-entries'); // Redirect to journal list page
    } catch (err: unknown) {
      if (err instanceof Error)
      setError(err.message || 'Failed to create journal entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Header Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <input name="date" type="date" onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700" required />
        <input name="referenceNumber" onChange={e => setFormData({...formData, referenceNumber: e.target.value})} placeholder="Reference #" className="w-full p-2 border rounded dark:bg-gray-700" required />
        <select name="projectId" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700">
            <option value="">No Associated Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {/* New Invoice Dropdown */}
        <select name="invoiceId" value={formData.invoiceId} onChange={e => setFormData({...formData, invoiceId: e.target.value})} className="w-full p-2 border rounded dark:bg-gray-700">
            <option value="">No Associated Invoice</option>
            {invoices.map(inv => <option key={inv.id} value={inv.id}>{inv.number} - {inv.title}</option>)}
        </select>
      </div>
      <textarea name="description" onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description..." className="w-full p-2 border rounded dark:bg-gray-700" rows={2}></textarea>

      {/* Journal Lines */}
      <div className="space-y-2">
        {lines.map((line, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            <select value={line.accountId} onChange={e => handleLineChange(index, 'accountId', e.target.value)} className="col-span-5 w-full p-2 border rounded dark:bg-gray-700" required>
              <option value="" disabled>Select Account</option>
              {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>)}
            </select>
            <input type="number" value={line.amount} onChange={e => handleLineChange(index, 'amount', parseFloat(e.target.value))} placeholder="Amount" className="col-span-3 w-full p-2 border rounded dark:bg-gray-700" required />
            <select value={String(line.isDebit)} onChange={e => handleLineChange(index, 'isDebit', e.target.value === 'true')} className="col-span-3 w-full p-2 border rounded dark:bg-gray-700">
              <option value="true">Debit</option>
              <option value="false">Credit</option>
            </select>
            <Button type="button" onClick={() => removeLine(index)} className="col-span-1 bg-red-500 hover:bg-red-600">X</Button>
          </div>
        ))}
      </div>
      <Button type="button" onClick={addLine}>Add Line</Button>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Journal Entry'}</Button>
      </div>
    </form>
  );
}
