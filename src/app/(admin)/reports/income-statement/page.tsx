import IncomeStatement from "@/components/reports/IncomeStatement";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function IncomeStatementPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Laporan Laba Rugi" />
            <ComponentCard title="Laporan Laba Rugi">
                <IncomeStatement />
            </ComponentCard>
        </div>
    );
}
