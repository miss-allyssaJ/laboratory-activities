const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Handle DELETE requests that might not return JSON
      if (response.status === 204 || response.headers.get('content-type')?.includes('application/json') === false) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Task CRUD operations
  async getTasks() {
    return this.request('/tasks');
  }

  async getTask(id) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Specialized endpoints
  async getActiveTasks() {
    return this.request('/tasks/active');
  }

  async getCompletedTasks() {
    return this.request('/tasks/completed');
  }

  async getTasksByDate(date) {
    return this.request(`/tasks/by-date?date=${date}`);
  }

  async getTasksByPriority(priority) {
    return this.request(`/tasks/by-priority/${priority}`);
  }

  async getTaskStats() {
    return this.request('/tasks/stats');
  }
}

export default new ApiService();
