import InvoiceList from "@/components/invoice/InvoiceList";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function InvoicesPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Daftar Faktur" />
            <ComponentCard title="Faktur">
                <InvoiceList />
            </ComponentCard>
        </div>
    );
}
