import ViewJournalEntry from "@/components/journal/ViewJournalEntry";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface ViewJournalEntryPageProps {
    params: Promise<{ id: string }>;
}

export default async function ViewJournalEntryPage({
    params,
}: ViewJournalEntryPageProps) {
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
