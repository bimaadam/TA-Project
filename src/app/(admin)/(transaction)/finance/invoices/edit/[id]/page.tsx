import EditInvoiceForm from "@/components/invoice/EditInvoiceForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default async function EditInvoicePage({ params }: {params : {id: string}} ) {
    const {id} = params
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Faktur" />
            <ComponentCard title="Formulir Edit Faktur">
                <EditInvoiceForm invoiceId={id} />
            </ComponentCard>
        </div>
    );
}
