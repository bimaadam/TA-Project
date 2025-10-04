'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { paymentService } from '@/services/payment.service';
import Button from '@/components/ui/button/Button';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface PaymentFormProps {
  invoiceId: string;
  amount: number;
  onSuccess?: () => void;
  onCancelAction?: () => void;
}

export default function PaymentForm({
  invoiceId,
  amount,
  onSuccess,
  onCancelAction
}: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    method: 'BANK_TRANSFER',
    reference: '',
    notes: '',
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProof(file);

      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!paymentProof) {
      toast.error('Harap unggah bukti pembayaran');
      return;
    }

    setLoading(true);
    try {
      // Note: The payment service currently doesn't support file uploads in createManualPayment
      // This would require a separate implementation for handling file uploads
      await paymentService.createManualPayment({
        invoiceId: invoiceId,
        amount: amount,
        method: form.method,
        reference: form.reference || undefined,
        notes: form.notes || undefined,
        // paymentProof would need to be handled separately if supported by the backend
      });

      toast.success('Pembayaran berhasil diajukan. Silakan tunggu konfirmasi admin.');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/payments');
      }
    } catch (error) {
      console.error('Gagal mengajukan pembayaran:', error);
      toast.error('Gagal mengajukan pembayaran. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Informasi Pembayaran</h2>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Pembayaran
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="text"
                value={new Intl.NumberFormat('id-ID').format(amount)}
                readOnly
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
              Metode Pembayaran
            </label>
            <select
              id="method"
              name="method"
              value={form.method}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="BANK_TRANSFER">Transfer Bank</option>
              <option value="CASH">Tunai</option>
              <option value="OTHER">Lainnya</option>
            </select>
          </div>

          {form.method === 'BANK_TRANSFER' && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Instruksi Transfer Bank</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Bank: BCA (Bank Central Asia)</p>
                <p>No. Rekening: 1234 5678 9012 3456</p>
                <p>Atas Nama: PT. Nama Perusahaan Anda</p>
                <p className="font-bold mt-2">
                  Jumlah: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Referensi
              <span className="text-gray-500 ml-1">(opsional)</span>
            </label>
            <input
              type="text"
              name="reference"
              id="reference"
              value={form.reference}
              onChange={handleChange}
              placeholder="Contoh: 1234567890"
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
              <span className="text-gray-500 ml-1">(opsional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tulis catatan tambahan jika ada"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unggah Bukti Pembayaran
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <div className="mt-2">
                    <div className="mx-auto h-32 w-auto flex items-center justify-center">
                      <Image src={previewUrl} width={128} height={128} alt="Preview bukti pembayaran" className="max-h-full max-w-full object-contain" />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{paymentProof?.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentProof(null);
                        setPreviewUrl(null);
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="payment-proof"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Unggah file</span>
                        <input
                          id="payment-proof"
                          name="payment-proof"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                          required
                        />
                      </label>
                      <p className="pl-1">atau drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF (maks. 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancelAction && (
          <button
            type="button"
            onClick={onCancelAction}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Batal
          </button>
        )}
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          loading={loading}
        >
          Ajukan Pembayaran
        </Button>
      </div>
    </form>
  );
}
