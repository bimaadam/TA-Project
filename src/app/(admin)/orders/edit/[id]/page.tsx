import EditOrderForm from "@/components/order/EditOrderForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Job Order" />
            <ComponentCard title="Formulir Edit Job Order">
                <EditOrderForm orderId={id} />
            </ComponentCard>
        </div>
    );
}
