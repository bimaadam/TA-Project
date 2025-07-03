'use client'
import React, { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, Filter, Download, Eye, Edit, Trash2, DollarSign, TrendingUp, Activity } from 'lucide-react';

export default function ModernTransaction() {
    const [accountName, setAccountName] = useState("");
    const [description, setDescription] = useState("");
    const [debit, setDebit] = useState("");
    const [credit, setCredit] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [transactions, setTransactions] = useState([
        { id: 1, accountName: "Kas", description: "Transaksi Penjualan", debit: 1000000, credit: 0, date: "2024-01-15" },
        { id: 2, accountName: "Bank", description: "Pembayaran Supplier", debit: 0, credit: 500000, date: "2024-01-14" },
        { id: 3, accountName: "Piutang", description: "Penjualan Kredit", debit: 750000, credit: 0, date: "2024-01-13" },
        { id: 4, accountName: "Inventori", description: "Pembelian Barang", debit: 0, credit: 300000, date: "2024-01-12" },
    ]);

    const handleSubmit = () => {
        if (accountName && description && (debit || credit)) {
            const newTransaction = {
                id: transactions.length + 1,
                accountName,
                description,
                debit: parseFloat(debit) || 0,
                credit: parseFloat(credit) || 0,
                date: new Date().toISOString().split('T')[0]
            };
            setTransactions([newTransaction, ...transactions]);
            setAccountName("");
            setDescription("");
            setDebit("");
            setCredit("");
        }
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);

    return (
        <div className="min-h-screen bg-auto p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold dark:text-white mb-2">Transaksi Akun</h1>
                    <p className="text-gray-600">Kelola semua transaksi keuangan Anda dengan mudah</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-auto rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Debit</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDebit)}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-auto rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Kredit</p>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCredit)}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-auto rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Saldo Bersih</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalDebit - totalCredit)}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Form */}
                <div className="bg-auto rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Tambah Transaksi Baru</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nama Akun</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama akun"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan deskripsi"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Debit</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={debit}
                                    onChange={(e) => setDebit(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Kredit</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={credit}
                                    onChange={(e) => setCredit(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Transaksi
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-auto rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari transaksi berdasarkan akun atau deskripsi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </button>
                            <button className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-300">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-auto rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Daftar Transaksi</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama Akun
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Deskripsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Debit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kredit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-auto divide-y divide-gray-200">
                                {filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{transaction.accountName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                            {transaction.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {transaction.debit > 0 ? (
                                                <span className="text-green-600 font-medium">
                                                    {formatCurrency(transaction.debit)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {transaction.credit > 0 ? (
                                                <span className="text-red-600 font-medium">
                                                    {formatCurrency(transaction.credit)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-2">
                                                <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-auto px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{filteredTransactions.length}</span> dari{' '}
                                <span className="font-medium">{transactions.length}</span> transaksi
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-auto hover:bg-gray-50 transition-colors duration-200">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Sebelumnya
                                </button>
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-auto hover:bg-gray-50 transition-colors duration-200">
                                    Selanjutnya
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}