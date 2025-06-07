"use client"

import { useState } from "react";
import Button from "../ui/button/Button";
import Link from "next/link";

const dummyData = [
    { id: "INV-001", customer: "PT Aman Sejahtera", date: "2025-06-01", amount: 2000000, status: "Paid" },
    { id: "INV-002", customer: "PT Maju Mundur", date: "2025-06-02", amount: 1500000, status: "Unpaid" },
    { id: "INV-003", customer: "PT Suka Makmur", date: "2025-06-03", amount: 5000000, status: "Overdue" },
    { id: "INV-004", customer: "PT Sentosa", date: "2025-06-04", amount: 3500000, status: "Paid" },
];

const statusList = ["All", "Unpaid", "Paid", "Overdue"];

const InvoiceList = () => {
    const [filter, setFilter] = useState("All");

    const filteredInvoices =
        filter === "All" ? dummyData : dummyData.filter((inv) => inv.status === filter);

    return (
        <div className="p-6 bg-auto shadow rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold dark:text-white">Invoice List</h2>
                <Link href="/data-invoice/details-invoice">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        + Create Invoice
                    </Button>
                </Link>
            </div>

            {/* Filter */}
            <div className="mb-4 flex gap-2 flex-wrap">
                {statusList.map((stat) => (
                    <button
                        key={stat}
                        className={`px-3 py-1 rounded-md text-sm border ${filter === stat
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setFilter(stat)}
                    >
                        {stat}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border text-sm bg-auto text-left dark:text-white">
                    <thead className="bg-indigo-500">
                        <tr className="text-black">
                            <th className="p-3">Invoice No</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 text-right">Amount (IDR)</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((inv) => (
                            <tr key={inv.id} className="border-t">
                                <td className="p-3">{inv.id}</td>
                                <td className="p-3">{inv.customer}</td>
                                <td className="p-3">{inv.date}</td>
                                <td className="p-3 text-right">{inv.amount.toLocaleString("id-ID")}</td>
                                <td
                                    className={`p-3 font-semibold ${inv.status === "Paid"
                                        ? "text-green-600"
                                        : inv.status === "Unpaid"
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {inv.status}
                                </td>
                            </tr>
                        ))}
                        {filteredInvoices.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-3 text-center text-white">
                                    No invoice found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceList;
