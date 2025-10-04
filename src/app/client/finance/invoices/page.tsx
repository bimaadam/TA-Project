import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InvoiceList from "@/components/invoice/InvoiceList";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Daftar Faktur Klien | Abyzain Jaya Teknika",
  description: "Daftar faktur yang terkait dengan klien.",
};

export default function ClientInvoicesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Faktur" />
      <InvoiceList />
    </div>
  );
}
