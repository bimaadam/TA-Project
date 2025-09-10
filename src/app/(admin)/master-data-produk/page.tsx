import ProductList from "@/components/product/ProductList";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function MasterDataProdukPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Master Data Produk" />
            <ComponentCard title="Daftar Produk">
                <ProductList />
            </ComponentCard>
        </div>
    );
}
