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
import { paymentService } from "@/services/payment.service";
import { useUser } from "@/context/UserContext";

interface PreviewInvoiceProps {
  invoiceId: string;
}

export default function PreviewInvoice({ invoiceId }: PreviewInvoiceProps) {
  const router = useRouter();
  const { user } = useUser();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

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
          const getView = clonedDoc.defaultView || window;
          const createCtx = () => {
            const cnv = clonedDoc.createElement('canvas') as HTMLCanvasElement;
            return cnv.getContext('2d');
          };
          const ctx = createCtx();
          const normalizeColor = (value: string | null) => {
            if (!value) return '';
            try {
              if (ctx) {
                // Canvas normalizes any valid CSS color to rgb/rgba()
                (ctx as CanvasRenderingContext2D).fillStyle = value as unknown as string;
                const normalized = (ctx as CanvasRenderingContext2D).fillStyle as unknown as string;
                if (normalized && typeof normalized === 'string') return normalized;
              }
            } catch { }
            // Fallbacks for unsupported color spaces
            if (value.includes('oklab') || value.includes('oklch')) {
              // Sensible defaults
              if (value.includes(' / ') || value.includes('%')) return 'rgba(0,0,0,1)';
              return '#000000';
            }
            return value;
          };

          const all = clonedDoc.querySelectorAll('*');
          all.forEach((el) => {
            if (!(el instanceof clonedDoc.defaultView!.HTMLElement)) return;
            const cs = getView.getComputedStyle(el);

            const color = normalizeColor(cs.color);
            if (color) el.style.color = color;

            const bg = normalizeColor(cs.backgroundColor);
            if (bg) el.style.backgroundColor = bg;

            // Borders (all sides)
            const borderColor = normalizeColor(cs.borderColor);
            if (borderColor) el.style.borderColor = borderColor;
            const bt = normalizeColor(cs.borderTopColor);
            if (bt) el.style.borderTopColor = bt;
            const br = normalizeColor(cs.borderRightColor);
            if (br) el.style.borderRightColor = br;
            const bb = normalizeColor(cs.borderBottomColor);
            if (bb) el.style.borderBottomColor = bb;
            const bl = normalizeColor(cs.borderLeftColor);
            if (bl) el.style.borderLeftColor = bl;
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
  const amountPaid = invoice.amount || 0;
  const dueBalance = Math.max(finalTotal - amountPaid, 0);
  const isClient = user?.role === "CLIENT";
  const isPayable = isClient && dueBalance > 0 && (invoice.status?.toUpperCase?.() !== 'PAID');

  const handlePay = async () => {
    try {
      setIsPaying(true);

      // Create a manual payment record
      await paymentService.createManualPayment({
        invoiceId: invoice.id,
        amount: dueBalance,
        method: paymentMethod,
        reference: reference || undefined,
        notes: notes || undefined,
        paymentDate: new Date().toISOString()
      });

      // If payment proof is uploaded, handle it
      if (paymentProof) {
        // TODO: Implement file upload to your backend
        // This is a placeholder - you'll need to implement the actual file upload
        console.log('Payment proof to upload:', paymentProof);
      }

      alert('Pembayaran berhasil diajukan. Silakan tunggu konfirmasi admin.');
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Gagal memproses pembayaran';
      alert(msg);
    } finally {
      setIsPaying(false);
      setShowPaymentModal(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Invoice Preview</h1>
        <div className="flex gap-3">
          {isPayable && (
            <>
              <Button
                onClick={() => setShowPaymentModal(true)}
                disabled={isPaying}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bayar Sekarang
              </Button>

              {/* Payment Modal */}
              {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">Konfirmasi Pembayaran</h2>

                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Instruksi Pembayaran:</h3>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="font-medium">Bank Transfer</p>
                        <p>Bank: BCA (Bank Central Asia)</p>
                        <p>No. Rekening: 1234 5678 9012 3456</p>
                        <p>Atas Nama: PT. Nama Perusahaan Anda</p>
                        <p className="font-bold mt-2">Jumlah: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalAfterDiscount)}</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border rounded"
                          >
                            <option value="BANK_TRANSFER">Transfer Bank</option>
                            <option value="CASH">Tunai</option>
                            <option value="OTHER">Lainnya</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Nomor Referensi (opsional)</label>
                          <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="Contoh: 1234567890"
                            className="w-full p-2 border rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Catatan (opsional)</label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Tambahkan catatan jika diperlukan"
                            className="w-full p-2 border rounded"
                            rows={2}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Unggah Bukti Pembayaran</label>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowPaymentModal(false)}
                        disabled={isPaying}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handlePay}
                        disabled={isPaying}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isPaying ? 'Mengirim...' : 'Konfirmasi Pembayaran'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
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
              <span className={`px-2 py-1 rounded text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
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