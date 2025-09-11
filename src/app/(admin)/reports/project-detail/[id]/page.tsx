import ProjectDetailReport from "@/components/reports/ProjectDetailReport";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function ProjectDetailReportPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Laporan Detail Proyek" />
            <ComponentCard title="Detail Proyek">
                <ProjectDetailReport projectId={params.id} />
            </ComponentCard>
        </div>
    );
}
