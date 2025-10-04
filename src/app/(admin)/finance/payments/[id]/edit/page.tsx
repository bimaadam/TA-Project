import { paymentService } from "@/services/payment.service";
import EditPaymentPageClient from './EditPaymentPageClient';

export default async function EditPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let paymentData = null;
  let error = '';

  try {
    const data = await paymentService.getPaymentById(id);
    paymentData = {
      ...data,
      paymentDate: data.paymentDate || new Date().toISOString()
    };
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Gagal memuat data pembayaran';
  }

  return <EditPaymentPageClient paymentData={paymentData} error={error} />;
}
