"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { invoiceService, CreateInvoicePayload } from '@/services/invoice.service';
import { clientService, Client } from '@/services/client.service';
import { projectService, Project } from '@/services/project.service';
import { productService, Product } from '@/services/product.service';
import Button from '@/components/ui/button/Button';

interface InvoiceItemForm {
  description: string;
  quantity: number;
  unitPrice: number;
  productId?: string;
}

// Type for form data without items
type FormDataWithoutItems = Omit<CreateInvoicePayload, 'items'>;

// Type for handleItemChange field parameter
type InvoiceItemField = keyof InvoiceItemForm;

// Type for form input values
type FormInputValue = string | number;

const initialInvoiceItem: InvoiceItemForm = { 
  description: '', 
  quantity: 1, 
  unitPrice: 0, 
  productId: '' 
};

export default function CreateInvoiceForm() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<InvoiceItemForm[]>([initialInvoiceItem]);

  const [formData, setFormData] = useState<FormDataWithoutItems>({
    title: '',
    dueDate: '',
    status: 'DRAFT',
    taxRate: 0.11,
    discount: 0,
    projectId: '',
    clientId: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      try {
        const [clientsRes, projectsRes, productsRes] = await Promise.all([
          clientService.getClients(),
          projectService.getProjects(),
          productService.getProducts(),
        ]);
        
        setClients(clientsRes.data);
        setProjects(projectsRes);
        setProducts(productsRes);
      } catch {
        setError('Failed to load initial data');
      }
    };

    loadInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'taxRate' || name === 'discount' ? Number(value) : value 
    }));
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
      }
      
      setItems(newItems);
    }
  };

  const addItem = (): void => {
    setItems([...items, { ...initialInvoiceItem }]);
  };

  const removeItem = (index: number): void => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CreateInvoicePayload = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        items: items.map(item => ({ 
          ...item, 
          quantity: Number(item.quantity), 
          unitPrice: Number(item.unitPrice) 
        })),
      };
      
      await invoiceService.createInvoice(payload);
      alert('Invoice created successfully!');
      router.push('/finance/invoices');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      setError(errorMessage);
    } finally {
      setLoading(false);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Header Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Title</label>
          <input 
            name="title" 
            value={formData.title} 
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
            value={formData.dueDate} 
            onChange={handleChange} 
            className="w-full p-2 border rounded dark:bg-gray-700" 
            required 
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Client</label>
          <select 
            name="clientId" 
            value={formData.clientId} 
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
            value={formData.projectId} 
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
            value={formData.taxRate} 
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
            value={formData.discount} 
            onChange={handleChange} 
            placeholder="0" 
            className="w-full p-2 border rounded dark:bg-gray-700" 
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="DRAFT">Pending</option>
            <option value="UNPAID">Sent</option>
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
                value={item.description} 
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
                value={item.quantity} 
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
                value={item.unitPrice} 
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
          {loading ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}