import React from "react";

const sampleInvoices = [
    {
        id: "INV-1001",
        customer: "John Doe",
        date: "2024-06-01",
        amount: 250.0,
        status: "Paid",
    },
    {
        id: "INV-1002",
        customer: "Jane Smith",
        date: "2024-06-03",
        amount: 450.75,
        status: "Pending",
    },
    {
        id: "INV-1003",
        customer: "Acme Corp",
        date: "2024-06-05",
        amount: 1200.5,
        status: "Overdue",
    },
];

export default function Invoice() {
    return (
        <div className="h-screen bg-auto flex justify-center">
            <div className=" w-full bg-auto rounded-lg shadow-md p-6">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse text-white">
                        <thead>
                            <tr className="bg-blue-900 text-white">
                                <th className="text-left py-3 px-4 rounded-tl-lg">Invoice No</th>
                                <th className="text-left py-3 px-4">Customer</th>
                                <th className="text-left py-3 px-4">Tanggal</th>
                                <th className="text-right py-3 px-4">Amount ($)</th>
                                <th className="text-left py-3 px-4 rounded-tr-lg">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleInvoices.map((inv) => (
                                <tr
                                    key={inv.id}
                                    className="border-b border-gray-200"
                                >
                                    <td className="py-3 px-4">{inv.id}</td>
                                    <td className="py-3 px-4">{inv.customer}</td>
                                    <td className="py-3 px-4">{inv.date}</td>
                                    <td className="py-3 px-4 text-right">${inv.amount.toFixed(2)}</td>
                                    <td
                                        className={`py-3 px-4 font-semibold ${inv.status === "Paid"
                                            ? "text-green-600"
                                            : inv.status === "Pending"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {inv.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

