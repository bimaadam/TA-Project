"use client";

import React, { useEffect, useState } from 'react';
import { productService } from '@/services/product.service';

export default function ProductStockSummaryCard() {
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const products = await productService.getProducts();
        const calculatedTotalStock = products.reduce((sum, product) => sum + product.stock, 0);
        setTotalStock(calculatedTotalStock);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">Loading product data...</div>;
  }

  if (error) {
    return <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-red-500">Error: {error}</div>;
  }

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Product Stock Overview</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Stock</span>
          <span className="text-2xl font-bold text-blue-600">{totalStock}</span>
        </div>
      </div>
    </div>
  );
}