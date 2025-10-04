'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paymentService } from "@/services/payment.service";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function EditPaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [payment, setPayment] = useState({
    id: '',
    amount: 0,
    method: '',
    status: 'PENDING',
    reference: '',
    notes: '',
    paymentDate: new Date().toISOString(),
    invoiceId: '',
    proofUrl: ''
  });

  const statusOptions = [
    { value: 'PENDING', label: 'Menunggu Konfirmasi' },
    { value: 'COMPLETED', label: 'Lunas' },
    { value: 'FAILED', label: 'Gagal' },
    { value: 'REFUNDED', label: 'Dikembalikan' },
    { value: 'PARTIALLY_PAID', label: 'Dibayar Sebagian' },
  ];

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const data = await paymentService.getPaymentById(params.id);
        setPayment({
          ...data,
          paymentDate: data.paymentDate || new Date().toISOString()
        });
      } catch (err) {
        setError('Gagal memuat data pembayaran');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await paymentService.update(payment.id, {
        status: payment.status,
        notes: payment.notes,
        reference: payment.reference || undefined,
      });
      
      router.push(`/admin/payments/${payment.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui status pembayaran');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Kembali ke Detail Pembayaran
        </button>
        <h1 className="text-2xl font-bold">Ubah Status Pembayaran</h1>
        <p className="text-gray-600 mt-1">ID: {payment.id}</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Informasi Pembayaran
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Jumlah
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="amount"
                  value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount)}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                Metode Pembayaran
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="method"
                  value={payment.method === 'BANK_TRANSFER' ? 'Transfer Bank' : 'Tunai'}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status Pembayaran <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={payment.status}
                onChange={(e) => setPayment({ ...payment, status: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                Tanggal Pembayaran
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="paymentDate"
                  value={format(new Date(payment.paymentDate), 'EEEE, d MMMM yyyy HH:mm', { locale: id })}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
              Nomor Referensi
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="reference"
                value={payment.reference || ''}
                onChange={(e) => setPayment({ ...payment, reference: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Contoh: 1234567890"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Catatan
            </label>
            <div className="mt-1">
              <textarea
                id="notes"
                rows={4}
                value={payment.notes || ''}
                onChange={(e) => setPayment({ ...payment, notes: e.target.value })}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Tambahkan catatan jika diperlukan"
              />
            </div>
          </div>

          {payment.proofUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bukti Pembayaran
              </label>
              <div className="mt-1">
                <a 
                  href={payment.proofUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Lihat Bukti Pembayaran
                </a>
              </div>
            </div>
          )}

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
