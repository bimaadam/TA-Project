import { paymentService } from "@/services/payment.service";
import { notFound } from 'next/navigation';
import PaymentDetail from "@/components/payment/PaymentDetail";

export default async function PaymentDetailPage({ params }: { params: { id: string } }) {
  const payment = await paymentService.getPaymentById(params.id);

  if (!payment) {
    notFound();
  }
  return (
    <PaymentDetail paymentId={payment.id} showBackButton={true} />
  )
}
