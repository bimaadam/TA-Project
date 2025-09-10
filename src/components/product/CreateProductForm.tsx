"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productService, CreateProductPayload } from '@/services/product.service';
import Button from '@/components/ui/button/Button';

export default function CreateProductForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    description: '',
    sku: '',
    unitPrice: 0,
    stock: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'unitPrice' || name === 'stock' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await productService.createProduct(formData);
      alert('Product created successfully!');
      router.push('/master-data-produk'); // Redirect to product list page
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded dark:bg-gray-700" required />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">SKU</label>
        <input name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU" className="w-full p-2 border rounded dark:bg-gray-700" required />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Unit Price</label>
        <input name="unitPrice" type="number" value={formData.unitPrice} onChange={handleChange} placeholder="0" className="w-full p-2 border rounded dark:bg-gray-700" required />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Stock</label>
        <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="0" className="w-full p-2 border rounded dark:bg-gray-700" required />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product description..." className="w-full p-2 border rounded dark:bg-gray-700" rows={3}></textarea>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Product'}</Button>
      </div>
    </form>
  );
}
