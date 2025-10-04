import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DashboardSummary {
  totalProjects: number;
  totalClients: number;
  totalRevenue: number;
  unpaidInvoices: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard summary');
    }
    return response.json();
  },

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/dashboard/monthly-revenue`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly revenue');
    }
    return response.json();
  },
};
