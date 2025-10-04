"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { orderService, UpdateOrderPayload } from '@/services/order.service';
import { clientService, Client } from '@/services/client.service';
import Button from '@/components/ui/button/Button';

interface EditOrderFormProps {
  orderId: string;
}

export default function EditOrderForm({ orderId }: EditOrderFormProps) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<UpdateOrderPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderData, clientsRes] = await Promise.all([
          orderService.getOrderById(orderId),
          clientService.getClients(),
        ]);

        setClients(clientsRes.data);
        setFormData({
          userId: orderData.userId,
          description: orderData.description,
          status: orderData.status,
        });

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load order data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    setError(null);
    try {
      await orderService.updateOrder(orderId, formData);
      alert('Order updated successfully!');
      router.push('/orders'); // Redirect to order list page
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading order data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!formData) {
    return <div>Order not found.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Client</label>
        <select name="userId" value={formData.userId || ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" required>
          <option value="" disabled>Select a Client</option>
          {clients.map(client => <option key={client.id} value={client.id}>{client.fullName}</option>)}
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Order description..." className="w-full p-2 border rounded dark:bg-gray-700" rows={4} required></textarea>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Status</label>
        <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700">
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.push('/orders')} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Order'}</Button>
      </div>
    </form>
  );
}
