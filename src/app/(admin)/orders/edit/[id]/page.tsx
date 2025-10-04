import EditOrderForm from "@/components/order/EditOrderForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function EditOrderPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Job Order" />
            <ComponentCard title="Formulir Edit Job Order">
                <EditOrderForm orderId={params.id} />
            </ComponentCard>
        </div>
    );
}
