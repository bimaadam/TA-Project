"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { invoiceService, Invoice } from '@/services/invoice.service';
import { clientService, Client } from '@/services/client.service';
import { projectService, Project } from '@/services/project.service';
import Badge from "@/components/ui/badge/Badge";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Map<string, string>>(new Map());
  const [projects, setProjects] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invoiceResponse, clientResponse, projectResponse] = await Promise.all([
        invoiceService.getInvoices(),
        clientService.getClients(),
        projectService.getProjects(),
      ]);

      const clientMap = new Map<string, string>();
      clientResponse.data.forEach(client => clientMap.set(client.id, client.fullName));
      setClients(clientMap);

      const projectMap = new Map<string, string>();
      projectResponse.forEach(project => projectMap.set(project.id, project.name));
      setProjects(projectMap);

      setInvoices(invoiceResponse);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.deleteInvoice(invoiceId);
        fetchData(); // Refresh list after delete
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/finance/invoices/tambah">
          <Button>Add Invoice</Button>
        </Link>
      </div>
      
      {/* Invoice Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-100 dark:border-white/[0.05]">
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Number</th>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Client</th>
                <th className="py-3 px-6 text-left">Project</th>
                <th className="py-3 px-6 text-right">Total Amount</th>
                <th className="py-3 px-6 text-left">Due Date</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{invoice.number}</td>
                  <td className="py-3 px-6 text-left">{invoice.title}</td>
                  <td className="py-3 px-6 text-left">{clients.get(invoice.clientId) || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{invoice.projectId ? projects.get(invoice.projectId) || 'N/A' : '-'}</td>
                  <td className="py-3 px-6 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.totalAmount)}</td>
                  <td className="py-3 px-6 text-left">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center">
                    <Badge size="sm" color={invoice.status === 'PAID' ? 'success' : invoice.status === 'PENDING' ? 'warning' : 'error'}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                          <Link href={`/data-invoice/details-invoice/${invoice.id}`}><Button size="sm" variant="outline" className="mr-2">View</Button></Link>
                          <Link href={`/finance/invoices/edit/${invoice.id}`}><Button size="sm" variant="outline" className="mr-2">Edit</Button></Link>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(invoice.id)}>Delete</Button>
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
