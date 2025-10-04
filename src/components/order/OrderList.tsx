"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { orderService, Order } from '@/services/order.service';
import Badge from "@/components/ui/badge/Badge";

export default function OrderList({ basePath = "/orders" }: { basePath?: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isClientView = basePath.startsWith('/client/orders');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders();
      setOrders(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(orderId);
        fetchOrders(); // Refresh list after delete
      } catch (err: unknown) {
        alert(`Error: ${err instanceof Error ? err.message : 'An error occurred'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href={`${basePath}/tambah`}>
          <Button>Add Order</Button>
        </Link>
      </div>

      {/* Order Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-100 dark:border-white/[0.05]">
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Order Date</th>
                <th className="py-3 px-6 text-left">Client</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-center">Status</th>
                {!isClientView && (
                  <th className="py-3 px-6 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-left">{order.user.fullName}</td>
                  <td className="py-3 px-6 text-left">{order.description}</td>
                  <td className="py-3 px-6 text-center">
                    <Badge size="sm" color={order.status === 'COMPLETED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'error'}>
                      {order.status}
                    </Badge>
                  </td>
                  {!isClientView && (
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <Link href={`${basePath}/edit/${order.id}`}><Button size="sm" variant="outline" className="mr-2">Edit</Button></Link>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(order.id)}>Delete</Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
