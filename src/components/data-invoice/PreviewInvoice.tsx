"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { invoiceService, Invoice } from "@/services/invoice.service";
import { clientService, Client } from "@/services/client.service";
import { projectService, Project } from "@/services/project.service";
import Button from "@/components/ui/button/Button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [isExporting, setIsExporting] = useState(false);

  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const invoiceData = await invoiceService.getInvoiceById(invoiceId);
        setInvoice(invoiceData);

        const [clientData, projectData] = await Promise.all([
          clientService.getClientById(invoiceData.clientId),
          invoiceData.projectId
            ? projectService.getProjectById(invoiceData.projectId)
            : Promise.resolve(null),
        ]);
        setClient(clientData);
        setProject(projectData);
      } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch Invoice data');
      }
    } finally {
      setLoading(false);
    }
  };

    fetchData();
  }, [invoiceId]);

  // Enhanced PDF Export with better color handling
  const exportPDF = async () => {
    if (!invoiceRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
  scale: 2,
  useCORS: true,
  allowTaint: true,
  backgroundColor: '#ffffff',
  onclone: (clonedDoc) => {
    const allElements = clonedDoc.querySelectorAll('*');
    allElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(element);

        if (
          computedStyle.color &&
          (computedStyle.color.includes('oklab') || computedStyle.color.includes('oklch'))
        ) {
          element.style.color = '#000000';
        }

        if (
          computedStyle.backgroundColor &&
          (computedStyle.backgroundColor.includes('oklab') || computedStyle.backgroundColor.includes('oklch'))
        ) {
          element.style.backgroundColor = '#ffffff';
        }

        if (
          computedStyle.borderColor &&
          (computedStyle.borderColor.includes('oklab') || computedStyle.borderColor.includes('oklch'))
        ) {
          element.style.borderColor = '#e5e7eb';
        }
      }
    });
  },
});


      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Handle multiple pages if content is too long
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const pages = Math.ceil(pdfHeight / pdf.internal.pageSize.getHeight());
        for (let i = 0; i < pages; i++) {
          if (i > 0) pdf.addPage();
          const yOffset = -i * pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Invoice-${invoice?.number || 'Unknown'}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!invoice || !client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">Invoice or client data not found.</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const subtotal = invoice.invoiceItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalAfterDiscount = subtotal - (invoice.discount || 0);
  const taxAmount = totalAfterDiscount * (invoice.taxRate || 0);
  const finalTotal = totalAfterDiscount + taxAmount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Invoice Preview</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-lg transition-colors"
          >
            Back
          </Button>
          <Button
            onClick={exportPDF}
            disabled={isExporting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      {/* Invoice Container */}
      <div 
        ref={invoiceRef}
        className="bg-white border border-gray-200 rounded-lg shadow-lg p-8"
        style={{ backgroundColor: '#ffffff' }} // Explicit background for PDF
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Image 
              src="/images/logo/AJT.png" 
              alt="Company Logo" 
              width={120} 
              height={120}
              className="mb-4"
            />
            <h1 className="text-xl font-bold text-red-600 mb-2">
              CV Abyzain Jaya Teknika
            </h1>
            <address className="text-gray-600 not-italic leading-relaxed">
              No. 45<br />
              Jl. Raya<br />
              Cibarusah, Bekasi<br />
              Indonesia<br />
            </address>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Invoice #{invoice.number}
            </h2>
            <p className="text-gray-500 text-sm">ID: {invoice.id}</p>
          </div>
        </div>

        {/* Client & Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bill To:</h3>
            <div className="text-gray-600">
              <p className="font-medium text-gray-800">{client.fullName}</p>
              {client.email && <p>{client.email}</p>}
              {client.phone && <p>{client.phone}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-800">Invoice Date:</span>
              <span className="text-gray-600">
                {new Date(invoice.issuedDate).toLocaleDateString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-800">Due Date:</span>
              <span className="text-gray-600">
                {new Date(invoice.dueDate).toLocaleDateString('id-ID')}
              </span>
            </div>
            {project && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Project:</span>
                <span className="text-gray-600">{project.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium text-gray-800">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {invoice.status?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="mb-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 grid grid-cols-12 gap-4 p-4 font-medium text-gray-700">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            
            {/* Table Body */}
            {invoice.invoiceItems.map((item, index) => (
              <div key={item.id || index} className="grid grid-cols-12 gap-4 p-4 border-t border-gray-200">
                <div className="col-span-6">
                  <p className="font-medium text-gray-800">{item.description}</p>
                </div>
                <div className="col-span-2 text-center text-gray-600">
                  {item.quantity}
                </div>
                <div className="col-span-2 text-center text-gray-600">
                  {formatCurrency(item.unitPrice)}
                </div>
                <div className="col-span-2 text-right text-gray-800 font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-800 font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Discount:</span>
                <span className="text-gray-800 font-medium">-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            {invoice.taxRate > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Tax ({(invoice.taxRate * 100).toFixed(0)}%):</span>
                <span className="text-gray-800 font-medium">{formatCurrency(taxAmount)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between py-1">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-lg font-bold text-gray-800">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
            {invoice.amount > 0 && (
              <>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-green-600 font-medium">{formatCurrency(invoice.amount)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Due Balance:</span>
                  <span className="text-red-600 font-medium">{formatCurrency(finalTotal - invoice.amount)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Thank You!</h4>
          <p className="text-gray-600 mb-4">
            If you have any questions concerning this invoice, please contact us:
          </p>
          <div className="text-gray-600 space-y-1">
            <p><strong>Website:</strong> abyzainjayateknika.my.id</p>
            <p><strong>Phone:</strong> +62 896-63-164-143</p>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            © {new Date().getFullYear()} Abyzain Jaya Teknika. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}