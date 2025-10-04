
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProjectList from "@/components/project/ProjectList";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Daftar Proyek Klien | Abyzain Jaya Teknika",
  description: "Daftar proyek yang terkait dengan klien.",
};

export default function ClientProjectsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daftar Proyek" />
      <ProjectList />
    </div>
  );
}
