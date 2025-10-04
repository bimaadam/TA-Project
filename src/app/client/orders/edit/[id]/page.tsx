"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import { orderService, Order } from "@/services/order.service";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function EditClientOrderPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id as string;
    const router = useRouter();
    const { user, isReady } = useUser();
    const [order, setOrder] = useState<Order | null>(null);
    const [form, setForm] = useState({ description: "", status: "PENDING" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Block client from accessing edit page entirely
    useEffect(() => {
        if (!isReady) return; // wait for user context
        // Any authenticated client should not be here; redirect to list
        if (user && user.role === 'CLIENT') {
            router.replace('/client/orders');
        }
    }, [user, isReady, router]);

    // If client, render nothing (will be redirected). Optionally show a message.
    if (isReady && user && user.role === 'CLIENT') {
        return (
            <div className="p-4">
                <PageBreadcrumb pageTitle="Tidak Diizinkan" />
                <p className="mt-2">Anda tidak memiliki izin untuk mengubah pesanan.</p>
                <div className="mt-4">
                    <Button type="button" onClick={() => router.push('/client/orders')}>Kembali ke Pesanan</Button>
                </div>
            </div>
        );
    }

    useEffect(() => {
        const load = async () => {
            try {
                const data = await orderService.getOrderById(id);
                setOrder(data);
                setForm({ description: data.description, status: data.status });
            } catch (e: unknown) {
                setError(e instanceof Error ? e.message : 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };
        if (id) load();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await orderService.updateOrder(id, { description: form.description, status: form.status });
            setSuccess('Order updated');
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to update order');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <PageBreadcrumb pageTitle="Ubah Pesanan" />
            <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Deskripsi</label>
                    <input name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>
                <div className="md:col-span-2 flex gap-3 mt-2">
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                    {error && <span className="text-red-500 self-center">{error}</span>}
                    {success && <span className="text-green-600 self-center">{success}</span>}
                </div>
            </form>
        </div>
    );
}


