import React from "react";

const sampleJournals = [
    {
        id: 1,
        date: "2024-06-01",
        description: "Penjualan Produk A",
        debit: 0,
        credit: 150000,
        balance: 150000,
    },
    {
        id: 2,
        date: "2024-06-02",
        description: "Pembelian Bahan B",
        debit: 50000,
        credit: 0,
        balance: 100000,
    },
    {
        id: 3,
        date: "2024-06-03",
        description: "Biaya Operasional",
        debit: 20000,
        credit: 0,
        balance: 80000,
    },
];

export default function Journals() {
    return (
        <div className="h-screen bg-auto flex justify-center">
            <div className="w-full bg-auto rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">
                    Journal Umum
                </h1>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="text-left py-3 px-4 rounded-tl-lg">Date</th>
                                <th className="text-left py-3 px-4">Description</th>
                                <th className="text-right py-3 px-4">Debit (IDR)</th>
                                <th className="text-right py-3 px-4">Credit (IDR)</th>
                                <th className="text-right py-3 px-4 rounded-tr-lg">Balance (IDR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleJournals.map((entry) => (
                                <tr
                                    key={entry.id}
                                    className="border-b border-gray-200 text-white"
                                >
                                    <td className="py-3 px-4">{entry.date}</td>
                                    <td className="py-3 px-4">{entry.description}</td>
                                    <td className="py-3 px-4 text-right">{entry.debit.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-right">{entry.credit.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-right font-semibold">{entry.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
