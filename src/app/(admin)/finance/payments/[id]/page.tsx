import { paymentService } from "@/services/payment.service";
import { notFound } from 'next/navigation';
import PaymentDetail from "@/components/payment/PaymentDetail";

export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payment = await paymentService.getPaymentById(id);

  if (!payment) {
    notFound();
  }
  return (
    <PaymentDetail paymentId={payment.id} showBackButton={true} />
  )
}
