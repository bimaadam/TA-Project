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
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full max-w-[630px] text-center">
                    <ComponentCard title="Laporan Proyek" >
                        <ProjectReportTable />
                    </ComponentCard>
                </div>
            </div>
        </div>
    );
}
