"use client";

import React, { useEffect, useState } from 'react';
import { productService, Product } from '@/services/product.service';

export default function ProductSummaryCard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts();
        setTotalProducts(response.length);
        const value = response.reduce((sum, product) => sum + (product.unitPrice * product.stock), 0);
        setTotalStockValue(value);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  if (loading) {
    return <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">Loading product data...</div>;
  }

  if (error) {
    return <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-red-500">Error: {error}</div>;
  }

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Product Overview</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Products</span>
          <span className="text-2xl font-bold text-purple-600">{totalProducts}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Stock Value</span>
          <span className="text-xl font-bold text-purple-600">{formatCurrency(totalStockValue)}</span>
        </div>
        {/* You can add more product-related stats here */}
      </div>
    </div>
  );
}
