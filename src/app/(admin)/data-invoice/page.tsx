import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Invoice from "@/components/data-invoice/Invoice"
import React from "react";

export default function DataInvoicePage() {
    return (
        <div>
            <PageBreadcrumb pageTitle="Data Invoice" />
            <ComponentCard title="Invoice">
                <Invoice />
            </ComponentCard>
        </div>
    )
}