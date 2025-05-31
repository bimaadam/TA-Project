"use client"

import { Table, TableCell, TableHeader, TableRow } from "../ui/table";
import { useState } from "react";

export default function Transaction() {
    const [accountName, setAccountName] = useState("");
    const [description, setDescription] = useState("");
    const [debit, setDebit] = useState("");
    const [credit, setCredit] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ accountName, description, debit, credit });
        // Reset form fields
        setAccountName("");
        setDescription("");
        setDebit("");
        setCredit("");
    };

    return (
        <div className=" overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Transaksi Akun</h2>

                {/* Transaction Form */}
                <form onSubmit={handleSubmit} className="mt-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Nama Akun"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Deskripsi"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Debit"
                            value={debit}
                            onChange={(e) => setDebit(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                        />
                        <input
                            type="number"
                            placeholder="Kredit"
                            value={credit}
                            onChange={(e) => setCredit(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                        />
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Tambah Transaksi
                    </button>
                </form>

                <div className="mt-4 mb-6">
                    <input
                        type="text"
                        placeholder="Cari transaksi..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                    />
                </div>
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Nama Akun
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Deskripsi
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Debit
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        Kredit
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            {/* Table Body */}
                            <tbody>
                                {/* Sample Data Row */}
                                <TableRow>
                                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">Kas</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">Transaksi Penjualan</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">1,000,000</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">0</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">Bank</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">Pembayaran Supplier</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">0</TableCell>
                                    <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-300">500,000</TableCell>
                                </TableRow>
                                {/* Add more rows as needed */}
                            </tbody>
                        </Table>
                    </div>
                </div>
                {/* Pagination Footer */}
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Menampilkan 1-2 dari 20 transaksi</span>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">Sebelumnya</button>
                        <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">Selanjutnya</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
