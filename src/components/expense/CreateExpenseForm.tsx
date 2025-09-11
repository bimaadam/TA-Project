"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { journalService, CreateJournalEntryPayload } from '@/services/journal.service';
import { accountService, Account } from '@/services/account.service';
import { projectService, Project } from '@/services/project.service'; // New import
import Button from '@/components/ui/button/Button';

export default function CreateExpenseForm() {
  const router = useRouter();
  const { user } = useUser();
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); // New state for projects
  const [formData, setFormData] = useState({ date: '', description: '', amount: '', expenseAccountId: '', paymentAccountId: '', projectId: '' }); // Added projectId
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const expenseAccounts = accounts.filter(acc => acc.categoryType === 'EXPENSE');
  const paymentAccounts = accounts.filter(acc => acc.name === 'Kas' || acc.name === 'Bank');

  useEffect(() => {
    Promise.all([
      accountService.getAccounts(),
      projectService.getProjects(), // Fetch projects
    ]).then(([accs, projs]) => {
      setAccounts(accs);
      setProjects(projs);
    }).catch(err => setError('Failed to load initial data'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.date || !formData.description || !formData.amount || !formData.expenseAccountId || !formData.paymentAccountId) {
      setError('Please fill all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateJournalEntryPayload = {
        date: new Date(formData.date).toISOString(),
        description: formData.description,
        referenceNumber: `EXP-${Date.now()}`,
        recordedByUserId: user.id,
        projectId: formData.projectId || undefined, // Add projectId to payload
        lines: [
          { accountId: formData.expenseAccountId, amount: parseFloat(formData.amount), isDebit: true },
          { accountId: formData.paymentAccountId, amount: parseFloat(formData.amount), isDebit: false },
        ],
      };

      await journalService.createJournalEntry(payload);
      alert('Expense recorded successfully!');
      router.push('/finance/expense'); // Redirect to expense list page
    } catch (err: any) {
      setError(err.message || 'Failed to record expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Date *</label>
          <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Amount *</label>
          <input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="0" className="w-full p-2 border rounded dark:bg-gray-700" required />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Expense Category *</label>
          <select name="expenseAccountId" value={formData.expenseAccountId} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required>
            <option value="" disabled>Select expense account</option>
            {expenseAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Paid From *</label>
          <select name="paymentAccountId" value={formData.paymentAccountId} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required>
            <option value="" disabled>Select payment account</option>
            {paymentAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Project (Optional)</label>
          <select name="projectId" value={formData.projectId} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700">
            <option value="">No Associated Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Description *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Expense description..." className="w-full p-2 border rounded dark:bg-gray-700" rows={3} required></textarea>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Expense'}</Button>
      </div>
    </form>
  );
}
