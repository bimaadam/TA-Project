"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectService, CreateProjectPayload } from '@/services/project.service';
import { clientService, Client } from '@/services/client.service';
import Button from '@/components/ui/button/Button';

export default function CreateProjectForm() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<Omit<CreateProjectPayload, 'clientId'>>({
    name: '',
    description: '',
    machineType: '',
    serialNumber: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: 0,
    status: 'PENDING',
    priority: 1,
  });
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clientService.getClients()
      .then(response => setClients(response.data))
      .catch(() => setError('Failed to load clients'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'budget' || name === 'priority' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      setError('Please select a client.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Convert dates to ISO string format if they exist
      const payload: CreateProjectPayload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(), // Fallback to now if empty
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : new Date().toISOString(), // Fallback to now if empty
        clientId: selectedClientId,
      };
      await projectService.createProject(payload);
      alert('Project created successfully!');
      router.push('/projects'); // Redirect to the project list page
    } catch (err: unknown) {
      if (err instanceof Error)
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Project Name</label>
            <input name="name" onChange={handleChange} placeholder="Project Name" className="w-full p-2 border rounded dark:bg-gray-700" required />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Client</label>
            <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" required>
              <option value="" disabled>Select a Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Machine Type</label>
            <input name="machineType" onChange={handleChange} placeholder="e.g., CNC Machine" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Serial Number</label>
            <input name="serialNumber" onChange={handleChange} placeholder="e.g., SN12345" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
           <div>
            <label className="block mb-2 text-sm font-medium">Location</label>
            <input name="location" onChange={handleChange} placeholder="e.g., Client Office, Jakarta" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Start Date</label>
            <input name="startDate" type="date" onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">End Date</label>
            <input name="endDate" type="date" onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Budget</label>
            <input name="budget" type="number" onChange={handleChange} placeholder="50000" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
           <div>
            <label className="block mb-2 text-sm font-medium">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700">
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
        <textarea name="description" onChange={handleChange} placeholder="Project description..." className="w-full p-2 border rounded dark:bg-gray-700" rows={4}></textarea>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      <div className="mt-6 flex justify-end gap-4">
        <Button type="button" onClick={() => router.back()} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Project'}</Button>
      </div>
    </form>
  );
}
