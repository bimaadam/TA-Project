"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { invoiceService, Invoice } from '@/services/invoice.service';
import { clientService, Client } from '@/services/client.service';
import { projectService, Project } from '@/services/project.service';
import Button from '@/components/ui/button/Button';

interface PreviewInvoiceProps {
  invoiceId: string;
}

export default function PreviewInvoice({ invoiceId }: PreviewInvoiceProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const invoiceData = await invoiceService.getInvoiceById(invoiceId);
        setInvoice(invoiceData);

        // Fetch related client and project data
        const [clientData, projectData] = await Promise.all([
          clientService.getClientById(invoiceData.clientId),
          invoiceData.projectId ? projectService.getProjectById(invoiceData.projectId) : Promise.resolve(null),
        ]);
        setClient(clientData);
        setProject(projectData);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch invoice details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invoiceId]);

  if (loading) {
    return <div>Loading invoice details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!invoice) {
    return <div>Invoice not found.</div>;
  }

  const subtotal = invoice.invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalAfterDiscount = subtotal - invoice.discount;
  const taxAmount = totalAfterDiscount * invoice.taxRate;
  const finalTotal = totalAfterDiscount + taxAmount;

  return (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
      <div className="sm:w-11/12 lg:w-3/4 mx-auto">
        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-x-3 mb-4">
          <Button onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-black">Back</Button>
          {/* You can add Print/PDF buttons here later */}
        </div>

        {/* Card */}
        <div className="flex flex-col p-4 sm:p-10 bg-auto shadow-sm shadow-gray-500 dark:shadow-white rounded-4xl">
          {/* Header Grid */}
          <div className="flex justify-between">
            <div>
              <Image src="/images/logo/AJT.png" alt="Company Logo" width={100} height={100} />
              <h1 className="mt-2 text-lg md:text-xl font-semibold text-red-600 dark:text-white">CV Abyzain Jaya Teknika</h1>
              <address className="mt-2 not-italic text-gray-800 dark:text-neutral-200">
                No. 45<br />
                Jl. Raya<br />
                Cibarusah, Bekasi<br />
                Indonesia<br />
              </address>
            </div>
            <div className="text-end">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200">Invoice #{invoice.number}</h2>
              <span className="mt-1 block text-gray-500 dark:text-neutral-500">{invoice.id}</span>
            </div>
          </div>

          {/* Client & Dates Grid */}
          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Bill to:</h3>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">{client?.fullName || 'N/A'}</h3>
              {/* You might want to add client address here if available */}
            </div>
            <div className="sm:text-end space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Invoice Date:</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Date(invoice.issuedDate).toLocaleDateString()}</dd>
                </dl>
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Due Date:</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Date(invoice.dueDate).toLocaleDateString()}</dd>
                </dl>
                {invoice.project && (
                  <dl className="grid sm:grid-cols-5 gap-x-3">
                    <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Project:</dt>
                    <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{project?.name || 'N/A'}</dd>
                  </dl>
                )}
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Status:</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{invoice.status}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mt-6">
            <div className="border border-gray-200 p-4 rounded-lg space-y-4 dark:border-neutral-700">
              <div className="hidden sm:grid sm:grid-cols-5">
                <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Item</div>
                <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Qty</div>
                <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Unit Price</div>
                <div className="text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Amount</div>
              </div>
              <div className="hidden sm:block border-b border-gray-200 dark:border-neutral-700"></div>

              {invoice.invoiceItems.map((item, index) => (
                <div key={item.id || index} className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <div className="col-span-full sm:col-span-2">
                    <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Item</h5>
                    <p className="font-medium text-gray-800 dark:text-neutral-200">{item.description}</p>
                  </div>
                  <div>
                    <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Qty</h5>
                    <p className="text-gray-800 dark:text-neutral-200">{item.quantity}</p>
                  </div>
                  <div>
                    <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Unit Price</h5>
                    <p className="text-gray-800 dark:text-neutral-200">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.unitPrice)}</p>
                  </div>
                  <div>
                    <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Amount</h5>
                    <p className="sm:text-end text-gray-800 dark:text-neutral-200">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.total || (item.quantity * item.unitPrice))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mt-8 flex sm:justify-end">
            <div className="w-full max-w-2xl sm:text-end space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Subtotal:</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subtotal)}</dd>
                </dl>
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Discount:</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.discount)}</dd>
                </dl>
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Tax ({invoice.taxRate * 100}%):</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(taxAmount)}</dd>
                </dl>
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Total Amount:</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(finalTotal)}</dd>
                </dl>
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Amount Paid:</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.amount)}</dd>
                </dl>
                <dl className="grid sm:grid-cols-5 gap-x-3">
                  <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Due Balance:</dt>
                  <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(invoice.totalAmount - invoice.amount)}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Thank you!</h4>
            <p className="text-gray-500 dark:text-neutral-500">If you have any questions concerning this invoice, use the following contact information:</p>
            <div className="mt-2">
              <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">abyzainjayateknika.my.id</p>
              <p className="block text-sm font-medium text-gray-800 dark:text-neutral-200">+62 896-63-164-143</p>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500 dark:text-neutral-500">
            © {new Date().getFullYear()} Abyzain Jaya Teknika
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-x-3">
          <a className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
            Invoice PDF
          </a>
          <a className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href="#">
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
            Print
          </a>
        </div>
      </div>
    </div>
  );
}