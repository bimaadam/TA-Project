
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import JournalEntriesList from "@/components/journal/JournalEntriesList";

export default function JurnalPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Jurnal Umum" />
            <ComponentCard title="Daftar Entri Jurnal">
                <JournalEntriesList />
            </ComponentCard>
        </div>
    );
}
