import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaymentList from "@/components/transaction";

export default function ClientPaymentsPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Pembayaran Saya" />
            <div className="mt-4">
                <PaymentList canDelete={false} />
            </div>
        </div>
    );
}


