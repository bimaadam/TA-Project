import BalanceSheet from "@/components/reports/BalanceSheet";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function BalanceSheetPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Laporan Neraca" />
            <ComponentCard title="Laporan Neraca">
                <BalanceSheet />
            </ComponentCard>
        </div>
    );
}
