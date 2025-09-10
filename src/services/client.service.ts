import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Interface for the Client object (based on your response)
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: 'CLIENT';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
}

// Interface for the response of GET /auth/clients
interface GetClientsResponse {
  data: Client[];
  total: number;
  page: number;
  lastPage: number;
}

// Interface for the payload of POST /auth/clients
export interface CreateClientPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

// Interface for the payload of PATCH /clients/:id
export interface UpdateClientPayload {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isVerified?: boolean;
}

export const clientService = {
  // Fetch all clients
  async getClients(): Promise<GetClientsResponse> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return response.json();
  },

  // Fetch a single client by ID
  async getClientById(id: string): Promise<Client> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch client');
    }
    return response.json();
  },

  // Create a new client
  async createClient(payload: CreateClientPayload): Promise<Client> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create client');
    }
    return response.json();
  },

  // Update a client
  async updateClient(id: string, payload: UpdateClientPayload): Promise<Client> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update client');
    }
    return response.json();
  },

  // Delete a client
  async deleteClient(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error, but don't fail if no body
        throw new Error(errorData.message || 'Failed to delete client');
    }
    // No return needed for a successful delete
  },
};
