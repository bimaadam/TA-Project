import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function ProjectProfitLossPage() {
    const rows = [
        { project: "Renovasi Rumah A", revenue: 150_000_000, cost: 110_000_000 },
        { project: "Instalasi AC Kantor B", revenue: 85_000_000, cost: 52_500_000 },
        { project: "Perawatan Berkala C", revenue: 40_000_000, cost: 18_000_000 },
    ];

    const currency = (n: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Laba Rugi Proyek" />

            <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-base font-semibold">Ringkasan Laba Rugi</h3>
                    <p className="text-sm text-gray-500 mt-1">Dummy data sederhana untuk overview laba rugi per proyek.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="text-left px-5 py-3 font-medium">Proyek</th>
                                <th className="text-right px-5 py-3 font-medium">Pendapatan</th>
                                <th className="text-right px-5 py-3 font-medium">Biaya</th>
                                <th className="text-right px-5 py-3 font-medium">Laba/Rugi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => {
                                const profit = r.revenue - r.cost;
                                const isLoss = profit < 0;
                                return (
                                    <tr key={r.project} className="border-t border-gray-100 dark:border-gray-800">
                                        <td className="px-5 py-3">{r.project}</td>
                                        <td className="px-5 py-3 text-right">{currency(r.revenue)}</td>
                                        <td className="px-5 py-3 text-right">{currency(r.cost)}</td>
                                        <td className={`px-5 py-3 text-right font-medium ${isLoss ? "text-red-600" : "text-emerald-600"}`}>
                                            {currency(profit)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                            {(() => {
                                const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
                                const totalCost = rows.reduce((s, r) => s + r.cost, 0);
                                const totalProfit = totalRevenue - totalCost;
                                return (
                                    <tr>
                                        <th className="px-5 py-3 text-left">Total</th>
                                        <th className="px-5 py-3 text-right">{currency(totalRevenue)}</th>
                                        <th className="px-5 py-3 text-right">{currency(totalCost)}</th>
                                        <th className={`px-5 py-3 text-right ${totalProfit < 0 ? "text-red-700" : "text-emerald-700"}`}>{currency(totalProfit)}</th>
                                    </tr>
                                );
                            })()}
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
