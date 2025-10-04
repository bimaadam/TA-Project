import OrderList from "@/components/order/OrderList";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function OrdersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Daftar Job Order" />
            <ComponentCard title="Job Order">
                <OrderList />
            </ComponentCard>
        </div>
    );
}
