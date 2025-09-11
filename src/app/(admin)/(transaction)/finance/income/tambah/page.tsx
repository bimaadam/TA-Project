import CreateIncomeForm from "@/components/income/CreateIncomeForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function TambahPemasukanPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Pemasukan Baru" />
            <ComponentCard title="Formulir Pemasukan">
                <CreateIncomeForm />
            </ComponentCard>
        </div>
    );
}
