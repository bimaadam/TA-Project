import CreateExpenseForm from "@/components/expense/CreateExpenseForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function TambahPengeluaranPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Pengeluaran Baru" />
            <ComponentCard title="Formulir Pengeluaran">
                <CreateExpenseForm />
            </ComponentCard>
        </div>
    );
}
