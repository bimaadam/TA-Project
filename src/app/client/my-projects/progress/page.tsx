import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProjectReportTable from "@/components/tables/ProjectReport";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Progress Proyek Klien | Abyzain Jaya Teknika",
  description: "Laporan progres proyek untuk klien.",
};

export default function ClientProjectProgressPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Progress Proyek" />
      <ProjectReportTable />
    </div>
  );
}
