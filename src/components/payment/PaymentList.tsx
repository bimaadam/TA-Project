'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, RefreshCw, Trash2 } from 'lucide-react';
import { paymentService } from '@/services/payment.service';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Button from '../ui/button/Button';

interface PaymentListProps {
  invoiceId?: string;
  showInvoiceLink?: boolean;
  canDelete?: boolean;
}

export default function PaymentList({ invoiceId, showInvoiceLink = false, canDelete = true }: PaymentListProps) {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPayments = async () => {
    try {
      setLoading(true);
      let data;
      if (invoiceId) {
        data = await paymentService.getPaymentById(invoiceId);
      } else {
        data = await paymentService.listPayments();
      }
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Gagal memuat pembayaran:', error);
      toast.error('Gagal memuat data pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pembayaran ini?')) {
      return;
    }

    try {
      await paymentService.remove(paymentId);
      toast.success('Pembayaran berhasil dihapus');
      // Refresh the payments list after deletion
      await loadPayments();
    } catch (error) {
      console.error('Gagal menghapus pembayaran:', error);
      toast.error('Gagal menghapus pembayaran');
    }
  };

  useEffect(() => {
    loadPayments();
  }, [invoiceId]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'COMPLETED':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Lunas</span>;
      case 'PENDING':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Menunggu Konfirmasi</span>;
      case 'FAILED':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Gagal</span>;
      case 'REFUNDED':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Dikembalikan</span>;
      case 'PARTIALLY_PAID':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Dibayar Sebagian</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const getMethodBadge = (method: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded";
    switch (method) {
      case 'BANK_TRANSFER':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Transfer Bank</span>;
      case 'CASH':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Tunai</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{method}</span>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payment.id.toLowerCase().includes(searchLower) ||
      payment.reference?.toLowerCase().includes(searchLower) ||
      payment.notes?.toLowerCase().includes(searchLower) ||
      payment.amount.toString().includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Memuat data pembayaran...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari pembayaran..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={loadPayments}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Segarkan
          </button>
          <Button onClick={() => router.push('/finance/payments/tambah')} >Tambah Pembayaran</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              {showInvoiceLink && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.id.substring(0, 8)}...
                  </td>
                  {showInvoiceLink && payment.invoiceId && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={`/invoices/${payment.invoiceId}`}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lihat Invoice
                      </a>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getMethodBadge(payment.method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(payment.paymentDate), 'dd MMM yyyy HH:mm', { locale: id })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href={`/finance/payments/${payment.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Detail
                    </a>
                  </td>
                  {canDelete && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </td>
                  )}

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showInvoiceLink ? 7 : 6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm ? 'Tidak ada pembayaran yang cocok dengan pencarian' : 'Belum ada data pembayaran'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
