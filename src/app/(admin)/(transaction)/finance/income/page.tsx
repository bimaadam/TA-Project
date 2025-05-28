import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Transaction from "@/components/transaction";

export default function FinancePageIncome() {
    return (
        <>
            <PageBreadcrumb pageTitle="Transaksi Masuk" />
            <ComponentCard title="Journal Entry:">
                <Transaction />
            </ComponentCard>
        </>
    )
}