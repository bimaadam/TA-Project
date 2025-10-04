import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface InvoiceItem {
  id?: string; // Optional for creation, present for existing items
  description: string;
  quantity: number;
  unitPrice: number;
  productId?: string; // Optional, if item is not linked to a product
  total?: number; // Calculated by backend
}

export interface Invoice {
  id: string;
  number: string;8
  title: string;
  amount: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  dueDate: string;
  status: string;
  notes: string | null;
  terms: string | null;
  projectId: string | null;
  clientId: string;
  issuedDate: string;
  paidDate: string | null;
  createdAt: string;
  updatedAt: string;
  invoiceItems: InvoiceItem[];
  // Relations (if included in GET response)
  client?: { id: string; fullName: string; };
  project?: { id: string; name: string; };
}

export interface CreateInvoicePayload {
  title: string;
  dueDate: string;
  status: string;
  taxRate: number;
  discount: number;
  projectId?: string;
  clientId: string;
  items: Omit<InvoiceItem, 'id' | 'total' | 'createdAt'>[]; // Items without generated fields
}

export interface UpdateInvoicePayload {
  title?: string;
  dueDate?: string;
  status?: string;
  taxRate?: number;
  discount?: number;
  projectId?: string;
  clientId?: string;
  notes?: string;
  terms?: string;
  items?: Omit<InvoiceItem, 'total' | 'createdAt'>[]; // Items can be updated, including their IDs
}

export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch invoice');
    return response.json();
  },

  // Fetch invoices by client ID
  async getInvoicesByClientId(clientId: string): Promise<Invoice[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/invoices?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch invoices for client');
    return response.json();
  },

  async createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create invoice');
    }
    return response.json();
  },

  async updateInvoice(id: string, payload: UpdateInvoicePayload): Promise<Invoice> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update invoice');
    }
    return response.json();
  },

  async deleteInvoice(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete invoice');
    }
  },
};
