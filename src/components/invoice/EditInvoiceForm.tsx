"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { invoiceService, UpdateInvoicePayload, InvoiceItem } from '@/services/invoice.service';
import { clientService, Client } from '@/services/client.service';
import { projectService, Project } from '@/services/project.service';
import { productService, Product } from '@/services/product.service';
import Button from '@/components/ui/button/Button';

interface EditInvoiceFormProps {
  invoiceId: string;
}

// Extend InvoiceItem for form-specific needs
type InvoiceItemForm = InvoiceItem

// Type for invoice item field names
type InvoiceItemField = keyof InvoiceItemForm;

// Type for form input values
type FormInputValue = string | number;

// Default invoice item for new items
const defaultInvoiceItem: Partial<InvoiceItemForm> = { 
  description: '', 
  quantity: 1, 
  unitPrice: 0, 
  productId: '' 
};

export default function EditInvoiceForm({ invoiceId }: EditInvoiceFormProps) {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<UpdateInvoicePayload | null>(null);
  const [items, setItems] = useState<InvoiceItemForm[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const [invoiceData, clientsRes, projectsRes, productsRes] = await Promise.all([
          invoiceService.getInvoiceById(invoiceId),
          clientService.getClients(),
          projectService.getProjects(),
          productService.getProducts(),
        ]);

        setClients(clientsRes.data);
        setProjects(projectsRes);
        setProducts(productsRes);

        setFormData({
          title: invoiceData.title,
          dueDate: new Date(invoiceData.dueDate).toISOString().split('T')[0],
          status: invoiceData.status,
          taxRate: invoiceData.taxRate,
          discount: invoiceData.discount,
          projectId: invoiceData.projectId || '',
          clientId: invoiceData.clientId,
          notes: invoiceData.notes || '',
          terms: invoiceData.terms || '',
        });
        setItems(invoiceData.invoiceItems);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load invoice data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invoiceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { 
      ...prev, 
      [name]: name === 'taxRate' || name === 'discount' ? Number(value) : value 
    } : null);
  };

  const handleItemChange = (index: number, field: InvoiceItemField, value: FormInputValue): void => {
    const newItems = [...items];
    const item = newItems[index];
    
    if (item) {
      // Type-safe assignment based on field type
      switch (field) {
        case 'description':
        case 'productId':
          (item[field] as string) = value as string;
          break;
        case 'quantity':
        case 'unitPrice':
          (item[field] as number) = value as number;
          break;
        case 'id':
          // Handle ID field if needed (usually readonly)
          break;
        default:
          // Handle any other fields that might exist in InvoiceItem
          (item[field as keyof InvoiceItemForm] as FormInputValue) = value;
          break;
      }
      
      setItems(newItems);
    }
  };

  const handleQuantityChange = (index: number, value: string): void => {
    const parsedValue = parseInt(value) || 0;
    handleItemChange(index, 'quantity', parsedValue);
  };

  const handleUnitPriceChange = (index: number, value: string): void => {
    const parsedValue = parseFloat(value) || 0;
    handleItemChange(index, 'unitPrice', parsedValue);
  };

  const addItem = (): void => {
    setItems([...items, defaultInvoiceItem as InvoiceItemForm]);
  };

  const removeItem = (index: number): void => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    setError(null);

    try {
      const payload: UpdateInvoicePayload = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
        items: items.map(item => ({ 
          ...item, 
          quantity: Number(item.quantity), 
          unitPrice: Number(item.unitPrice) 
        })),
      };
      
      await invoiceService.updateInvoice(invoiceId, payload);
      alert('Invoice updated successfully!');
      router.push('/finance/invoices');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading invoice data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!formData) {
    return <div>Invoice not found.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Header Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Title</label>
          <input 
            name="title" 
            value={formData.title || ''} 
            onChange={handleChange} 
            placeholder="Invoice Title" 
            className="w-full p-2 border rounded dark:bg-gray-700" 
            required 
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Due Date</label>
          <input 
            name="dueDate" 
            type="date" 
            value={formData.dueDate || ''} 
            onChange={handleChange} 
            className="w-full p-2 border rounded dark:bg-gray-700" 
            required 
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Client</label>
          <select 
            name="clientId" 
            value={formData.clientId || ''} 
            onChange={handleChange} 
            className="w-full p-2 border rounded dark:bg-gray-700" 
            required
          >
            <option value="" disabled>Select a Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.fullName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Project (Optional)</label>
          <select 
            name="projectId" 
            value={formData.projectId || ''} 
            onChange={handleChange} 
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="">No Associated Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Tax Rate (%)</label>
          <input 
            name="taxRate" 
            type="number" 
            step="0.01" 
            value={formData.taxRate || 0} 
            onChange={handleChange} 
            placeholder="0.11" 
            className="w-full p-2 border rounded dark:bg-gray-700" 
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Discount</label>
          <input 
            name="discount" 
            type="number" 
            value={formData.discount || 0} 
            onChange={handleChange} 
            placeholder="0" 
            className="w-full p-2 border rounded dark:bg-gray-700" 
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Status</label>
          <select 
            name="status" 
            value={formData.status || ''} 
            onChange={handleChange} 
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="PENDING">Pending</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-3">Invoice Items</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="col-span-4">
              <label className="block mb-2 text-sm font-medium">Description</label>
              <input 
                name="description" 
                value={item.description || ''} 
                onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                placeholder="Item Description" 
                className="w-full p-2 border rounded dark:bg-gray-700" 
                required 
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium">Quantity</label>
              <input 
                name="quantity" 
                type="number" 
                value={item.quantity || 0} 
                onChange={(e) => handleQuantityChange(index, e.target.value)} 
                placeholder="1" 
                className="w-full p-2 border rounded dark:bg-gray-700" 
                required 
              />
            </div>
            <div className="col-span-3">
              <label className="block mb-2 text-sm font-medium">Unit Price</label>
              <input 
                name="unitPrice" 
                type="number" 
                value={item.unitPrice || 0} 
                onChange={(e) => handleUnitPriceChange(index, e.target.value)} 
                placeholder="0" 
                className="w-full p-2 border rounded dark:bg-gray-700" 
                required 
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium">Product (Optional)</label>
              <select 
                name="productId" 
                value={item.productId || ''} 
                onChange={(e) => handleItemChange(index, 'productId', e.target.value)} 
                className="w-full p-2 border rounded dark:bg-gray-700"
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1 flex justify-end">
              <Button 
                type="button" 
                onClick={() => removeItem(index)} 
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button 
        type="button" 
        onClick={addItem} 
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Add Item
      </Button>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button 
          type="button" 
          onClick={() => router.back()} 
          className="bg-gray-300 hover:bg-gray-400 text-black"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Invoice'}
        </Button>
      </div>
    </form>
  );
}