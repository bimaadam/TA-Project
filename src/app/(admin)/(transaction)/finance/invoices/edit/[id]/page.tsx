import EditInvoiceForm from "@/components/invoice/EditInvoiceForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function EditInvoicePage({ params }: { params: { id: string } }) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Faktur" />
            <ComponentCard title="Formulir Edit Faktur">
                <EditInvoiceForm invoiceId={params.id} />
            </ComponentCard>
        </div>
    );
}
