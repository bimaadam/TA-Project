import ProjectDetailReport from "@/components/reports/ProjectDetailReport";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface ProjectDetailReportPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailReportPage({
    params,
}: ProjectDetailReportPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Laporan Detail Proyek" />
            <ComponentCard title="Detail Proyek">
                <ProjectDetailReport projectId={id} />
            </ComponentCard>
        </div>
    );
}
