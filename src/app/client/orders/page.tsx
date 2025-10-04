import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrderList from "@/components/order/OrderList";

export default function ClientOrdersPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Pesanan Saya" />
            <div className="mt-4">
                <OrderList basePath="/client/orders" />
            </div>
        </div>
    );
}


