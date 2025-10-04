'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaymentList from '@/components/payment/PaymentList';

export default function PaymentsPage() {
  return (
    <><PageBreadcrumb pageTitle="Manajemen Pembayaran" /><h1 className="text-2xl font-bold text-gray-800 mt-2">Daftar Pembayaran</h1>
      <PaymentList />
    </>
  );
}
