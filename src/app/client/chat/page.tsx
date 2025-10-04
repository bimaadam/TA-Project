import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PesanChat from "@/components/Message";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Pesan Klien | Abyzain Jaya Teknika",
  description: "Halaman pesan untuk komunikasi klien.",
};

export default function ClientChatPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pesan Saya" />
      <PesanChat />
    </div>
  );
}
