"use client";

import React, { useEffect, useState } from 'react';
import { clientService, Client, CreateClientPayload, UpdateClientPayload } from '@/services/client.service';
import Button from '@/components/ui/button/Button';

// Modal for Adding a Client
const AddClientModal = ({ isOpen, onClose, onClientAdded }: { isOpen: boolean, onClose: () => void, onClientAdded: () => void }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<CreateClientPayload>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isVerified: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await clientService.createClient(formData);
      onClientAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded dark:bg-gray-700" required />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded dark:bg-gray-700" required />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700" required />
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded dark:bg-gray-700" required />
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Client'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Editing a Client
const EditClientModal = ({ client, isOpen, onClose, onClientUpdated }: { client: Client | null, isOpen: boolean, onClose: () => void, onClientUpdated: () => void }) => {
  if (!isOpen || !client) return null;

  const [formData, setFormData] = useState<UpdateClientPayload>({
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
    phone: client.phone || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await clientService.updateClient(client.id, formData);
      onClientUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Client</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded dark:bg-gray-700" />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded dark:bg-gray-700" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700" />
            <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded dark:bg-gray-700" />
            <input name="password" type="password" onChange={handleChange} placeholder="New Password (optional)" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black">Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Client'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default function MasterDataClient() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await clientService.getClients();
      setClients(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientService.deleteClient(clientId);
        fetchClients(); // Refresh list after delete
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading clients...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
        <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddModalOpen(true)}>Add Client</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
                <thead>
                    <tr className="w-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Full Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
                    {clients.map(client => (
                        <tr key={client.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{client.fullName}</td>
                            <td className="py-3 px-6 text-left">{client.email}</td>
                            <td className="py-3 px-6 text-center">
                                <span className={`${client.isVerified ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'} py-1 px-3 rounded-full text-xs`}>
                                    {client.isVerified ? 'Verified' : 'Not Verified'}
                                </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                                <div className="flex item-center justify-center">
                                    <Button size="sm" variant="outline" onClick={() => handleEditClick(client)} className="mr-2">Edit</Button>
                                    <Button size="sm" variant="danger" onClick={() => handleDeleteClick(client.id)}>Delete</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AddClientModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onClientAdded={fetchClients} 
        />
        <EditClientModal 
            client={selectedClient}
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            onClientUpdated={fetchClients} 
        />
    </div>
  );
}