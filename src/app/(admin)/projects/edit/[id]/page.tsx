import EditProjectForm from "@/components/project/EditProjectForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default async function EditProyekPage({ params }: { params: { id: string } }) {
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
