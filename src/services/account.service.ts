import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Account {
  id: string;
  code: string;
  name: string;
  description: string | null;
  categoryType: string;
  isActive: boolean;
  // ... other fields
}

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    // Assuming the response is directly an array of accounts
    return response.json();
  },
};
