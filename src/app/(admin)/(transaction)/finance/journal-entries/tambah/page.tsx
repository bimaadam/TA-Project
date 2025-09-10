import CreateJournalForm from "@/components/journal/CreateJournalForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function TambahEntriJurnalPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Entri Jurnal Baru" />
            <ComponentCard title="Formulir Entri Jurnal">
                <CreateJournalForm />
            </ComponentCard>
        </div>
    );
}
