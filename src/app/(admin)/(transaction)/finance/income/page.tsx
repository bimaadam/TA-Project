import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Transaction from "@/components/transaction";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transaksi | Admin Abyzain Jaya Teknika",
    description: "Menu Transaksi"
}

export default function FinancePageIncome() {
    return (
        <>
            <PageBreadcrumb pageTitle="Transaksi Msuk" />
            <Transaction />
        </>
    )
}