"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productService, UpdateProductPayload } from '@/services/product.service';
import Button from '@/components/ui/button/Button';

interface EditProductFormProps {
  productId: string;
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UpdateProductPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProductById(productId)
      .then(product => {
        setFormData(product);
      })
      .catch(() => setError('Failed to load product data'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: name === 'unitPrice' || name === 'stock' ? Number(value) : value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    setError(null);
    try {
      await productService.updateProduct(productId, formData);
      alert('Product updated successfully!');
      router.push('/master-data-produk'); // Redirect to product list page
    } catch (err: unknown) {
      if (err instanceof Error)
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading product data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!formData) {
    return <div>Product not found.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border rounded dark:bg-gray-700" required />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">SKU</label>
        <input name="sku" value={formData.sku || ''} onChange={handleChange} placeholder="SKU" className="w-full p-2 border rounded dark:bg-gray-700" required />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Unit Price</label>
        <input name="unitPrice" type="number" value={formData.unitPrice || 0} onChange={handleChange} placeholder="0" className="w-full p-2 border rounded dark:bg-gray-700" required />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Stock</label>
        <input name="stock" type="number" value={formData.stock || 0} onChange={handleChange} placeholder="0" className="w-full p-2 border rounded dark:bg-gray-700" required />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Product description..." className="w-full p-2 border rounded dark:bg-gray-700" rows={3}></textarea>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.push('/master-data-produk')} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</Button>
      </div>
    </form>
  );
}
