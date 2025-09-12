'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, Filter, Download, Eye, Edit, Trash2, TrendingUp, Activity, Building2, CheckCircle, Clock } from 'lucide-react';

export default function CashReceiptsComponent() {
    const [clientName, setClientName] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
    const [description, setDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [receipts, setReceipts] = useState([
        {
            id: 1,
            clientName: "PT Maju Bersama",
            invoiceNumber: "INV-2024-001",
            amount: 15000000,
            paymentMethod: "Transfer Bank",
            description: "Pembayaran jasa konsultasi Q1 2024",
            status: "Verified",
            date: "2024-01-15",
            bankAccount: "BCA - 1234567890"
        },
        {
            id: 2,
            clientName: "PT Sukses Mandiri",
            invoiceNumber: "INV-2024-002",
            amount: 8500000,
            paymentMethod: "Cek",
            description: "Pembayaran proyek website development",
            status: "Pending",
            date: "2024-01-14",
            bankAccount: "Mandiri - 0987654321"
        },
        {
            id: 3,
            clientName: "PT Digital Inovasi",
            invoiceNumber: "INV-2024-003",
            amount: 12750000,
            paymentMethod: "Transfer Bank",
            description: "Pembayaran sistem IT maintenance",
            status: "Verified",
            date: "2024-01-13",
            bankAccount: "BNI - 5678901234"
        },
        {
            id: 4,
            clientName: "PT Teknologi Masa Depan",
            invoiceNumber: "INV-2024-004",
            amount: 25000000,
            paymentMethod: "Giro",
            description: "Pembayaran implementasi software ERP",
            status: "Processing",
            date: "2024-01-12",
            bankAccount: "BRI - 3456789012"
        },
    ]);

    // Fetch data from API
    const fetchReceipts = useCallback (async () => {
        setLoading(true);
        try {
            // Using environment variable for API URL
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
            const response = await fetch(`${apiUrl}/cash-receipts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || 'your-token-here'}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setReceipts(data.receipts || receipts); // Fallback to dummy data if API fails
            } else {
                console.error('Failed to fetch receipts:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
        } finally {
            setLoading(false);
        }
    },[receipts]);

    // Submit new receipt
    const handleSubmit = async () => {
        if (clientName && invoiceNumber && amount && description) {
            const newReceipt = {
                clientName,
                invoiceNumber,
                amount: parseFloat(amount),
                paymentMethod,
                description,
                status: "Pending",
                date: new Date().toISOString().split('T')[0],
                bankAccount: "BCA - 1234567890" // Default bank account
            };

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
                const response = await fetch(`${apiUrl}/cash-receipts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || 'your-token-here'}`
                    },
                    body: JSON.stringify(newReceipt)
                });

                if (response.ok) {
                    const savedReceipt = await response.json();
                    setReceipts([{ ...savedReceipt, id: receipts.length + 1 }, ...receipts]);
                } else {
                    // Fallback to local state if API fails
                    setReceipts([{ ...newReceipt, id: receipts.length + 1 }, ...receipts]);
                }
            } catch (error) {
                console.error('Error saving receipt:', error);
                // Fallback to local state
                setReceipts([{ ...newReceipt, id: receipts.length + 1 }, ...receipts]);
            }

            // Reset form
            setClientName("");
            setInvoiceNumber("");
            setAmount("");
            setDescription("");
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchReceipts();
    }, [fetchReceipts]);

    const filteredReceipts = receipts.filter(receipt =>
        receipt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const verifiedAmount = receipts.filter(r => r.status === 'Verified').reduce((sum, receipt) => sum + receipt.amount, 0);
    const pendingAmount = receipts.filter(r => r.status === 'Pending').reduce((sum, receipt) => sum + receipt.amount, 0);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified': return <CheckCircle className="w-4 h-4" />;
            case 'Pending': return <Clock className="w-4 h-4" />;
            case 'Processing': return <Activity className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className=" bg-gray-50 p-0">
            <div className="max-w-screen mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                            <Building2 className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Penerimaan Kas dari Klien PT</h1>
                            <p className="text-gray-600">Kelola pembayaran dan penerimaan kas dari klien perusahaan</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Penerimaan</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Terverifikasi</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(verifiedAmount)}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Receipt Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                    <div className="flex items-center mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Tambah Penerimaan Kas Baru</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nama Klien PT</label>
                                <input
                                    type="text"
                                    placeholder="PT Nama Perusahaan"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nomor Invoice</label>
                                <input
                                    type="text"
                                    placeholder="INV-2024-XXX"
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Jumlah Pembayaran</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Metode Pembayaran</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                >
                                    <option value="Transfer Bank">Transfer Bank</option>
                                    <option value="Cek">Cek</option>
                                    <option value="Giro">Giro</option>
                                    <option value="Tunai">Tunai</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                                <input
                                    type="text"
                                    placeholder="Keterangan pembayaran"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {loading ? 'Menyimpan...' : 'Tambah Penerimaan'}
                        </button>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama klien, invoice, atau deskripsi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchReceipts}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-300 disabled:opacity-50"
                            >
                                <Activity className="w-4 h-4 mr-2" />
                                {loading ? 'Loading...' : 'Refresh'}
                            </button>
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

                {/* Receipts Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Daftar Penerimaan Kas</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Klien PT
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Metode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReceipts.map((receipt) => (
                                    <tr key={receipt.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(receipt.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{receipt.clientName}</div>
                                            <div className="text-sm text-gray-500">{receipt.bankAccount}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {receipt.invoiceNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                            {formatCurrency(receipt.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {receipt.paymentMethod}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                                                {getStatusIcon(receipt.status)}
                                                <span className="ml-1">{receipt.status}</span>
                                            </span>
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
                    <div className="bg-white px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{filteredReceipts.length}</span> dari{' '}
                                <span className="font-medium">{receipts.length}</span> penerimaan
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Sebelumnya
                                </button>
                                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
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