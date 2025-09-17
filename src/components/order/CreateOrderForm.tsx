"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderService, CreateOrderPayload } from '@/services/order.service';
import { clientService, Client } from '@/services/client.service';
import Button from '@/components/ui/button/Button';

export default function CreateOrderForm() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<Omit<CreateOrderPayload, 'userId'>>({
    description: '',
    status: 'PENDING',
  });
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clientService.getClients()
      .then(response => setClients(response.data))
      .catch(() => setError('Failed to load clients'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      setError('Please select a client.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload: CreateOrderPayload = { ...formData, userId: selectedClientId };
      await orderService.createOrder(payload);
      alert('Order created successfully!');
      router.push('/orders'); // Redirect to order list page
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Client</label>
        <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" required>
          <option value="" disabled>Select a Client</option>
          {clients.map(client => <option key={client.id} value={client.id}>{client.fullName}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Order description..." className="w-full p-2 border rounded dark:bg-gray-700" rows={4} required></textarea>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700">
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Order'}</Button>
      </div>
    </form>
  );
}
