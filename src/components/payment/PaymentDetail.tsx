'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paymentService } from '@/services/payment.service';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';

interface PaymentDetailProps {
  paymentId: string;
  showBackButton?: boolean;
}

export default function PaymentDetail({ paymentId, showBackButton = true }: PaymentDetailProps) {
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getPaymentById(paymentId);
        setPayment(data);
      } catch (err) {
        console.error('Gagal memuat detail pembayaran:', err);
        setError('Gagal memuat detail pembayaran. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      loadPayment();
    }
  }, [paymentId]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
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

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER':
        return 'Transfer Bank';
      case 'CASH':
        return 'Tunai';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Memuat detail pembayaran...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Pembayaran tidak ditemukan</h3>
        <p className="mt-1 text-sm text-gray-500">Tidak dapat menemukan detail pembayaran yang diminta.</p>
        <div className="mt-6">
          <Button
            onClick={() => router.push('/payments')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Kembali ke Daftar Pembayaran
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Detail Pembayaran
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              ID: {payment.id}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {getStatusBadge(payment.status)}
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Jumlah</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount)}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Metode Pembayaran</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {getMethodLabel(payment.method)}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Tanggal Pembayaran</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {format(new Date(payment.paymentDate), 'EEEE, d MMMM yyyy HH:mm', { locale: id })}
            </dd>
          </div>
          {payment.reference && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nomor Referensi</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {payment.reference}
              </dd>
            </div>
          )}
          {payment.invoiceId && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Terkait Invoice</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <Link 
                  href={`/invoices/${payment.invoiceId}`}
                  className="text-blue-600 hover:underline"
                >
                  Lihat Invoice #{payment.invoiceId.substring(0, 8)}...
                </Link>
              </dd>
            </div>
          )}
          {payment.notes && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Catatan</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {payment.notes}
              </dd>
            </div>
          )}
          {payment.paymentProofUrl && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Bukti Pembayaran</dt>
              <dd className="mt-2">
                <a 
                  href={payment.paymentProofUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <div className="flex items-center text-blue-600 hover:text-blue-800">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>Lihat Bukti Pembayaran</span>
                  </div>
                </a>
              </dd>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
        <div className="flex justify-end space-x-3">
          {showBackButton && (
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Kembali
            </button>
          )}
          <Button
            onClick={() => router.push(`/payments`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Lihat Semua Pembayaran
          </Button>
        </div>
      </div>
    </div>
  );
}
