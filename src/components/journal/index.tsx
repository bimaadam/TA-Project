import Button from "../ui/button/Button";

export default function Journals() {
    return (
        <div className="w-full min-h-screen bg-auto dark:text-white dark:shadow-white dark:shadow-md shadow-md rounded-2xl p-6">
            {/* Header */}
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">General Ledger</h2>

            {/* Periode */}
            <div className="flex items-center gap-2 mb-4 border-1 rounded-md p-3">
                <label className="text-sm">Dari:</label>
                <input type="date" className="border rounded px-2 py-1 text-sm" defaultValue="2025-01-01" />
                <label className="text-sm">Sampai:</label>
                <input type="date" className="border rounded px-2 py-1 text-sm" defaultValue="2025-01-31" />
                <div className="flex justify-end ml-auto mr-2">
                    <Button size="sm">
                        Tampilkan
                    </Button>
                </div>
            </div>

            {/* Info Perusahaan */}
            <div className="text-sm dark:text-white mb-4">
                <p><strong>CV. Abyzain Jaya Teknika</strong></p>
                <p>Periode: 01/01/2025 - 31/01/2025</p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-2 mb-4 felx justify-end">
                <Button size="sm">
                    Download Excel
                </Button>
                <Button size="sm">
                    Cetak Laporan
                </Button>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto bg-auto border rounded shadow">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-auto dark:text-white ">
                        <tr>
                            <th className="px-4 py-2">Akun</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2 text-center" colSpan={2}>Saldo Awal</th>
                            <th className="px-4 py-2 text-center" colSpan={2}>Mutasi</th>
                            <th className="px-4 py-2 text-center" colSpan={2}>Saldo Akhir</th>
                        </tr>
                        <tr className="bg-auto">
                            <th colSpan={2}></th>
                            <th className="px-4 py-1 text-center">Debit</th>
                            <th className="px-4 py-1 text-center">Kredit</th>
                            <th className="px-4 py-1 text-center">Debit</th>
                            <th className="px-4 py-1 text-center">Kredit</th>
                            <th className="px-4 py-1 text-center">Debit</th>
                            <th className="px-4 py-1 text-center">Kredit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* === Kategori: Aset === */}
                        <tr className="bg-auto font-medium">
                            <td colSpan={8} className="px-4 py-2">• Aset</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">11112</td>
                            <td className="px-4 py-2">Kas Akhir</td>
                            <td></td><td></td><td className="text-right">9,000.00</td><td></td><td className="text-right">9,000.00</td><td></td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">11311</td>
                            <td className="px-4 py-2">Kas di Tangan</td>
                            <td className="text-right">25,000.00</td><td></td><td className="text-right">222,000.00</td><td className="text-right">9,000.00</td><td className="text-right">238,000.00</td><td></td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">11319</td>
                            <td className="px-4 py-2">Cek Diterima</td>
                            <td className="text-right">870,000.00</td><td></td><td className="text-right">9,000.00</td><td className="text-right">9,000.00</td><td className="text-right">870,000.00</td><td></td>
                        </tr>

                        {/* === Kategori: Hutang === */}
                        <tr className="bg-auto font-medium">
                            <td colSpan={8} className="px-4 py-2">• Hutang</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">21398</td>
                            <td className="px-4 py-2">Uang Muka</td>
                            <td></td><td></td><td></td><td></td><td></td><td className="text-right">50,000.00</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">21398</td>
                            <td className="px-4 py-2">Hutang Lainnya</td>
                            <td></td><td></td><td></td><td></td><td></td><td className="text-right">790,000.00</td>
                        </tr>

                        {/* === Kategori: Ekuitas === */}
                        <tr className="bg-auto font-medium">
                            <td colSpan={8} className="px-4 py-2">• Ekuitas</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">34998</td>
                            <td className="px-4 py-2">Laba Ditahan</td>
                            <td></td><td className="text-right">895,000.00</td><td></td><td></td><td></td><td className="text-right">895,000.00</td>
                        </tr>

                        {/* === Kategori: Pendapatan === */}
                        <tr className="bg-auto font-medium">
                            <td colSpan={8} className="px-4 py-2">• Pendapatan</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">41210</td>
                            <td className="px-4 py-2">Pendapatan Jasa</td>
                            <td></td><td></td><td></td><td className="text-right">222,000.00</td><td></td><td className="text-right">222,000.00</td>
                        </tr>

                        {/* === Kategori: Biaya === */}
                        <tr className="bg-auto font-medium">
                            <td colSpan={8} className="px-4 py-2">• Biaya</td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">52019</td>
                            <td className="px-4 py-2">Transportasi</td>
                            <td></td><td></td><td className="text-right">50,000.00</td><td></td><td className="text-right">50,000.00</td><td></td>
                        </tr>
                        <tr className="border-b">
                            <td className="px-4 py-2">53029</td>
                            <td className="px-4 py-2">Biaya Promosi</td>
                            <td></td><td></td><td className="text-right">790,000.00</td><td></td><td className="text-right">790,000.00</td><td></td>
                        </tr>
                    </tbody>
                    <tfoot className="bg-auto font-bold">
                        <tr>
                            <td colSpan={2} className="px-4 py-2">Total</td>
                            <td className="px-4 py-2 text-right">895,000.00</td>
                            <td className="px-4 py-2 text-right">895,000.00</td>
                            <td className="px-4 py-2 text-right">1,080,000.00</td>
                            <td className="px-4 py-2 text-right">1,080,000.00</td>
                            <td className="px-4 py-2 text-right">1,957,000.00</td>
                            <td className="px-4 py-2 text-right">1,957,000.00</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div >
    );
}
