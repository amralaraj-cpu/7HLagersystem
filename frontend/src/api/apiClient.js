// API Client for base44.com backend
const BASE44_APP_ID = '695d0c9f78f4807eec0ee22e';
const API_BASE_URL = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

// Helper to get API key (you can get this from User.me() or store in env)
const getApiKey = () => {
  return localStorage.getItem('base44_api_key') || import.meta.env.VITE_BASE44_API_KEY;
};

// Helper to make authenticated requests to base44
async function apiRequest(endpoint, options = {}) {
  const apiKey = getApiKey();
  const headers = {
    'Content-Type': 'application/json',
    'api_key': apiKey,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Unauthorized - clear API key and redirect to login
      localStorage.removeItem('base44_api_key');
      window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// Create entity API with base44 methods
function createEntityAPI(entityName) {
  const endpoint = `/entities/${entityName}`;

  return {
    // List all entities
    async list(sort = '', limit = 500) {
      let url = endpoint;
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (sort) params.append('sort', sort);
      if (params.toString()) url += `?${params}`;
      return apiRequest(url);
    },

    // Filter entities with conditions
    async filter(conditions = {}, sort = '', limit = 500) {
      let url = endpoint;
      const params = new URLSearchParams();
      Object.entries(conditions).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      if (limit) params.append('limit', limit);
      if (sort) params.append('sort', sort);
      if (params.toString()) url += `?${params}`;
      return apiRequest(url);
    },

    // Get single entity by ID
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
    Tire: createEntityAPI('Tire'),
    TireSet: createEntityAPI('TireSet'),
    Customer: createEntityAPI('Customer'),
    CustomerTireSet: createEntityAPI('CustomerTireSet'),
    SalesOrder: createEntityAPI('SalesOrder'),
    User: createEntityAPI('User'),
    WarehousePosition: createEntityAPI('WarehousePosition'),
    SystemSettings: createEntityAPI('SystemSettings'),
  },

  auth: {
    // Get current user info and API key
    async me() {
      const response = await fetch('https://app.base44.com/api/user/me', {
        headers: {
          'api_key': getApiKey(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get user info');
      }
      const user = await response.json();
      // Store API key if provided
      if (user.api_key) {
        localStorage.setItem('base44_api_key', user.api_key);
      }
      return user;
    },

    // Login (base44 uses API keys, so this stores the key)
    async login(apiKey) {
      localStorage.setItem('base44_api_key', apiKey);
      // Verify the API key works
      return this.me();
    },

    // Logout
    async logout() {
      localStorage.removeItem('base44_api_key');
      window.location.href = '/login';
    },

    // Check if user is authenticated
    isAuthenticated() {
      return !!getApiKey();
    },
  },
};
