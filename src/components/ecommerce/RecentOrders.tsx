"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { projectService, Project } from "@/services/project.service";

export default function RecentOrders() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      setLoading(true);
      try {
        const allProjects = await projectService.getProjects();
        // Sort by creation date and take the latest 5
        const recentProjects = allProjects
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setProjects(recentProjects);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recent projects');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  if (loading) {
    return <div>Loading recent projects...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Projects
          </h3>
        </div>
        {/* Filter/See All buttons can be added here if needed */}
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Project Name</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Location</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400">Budget</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">Status</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{project.name}</p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{project.location}</TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(project.budget || 0)}</TableCell>
                <TableCell className="py-3 text-center">
                  <Badge size="sm" color={project.status === 'COMPLETED' ? 'success' : project.status === 'IN_PROGRESS' ? 'primary' : 'warning'}>
                    {project.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
