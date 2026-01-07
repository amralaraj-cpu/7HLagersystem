// API Client that mimics base44 structure but uses 7HLager backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getToken = () => localStorage.getItem('token');

// Helper to make authenticated requests
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Create entity API with base44-like methods
function createEntityAPI(entityName) {
  const endpoint = `/${entityName.toLowerCase()}s`;

  return {
    // List all or with sorting
    async list(sort = '', limit = 500) {
      let url = endpoint;
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (sort) params.append('sort', sort);
      if (params.toString()) url += `?${params}`;
      return apiRequest(url);
    },

    // Filter with conditions
    async filter(conditions = {}, sort = '', limit = 500) {
      let url = endpoint;
      const params = new URLSearchParams();
      Object.entries(conditions).forEach(([key, value]) => {
        params.append(key, value);
      });
      if (limit) params.append('limit', limit);
      if (sort) params.append('sort', sort);
      if (params.toString()) url += `?${params}`;
      return apiRequest(url);
    },

    // Get single entity
    async get(id) {
      return apiRequest(`${endpoint}/${id}`);
    },

    // Create new entity
    async create(data) {
      return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    // Update existing entity
    async update(id, data) {
      return apiRequest(`${endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    // Delete entity
    async delete(id) {
      return apiRequest(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
    },
  };
}

// Export base44-compatible API client
export const base44 = {
  entities: {
    Tire: createEntityAPI('tire'),
    TireSet: createEntityAPI('tireset'),
    Customer: createEntityAPI('customer'),
    CustomerTireSet: createEntityAPI('customertireset'),
    SalesOrder: createEntityAPI('salesorder'),
    User: createEntityAPI('user'),
    WarehousePosition: createEntityAPI('warehouseposition'),
  },

  auth: {
    async login(email, password) {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    },

    async logout() {
      localStorage.removeItem('token');
      window.location.href = '/login';
    },

    async me() {
      return apiRequest('/auth/me');
    },

    async register(data) {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  users: {
    async inviteUser(email, role) {
      return apiRequest('/users/invite', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      });
    },
  },
};
