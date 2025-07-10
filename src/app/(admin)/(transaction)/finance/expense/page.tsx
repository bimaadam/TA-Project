import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ExpenseTransaction from "@/components/expense";

export default function ExpensePage() {
    return (
        <>
            <PageBreadcrumb pageTitle="Transaksi Keluar" />
            <ExpenseTransaction />
        </>
    )
}