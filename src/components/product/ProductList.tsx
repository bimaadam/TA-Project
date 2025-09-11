"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { productService, Product } from '@/services/product.service';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      setProducts(response);
    } catch (err: unknown) {
      if (err instanceof Error)
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        fetchProducts(); // Refresh list after delete
      } catch (err: unknown) {
        if (err instanceof Error)
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/master-data-produk/tambah">
          <Button>Add Product</Button>
        </Link>
      </div>
      
      {/* Product Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-100 dark:border-white/[0.05]">
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">SKU</th>
                <th className="py-3 px-6 text-right">Unit Price</th>
                <th className="py-3 px-6 text-right">Stock</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{product.name}</td>
                  <td className="py-3 px-6 text-left">{product.sku}</td>
                  <td className="py-3 px-6 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.unitPrice)}</td>
                  <td className="py-3 px-6 text-right">{product.stock}</td>
                  <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                          <Link href={`/master-data-produk/edit/${product.id}`}><Button size="sm" variant="outline" className="mr-2">Edit</Button></Link>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
