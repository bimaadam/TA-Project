import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface IncomeStatementData {
  startDate: string;
  endDate: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  expense: number;
  otherIncome: number;
  otherExpense: number;
  netProfit: number;
}

export interface BalanceSheetData {
  asOfDate: string;
  assets: {
    total: number;
    accounts: { name: string; balance: number; }[];
  };
  liabilities: {
    total: number;
    accounts: { name: string; balance: number; }[];
  };
  equity: {
    total: number;
    accounts: { name: string; balance: number; }[];
  };
}

export interface ProjectSummaryData {
  id: string;
  name: string;
  clientName: string;
  status: string;
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
}

export const reportService = {
  async getIncomeStatement(startDate?: string, endDate?: string): Promise<IncomeStatementData> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/reports/income-statement?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch income statement report');
    }
    return response.json();
  },

  async getBalanceSheet(asOfDate?: string): Promise<BalanceSheetData> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const params = new URLSearchParams();
    if (asOfDate) params.append('asOfDate', asOfDate);

    const response = await fetch(`${API_BASE_URL}/reports/balance-sheet?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch balance sheet report');
    }
    return response.json();
  },

  async getProjectSummary(startDate?: string, endDate?: string): Promise<ProjectSummaryData[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/reports/project-summary?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch project summary report');
    }
    return response.json();
  },
};
