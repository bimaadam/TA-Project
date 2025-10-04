"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaymentForm from "@/components/payment/PaymentForm";

export default function CreatePaymentPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Pembayaran" />
            <PaymentForm invoiceId={""} amount={0} onSuccess={() => { }} onCancel={() => { }} />
        </div>
    )
}


