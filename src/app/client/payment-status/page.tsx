import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Status Pembayaran Klien | Abyzain Jaya Teknika",
  description: "Ringkasan status pembayaran faktur klien.",
};

export default function ClientPaymentStatusPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Status Pembayaran" />
      <ComponentCard title="Ringkasan Status Pembayaran">
        <p>Di sini akan ditampilkan ringkasan status pembayaran faktur Anda.</p>
        {/* Anda bisa menambahkan komponen tabel atau grafik di sini */}
      </ComponentCard>
    </div>
  );
}
