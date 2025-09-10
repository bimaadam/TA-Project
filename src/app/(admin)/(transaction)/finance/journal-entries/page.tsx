import JournalEntriesList from "@/components/journal/JournalEntriesList";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function JournalEntriesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Daftar Entri Jurnal" />
            <ComponentCard title="Entri Jurnal">
                <JournalEntriesList />
            </ComponentCard>
        </div>
    );
}
