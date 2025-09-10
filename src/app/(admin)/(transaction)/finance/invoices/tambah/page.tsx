import CreateInvoiceForm from "@/components/invoice/CreateInvoiceForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function TambahInvoicePage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Faktur Baru" />
            <ComponentCard title="Formulir Faktur">
                <CreateInvoiceForm />
            </ComponentCard>
        </div>
    );
}
