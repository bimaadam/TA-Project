"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectService, UpdateProjectPayload } from '@/services/project.service';
import Button from '@/components/ui/button/Button';

interface EditProjectFormProps {
  projectId: string;
}

export default function EditProjectForm({ projectId }: EditProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UpdateProjectPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  useEffect(() => {
    // Fetch the existing project data
    projectService.getProjectById(projectId)
      .then(project => {
        // Format dates for the input[type=date]
        const formattedProject = {
            ...project,
            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
            endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        };
        setFormData(formattedProject);
      })
      .catch(err => setError('Failed to load project data'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: name === 'budget' || name === 'priority' ? Number(value) : value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);
    setError(null);
    try {
      // Convert dates to ISO string format if they exist
      const payload: UpdateProjectPayload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      };
      await projectService.updateProject(projectId, payload);
      alert('Project updated successfully!');
      router.push('/projects'); // Redirect to the project list page
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading project data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!formData) {
    return <div>Project not found.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Project Name</label>
            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Project Name" className="w-full p-2 border rounded dark:bg-gray-700" required />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Machine Type</label>
            <input name="machineType" value={formData.machineType || ''} onChange={handleChange} placeholder="e.g., CNC Machine" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Serial Number</label>
            <input name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} placeholder="e.g., SN12345" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
           <div>
            <label className="block mb-2 text-sm font-medium">Location</label>
            <input name="location" value={formData.location || ''} onChange={handleChange} placeholder="e.g., Client Office, Jakarta" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Start Date</label>
            <input name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">End Date</label>
            <input name="endDate" type="date" value={formData.endDate || ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Budget</label>
            <input name="budget" type="number" value={formData.budget || 0} onChange={handleChange} placeholder="50000" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
           <div>
            <label className="block mb-2 text-sm font-medium">Status</label>
            <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700">
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Full-width Description */}
      <div>
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Project description..." className="w-full p-2 border rounded dark:bg-gray-700" rows={4}></textarea>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.push('/projects')} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Project'}</Button>
      </div>
    </form>
  );
}
