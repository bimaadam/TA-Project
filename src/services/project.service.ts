import { authService } from "./auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Interface for the Project object
export interface Project {
  invoiceId: any;
  id: string;
  fullName: string;
  name: string;
  description: string;
  machineType: string;
  serialNumber: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  priority: number;
  metadata?: object;
  clientId: string;
  client: {
    id: string
    fullName: string
  }
  
}

// Interface for the payload of POST /projects
export interface CreateProjectPayload {
  name: string;
  description: string;
  machineType: string;
  serialNumber: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  priority: number;
  metadata?: object; // Optional
  clientId: string;
}

// Interface for the payload of PATCH /projects/:id
export interface UpdateProjectPayload {
    name?: string;
    description?: string;
    machineType?: string;
    serialNumber?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
    status?: string;
    priority?: number;
    metadata?: object;
}

export const projectService = {
  // Fetch all projects
  async getProjects(): Promise<Project[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  // Fetch a single project by ID
  async getProjectById(id: string): Promise<Project> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  // Fetch projects by client ID
  async getProjectsByClientId(clientId: string): Promise<Project[]> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/projects?clientId=${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch projects for client');
    return response.json();
  },

  // Create a new project
  async createProject(payload: CreateProjectPayload): Promise<Project> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
    }
    return response.json();
  },

  // Update a project
  async updateProject(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
    }
    return response.json();
  },

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error('No access token found');

    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete project');
    }
  },
};
