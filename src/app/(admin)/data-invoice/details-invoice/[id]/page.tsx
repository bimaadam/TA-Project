import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PreviewInvoice from "@/components/data-invoice/PreviewInvoice";

interface DetailInvoicePageProps {
    params: Promise<{ id: string }>;
}

export default async function DetailInvoice({
    params,
}: DetailInvoicePageProps) {
    const { id } = await params;
    return <div>
        <PageBreadcrumb pageTitle="Invoice Details" />
        <PreviewInvoice invoiceId={id} />
    </div>
}
