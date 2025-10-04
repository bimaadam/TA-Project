"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { orderService } from "@/services/order.service";

export default function CreateClientOrderPage() {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // Backend should use authenticated userId; pass no userId from client
            await orderService.createOrder({ description, status: "PENDING" });
            setSuccess("Order created");
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Buat Pesanan" />
            <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm mb-1">Deskripsi</label>
                    <input name="description" value={description} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                {/* Status is fixed to PENDING for clients */}
                <div className="md:col-span-2 flex gap-3 mt-2">
                    <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                    {error && <span className="text-red-500 self-center">{error}</span>}
                    {success && <span className="text-green-600 self-center">{success}</span>}
                </div>
            </form>
        </div>
    );
}


