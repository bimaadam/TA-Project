import EditProductForm from "@/components/product/EditProductForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface EditProdukPageProps {
    params: Promise<{ id: string }>;
} 

export default async function EditProdukPage({
    params, }: EditProdukPageProps) {
    const { id } = await params;
    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Produk" />
            <ComponentCard title="Formulir Edit Produk">
                <EditProductForm productId={id} />
            </ComponentCard>
        </div>
    );
}
