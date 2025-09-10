import CreateProjectForm from "@/components/project/CreateProjectForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function TambahProyekPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Proyek Baru" />
            <ComponentCard title="Formulir Proyek">
                <CreateProjectForm />
            </ComponentCard>
        </div>
    );
}
