import EditProductForm from "@/components/product/EditProductForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function EditProdukPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Produk" />
            <ComponentCard title="Formulir Edit Produk">
                <EditProductForm productId={params.id} />
            </ComponentCard>
        </div>
    );
}
