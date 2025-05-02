import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProjectReportTable from "@/components/tables/ProjectReport";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Project Report | Abyzain Jaya Teknika",
    description: "Abyzain Jaya Teknika",
};

export default function ProjectReportPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Project Report" />
            <ComponentCard title="Laporan Proyek" >
                <ProjectReportTable />
            </ComponentCard>
        </div>
    );
}
