import CreateOrderForm from "@/components/order/CreateOrderForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function TambahOrderPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Job Order Baru" />
            <ComponentCard title="Formulir Job Order">
                <CreateOrderForm />
            </ComponentCard>
        </div>
    );
}
