import CreateProductForm from "@/components/product/CreateProductForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function TambahProdukPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Produk Baru" />
            <ComponentCard title="Formulir Produk">
                <CreateProductForm />
            </ComponentCard>
        </div>
    );
}
