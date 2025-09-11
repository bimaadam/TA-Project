"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { projectService, Project } from '@/services/project.service';
import { clientService } from '@/services/client.service';
import Badge from "@/components/ui/badge/Badge";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientResponse, projectResponse] = await Promise.all([
        clientService.getClients(),
        projectService.getProjects(),
      ]);

      const clientMap = new Map<string, string>();
      clientResponse.data.forEach(client => {
        clientMap.set(client.id, client.fullName);
      });
      
      setClients(clientMap);
      setProjects(projectResponse);

    } catch (err: unknown) {
      if (err instanceof Error)
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(projectId);
        fetchData(); // Refresh list after delete
      } catch (err: unknown) {
        if (err instanceof Error)
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/projects/new">
          <Button>Add Project</Button>
        </Link>
      </div>
      
      {/* Project Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-100 dark:border-white/[0.05]">
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Project Name</th>
                <th className="py-3 px-6 text-left">Client</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-left">End Date</th>
                <th className="py-3 px-6 text-right">Budget</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
              {projects.map(project => (
                <tr key={project.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{project.name}</td>
                  <td className="py-3 px-6 text-left">{clients.get(project.clientId) || 'N/A'}</td>
                  <td className="py-3 px-6 text-center">
                    <Badge size="sm" color={project.status === 'COMPLETED' ? 'success' : 'warning'}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-6 text-left">{new Date(project.endDate).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(project.budget)}</td>
                  <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                          <Link href={`/projects/edit/${project.id}`}><Button size="sm" variant="outline" className="mr-2">Edit</Button></Link>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(project.id)}>Delete</Button>
                      </div>
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