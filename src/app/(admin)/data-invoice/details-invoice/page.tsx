import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PreviewInvoice from "@/components/data-invoice/PreviewInvoice";

export default function DetailInvoice() {
    return <div>
        <PageBreadcrumb pageTitle="Invoice Details" />
        <PreviewInvoice />
    </div>
}