import EditInvoiceForm from "@/components/invoice/EditInvoiceForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({
  params,
}: EditInvoicePageProps) {
  const { id } = await params;
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Faktur" />
      <ComponentCard title="Formulir Edit Faktur">
        <EditInvoiceForm invoiceId={id} />
      </ComponentCard>
    </div>
  );
}