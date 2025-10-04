// src/services/payment.service.ts
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface CreatePaymentResponse {
    id: string;
    status: string;
    amount: number;
    method: string;
    reference?: string;
    notes?: string;
    paymentDate?: string;
    invoiceId: string;
}

export const paymentService = {
    async createManualPayment(data: {
        invoiceId: string;
        amount: number;
        method: string;
        reference?: string;
        notes?: string;
        paymentDate?: string;
    }): Promise<CreatePaymentResponse> {
        const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/payments`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...data,
                status: 'PENDING' // Default status for manual payments
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Gagal membuat pembayaran');
        }

        return response.json();
    },

    async listPayments() {
        const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_BASE_URL}/payments`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch payments');
        return res.json();
    },

    async getPaymentById(id: string) {
        const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch payment');
        return res.json();
    },

    async create(body: { amount: number; method: string; status?: string; paymentDate?: string; reference?: string; notes?: string; invoiceId: string; }) {
        const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_BASE_URL}/payments`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to create payment');
        }
        return res.json();
    },

    async update(id: string, body: Partial<{ amount: number; method: string; status: string; paymentDate: string; reference: string; notes: string; }>) {
        const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to update payment');
        return res.json();
    },

    async remove(id: string) {
        const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete payment');
        return true;
    },
};


