import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  unitPrice: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  sku: string;
  unitPrice: number;
  stock: number;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  sku?: string;
  unitPrice?: number;
  stock?: number;
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProductById(id: string): Promise<Product> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }
    return response.json();
  },

  async updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }
    return response.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete product');
    }
  },
};
