import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import MAsterDataClient from "@/components/master-data/Master"

export default function MasterDataKlienPage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Master Data Client" />
            <ComponentCard title="Data Client">
                <MAsterDataClient />
            </ComponentCard>
        </div>
    )
}