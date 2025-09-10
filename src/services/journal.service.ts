import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Define interfaces based on DTO
interface JournalEntryLine {
  accountId: string;
  amount: number;
  isDebit: boolean;
}

export interface CreateJournalEntryPayload {
  date: string;
  description?: string;
  referenceNumber: string;
  recordedByUserId: string;
  projectId?: string;
  invoiceId?: string;
  lines: JournalEntryLine[];
}

// Interface for the Journal Entry object returned by GET endpoints
export interface JournalEntry {
    id: string;
    date: string;
    description: string | null;
    referenceNumber: string;
    projectId: string | null;
    invoiceId: string | null;
    recordedByUserId: string;
    createdAt: string;
    updatedAt: string;
    recordedByUser: {
        id: string;
        fullName: string;
        // Add other user fields if needed for display
    };
    project?: {
        id: string;
        name: string;
        // Add other project fields if needed for display
    } | null;
    invoice?: {
        id: string;
        // Add other invoice fields if needed for display
    } | null;
    lines: JournalEntryLine[]; // Lines are included in detail view
}

export const journalService = {
  // Get all journal entries
  async getJournalEntries(): Promise<JournalEntry[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/journal-entries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch journal entries');
    }
    return response.json();
  },

  // Get a single journal entry by ID
  async getJournalEntryById(id: string): Promise<JournalEntry> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/journal-entries/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch journal entry');
    }
    return response.json();
  },

  // Create a new journal entry
  async createJournalEntry(payload: CreateJournalEntryPayload): Promise<JournalEntry> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/journal-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create journal entry');
    }
    return response.json();
  },
};
