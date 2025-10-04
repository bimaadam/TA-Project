import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProjectReportTable from "@/components/tables/ProjectReport";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Laporan Proyek Klien | Abyzain Jaya Teknika",
  description: "Laporan detail proyek untuk klien.",
};

export default function ClientProjectReportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Laporan Proyek" />
      <ProjectReportTable />
    </div>
  );
}
