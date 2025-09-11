import IncomeList from "@/components/income/IncomeList";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function PemasukanPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Daftar Pemasukan" />
            <ComponentCard title="Pemasukan">
                <IncomeList />
            </ComponentCard>
        </div>
    );
}
