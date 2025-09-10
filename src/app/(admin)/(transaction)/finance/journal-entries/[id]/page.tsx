import ViewJournalEntry from "@/components/journal/ViewJournalEntry";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default async function ViewJournalEntryPage({ params }: { params: { id: string } }) {
    const {id} = await params
    return (
        <div>
            <PageBreadcrumb pageTitle="Detail Entri Jurnal" />
            <ComponentCard title="Detail Entri Jurnal">
                <ViewJournalEntry entryId={id} />
            </ComponentCard>
        </div>
    );
}
