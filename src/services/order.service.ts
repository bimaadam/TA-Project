import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Interface for the Order object returned by the API
export interface Order {
  id: string;
  userId: string;
  description: string;
  status: string;
  orderDate: string;
  user: {
    id: string;
    fullName: string;
  };
}

// Interface for the payload to create a new order
export interface CreateOrderPayload {
  userId?: string; // optional for CLIENT, backend should take from token
  description: string;
  status?: string;
}

// Interface for the payload to update an order
export interface UpdateOrderPayload {
  userId?: string;
  description?: string;
  status?: string;
}

export const orderService = {
  // Get all orders
  async getOrders(): Promise<Order[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  // Get a single order by ID
  async getOrderById(id: string): Promise<Order> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  // Create a new order
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }
    return response.json();
  },

  // Update an order
  async updateOrder(id: string, payload: UpdateOrderPayload): Promise<Order> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update order');
    }
    return response.json();
  },

  // Delete an order
  async deleteOrder(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete order');
    }
  },
};
