"use client"
import { useState, useEffect } from 'react';
import { Trash2, Plus, Calendar, DollarSign, FileText, Tag, RefreshCw, TrendingDown, AlertCircle } from 'lucide-react';

export default function ExpenseTransaction() {
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            date: '2025-01-15',
            description: 'Pembelian Bahan Baku',
            category: 'Operasional',
            amount: 500000,
            receipt: 'INV-001',
            status: 'Approved'
        },
        {
            id: 2,
            date: '2025-01-14',
            description: 'Biaya Listrik',
            category: 'Utilitas',
            amount: 250000,
            receipt: 'PLN-002',
            status: 'Approved'
        },
        {
            id: 3,
            date: '2025-01-13',
            description: 'Gaji Karyawan',
            category: 'SDM',
            amount: 3000000,
            receipt: 'PAY-003',
            status: 'Pending'
        },
        {
            id: 4,
            date: '2025-01-12',
            description: 'Biaya Pemasaran Digital',
            category: 'Pemasaran',
            amount: 750000,
            receipt: 'ADV-004',
            status: 'Processing'
        },
        {
            id: 5,
            date: '2025-01-11',
            description: 'Pembelian ATK',
            category: 'Administrasi',
            amount: 125000,
            receipt: 'ATK-005',
            status: 'Approved'
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
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
        'Transport',
        'Komunikasi',
        'Pemeliharaan',
        'Lain-lain'
    ];

    // Fetch expenses from API
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
            const response = await fetch(`${apiUrl}/expenses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || 'your-token-here'}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTransactions(data.expenses || transactions); // Fallback to dummy data if API fails
            } else {
                console.error('Failed to fetch expenses:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Submit new expense
    const submitExpense = async (expenseData) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
            const response = await fetch(`${apiUrl}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || 'your-token-here'}`
                },
                body: JSON.stringify(expenseData)
            });

            if (response.ok) {
                const savedExpense = await response.json();
                return savedExpense;
            } else {
                console.error('Failed to save expense:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Error saving expense:', error);
            return null;
        }
    };

    // Delete expense
    const deleteExpense = async (id) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
            const response = await fetch(`${apiUrl}/expenses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || 'your-token-here'}`
                }
            });

            if (response.ok) {
                return true;
            } else {
                console.error('Failed to delete expense:', response.statusText);
                return false;
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            return false;
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.date || !formData.description || !formData.category || !formData.amount) {
            alert('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setLoading(true);
        const newTransaction = {
            date: formData.date,
            description: formData.description,
            category: formData.category,
            amount: parseFloat(formData.amount),
            receipt: formData.receipt,
            status: 'Pending'
        };

        try {
            const savedTransaction = await submitExpense(newTransaction);

            if (savedTransaction) {
                setTransactions(prev => [{ ...savedTransaction, id: transactions.length + 1 }, ...prev]);
            } else {
                // Fallback to local state if API fails
                setTransactions(prev => [{ ...newTransaction, id: transactions.length + 1 }, ...prev]);
            }

            setFormData({
                date: '',
                description: '',
                category: '',
                amount: '',
                receipt: ''
            });
            setShowForm(false);
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            // Fallback to local state
            setTransactions(prev => [{ ...newTransaction, id: transactions.length + 1 }, ...prev]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            setLoading(true);
            try {
                const success = await deleteExpense(id);

                if (success) {
                    setTransactions(prev => prev.filter(t => t.id !== id));
                } else {
                    // Fallback to local state even if API fails
                    setTransactions(prev => prev.filter(t => t.id !== id));
                }
            } catch (error) {
                console.error('Error in handleDelete:', error);
                // Fallback to local state
                setTransactions(prev => prev.filter(t => t.id !== id));
            } finally {
                setLoading(false);
            }
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
    const approvedExpense = transactions.filter(t => t.status === 'Approved').reduce((sum, t) => sum + t.amount, 0);
    const pendingExpense = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-h-screen mx-auto p-0 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-lg mr-4">
                            <TrendingDown className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Transaksi Keluar</h1>
                            <p className="text-gray-600">Kelola pengeluaran dan biaya operasional perusahaan</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchExpenses}
                            disabled={loading}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <Plus size={20} />
                            Tambah Transaksi
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Pengeluaran</p>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Disetujui</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(approvedExpense)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Menunggu Persetujuan</p>
                            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingExpense)}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Tambah Transaksi Keluar</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tanggal *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori *
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    No. Kwitansi/Invoice
                                </label>
                                <input
                                    type="text"
                                    name="receipt"
                                    value={formData.receipt}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan nomor kwitansi"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50"
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Daftar Transaksi Keluar</h2>
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
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                            <div className="truncate">{transaction.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {transaction.receipt || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                disabled={loading}
                                                className="text-red-600 hover:text-red-900 transition-colors duration-200 disabled:opacity-50"
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