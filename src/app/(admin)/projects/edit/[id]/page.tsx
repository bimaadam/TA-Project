import EditProjectForm from "@/components/project/EditProjectForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface EditProyekPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProyekPage({
    params, }: EditProyekPageProps) { 
    const { id } = await params
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Proyek" />
            <ComponentCard title="Formulir Edit Proyek">
                <EditProjectForm projectId={id} />
            </ComponentCard>
        </div>
    );
}
