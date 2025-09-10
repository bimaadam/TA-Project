import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PreviewInvoice from "@/components/data-invoice/PreviewInvoice";

export default function DetailInvoice({ params }: { params: { id: string } }) {
    return <div>
        <PageBreadcrumb pageTitle="Invoice Details" />
        <PreviewInvoice invoiceId={params.id} />
    </div>
}
