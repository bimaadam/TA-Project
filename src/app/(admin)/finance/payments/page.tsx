'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, RefreshCw } from 'lucide-react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { paymentService } from "@/services/payment.service";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import PaymentList from '@/components/payment/PaymentList';

export default function PaymentsPage() {
  return (
    <><PageBreadcrumb pageTitle="Manajemen Pembayaran" /><h1 className="text-2xl font-bold text-gray-800 mt-2">Daftar Pembayaran</h1>
      <PaymentList />
    </>
  );
}
