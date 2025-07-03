"use client"
import { useState } from 'react';
import { Trash2, Plus, Calendar, DollarSign, FileText, Tag } from 'lucide-react';

export default function ExpenseTransaction() {
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            date: '2025-01-15',
            description: 'Pembelian Bahan Baku',
            category: 'Operasional',
            amount: 500000,
            receipt: 'INV-001'
        },
        {
            id: 2,
            date: '2025-01-14',
            description: 'Biaya Listrik',
            category: 'Utilitas',
            amount: 250000,
            receipt: 'PLN-002'
        },
        {
            id: 3,
            date: '2025-01-13',
            description: 'Gaji Karyawan',
            category: 'SDM',
            amount: 3000000,
            receipt: 'PAY-003'
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        description: '',
        category: '',
        amount: '',
        receipt: ''
    });

    const categories = [
        'Operasional',
        'Utilitas',
        'SDM',
        'Pemasaran',
        'Administrasi',
        'Lain-lain'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.date || !formData.description || !formData.category || !formData.amount) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        const newTransaction = {
            id: transactions.length + 1,
            date: formData.date,
            description: formData.description,
            category: formData.category,
            amount: parseFloat(formData.amount),
            receipt: formData.receipt
        };

        setTransactions(prev => [newTransaction, ...prev]);
        setFormData({
            date: '',
            description: '',
            category: '',
            amount: '',
            receipt: ''
        });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalExpense = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaksi Keluar</h1>
                        <p className="text-gray-600">Kelola pengeluaran dan biaya operasional</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        Tambah Transaksi
                    </button>
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md p-6 mb-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-red-100 mb-2">Total Pengeluaran</p>
                        <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-full">
                        <DollarSign size={32} />
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">Tambah Transaksi Keluar</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi *
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan deskripsi transaksi"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori *
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    No. Kwitansi/Invoice
                                </label>
                                <input
                                    type="text"
                                    name="receipt"
                                    value={formData.receipt}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nomor kwitansi"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Daftar Transaksi</h2>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">Belum ada transaksi keluar</p>
                        <p className="text-sm">Klik tombol &quot;Tambah Transaksi&quot; untuk memulai</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Deskripsi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kwitansi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {transaction.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.receipt || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}