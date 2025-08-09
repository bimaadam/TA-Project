import PageBreadcrumb from "@/components/common/PageBreadCrumb";

interface EmployeeRow {
    id: string;
    name: string;
    role: string;
    phone: string;
    status: "Aktif" | "Nonaktif";
}

export default function MasterDataKaryawanPage() {
    const employees: EmployeeRow[] = [
        { id: "KRY-001", name: "Budi Santoso", role: "Teknisi Senior", phone: "0812-3456-7890", status: "Aktif" },
        { id: "KRY-002", name: "Siti Aminah", role: "Administrasi", phone: "0813-1111-2222", status: "Aktif" },
        { id: "KRY-003", name: "Dewi Lestari", role: "Teknisi", phone: "0812-9999-8888", status: "Nonaktif" },
    ];

    return (
        <div className="space-y-6">
            <PageBreadcrumb pageTitle="Data Karyawan" />

            <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-base font-semibold">Master Data Karyawan</h3>
                    <p className="text-sm text-gray-500 mt-1">Dummy data sederhana. Tambahkan integrasi CRUD nanti.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-5 py-3 text-left font-medium">ID</th>
                                <th className="px-5 py-3 text-left font-medium">Nama</th>
                                <th className="px-5 py-3 text-left font-medium">Jabatan</th>
                                <th className="px-5 py-3 text-left font-medium">No. Telepon</th>
                                <th className="px-5 py-3 text-left font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id} className="border-t border-gray-100 dark:border-gray-800">
                                    <td className="px-5 py-3 whitespace-nowrap">{emp.id}</td>
                                    <td className="px-5 py-3">{emp.name}</td>
                                    <td className="px-5 py-3">{emp.role}</td>
                                    <td className="px-5 py-3">{emp.phone}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${emp.status === "Aktif"
                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                                            }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${emp.status === "Aktif" ? "bg-emerald-500" : "bg-red-500"}`} />
                                            {emp.status}
                                        </span>
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
