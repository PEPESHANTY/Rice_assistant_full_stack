// API Service Layer for AIRRVie Backend Integration
const API_BASE_URL = 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = (contentType: string = 'application/json') => {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  
  // Only add Content-Type if it's not FormData (browser will set it automatically)
  if (contentType !== 'multipart/form-data') {
    headers['Content-Type'] = contentType;
  }
  
  return headers;
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    // Get the content type from headers or default to application/json
    const contentType = (options.headers as Record<string, string>)?.['Content-Type'] || 'application/json';
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(contentType),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Request OTP for phone number
  requestOTP: async (phone: string) => {
    return apiRequest('/api/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  // Verify OTP and get token
  verifyOTP: async (phone: string, otp: string) => {
    return apiRequest('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  // Login with phone and password
  login: async (phone: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  },

  // Register new user
  register: async (userData: {
    name: string;
    phone: string;
    password: string;
    language?: string;
  }) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get current user info
  getCurrentUser: async () => {
    return apiRequest('/api/auth/me');
  },

  // Logout (clear token on client side)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
};

// Farms API
export const farmsAPI = {
  // Get all farms for current user
  getFarms: async () => {
    return apiRequest('/api/farms');
  },

  // Create new farm
  createFarm: async (farmData: {
    name: string;
    province: string;
    district: string;
    addressText?: string;
  }) => {
    return apiRequest('/api/farms', {
      method: 'POST',
      body: JSON.stringify(farmData),
    });
  },

  // Update farm
  updateFarm: async (farmId: string, farmData: Partial<{
    name: string;
    province: string;
    district: string;
    addressText?: string;
  }>) => {
    return apiRequest(`/api/farms/${farmId}`, {
      method: 'PUT',
      body: JSON.stringify(farmData),
    });
  },

  // Delete farm
  deleteFarm: async (farmId: string) => {
    return apiRequest(`/api/farms/${farmId}`, {
      method: 'DELETE',
    });
  }
};

// Plots API
export const plotsAPI = {
  // Get all plots for current user
  getPlots: async () => {
    return apiRequest('/api/plots');
  },

  // Create new plot
  createPlot: async (plotData: {
    farmId: string;
    name: string;
    area_m2: number;
    soilType?: string;
    variety?: string;
    plantingDate?: string;
    harvestDate?: string;
    irrigationMethod?: string;
    notes?: string;
    photos?: string[];
  }) => {
    return apiRequest('/api/plots', {
      method: 'POST',
      body: JSON.stringify(plotData),
    });
  },

  // Update plot
  updatePlot: async (plotId: string, plotData: Partial<{
    name: string;
    area_m2: number;
    soilType?: string;
    variety?: string;
    plantingDate?: string;
    harvestDate?: string;
    irrigationMethod?: string;
    notes?: string;
    photos?: string[];
  }>) => {
    return apiRequest(`/api/plots/${plotId}`, {
      method: 'PUT',
      body: JSON.stringify(plotData),
    });
  },

  // Delete plot
  deletePlot: async (plotId: string) => {
    return apiRequest(`/api/plots/${plotId}`, {
      method: 'DELETE',
    });
  }
};

// Tasks API
export const tasksAPI = {
  // Get all tasks for current user
  getTasks: async () => {
    return apiRequest('/api/tasks');
  },

  // Create new task
  createTask: async (taskData: {
    plotId: string;
    title: string;
    description?: string;
    dueDate: string;
    priority?: 'low' | 'medium' | 'high';
    type: 'planting' | 'weeding' | 'fertilizer' | 'irrigation' | 'pest' | 'harvest' | 'other';
    reminder?: boolean;
  }) => {
    // Convert camelCase to snake_case for backend API
    const apiData = {
      plot_id: taskData.plotId,
      title: taskData.title,
      description: taskData.description,
      due_date: taskData.dueDate,
      priority: taskData.priority || 'medium',
      type: taskData.type,
      reminder: taskData.reminder || false
    };
    
    return apiRequest('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
  },

  // Update task
  updateTask: async (taskId: string, taskData: Partial<{
    title: string;
    description?: string;
    dueDate: string;
    priority?: 'low' | 'medium' | 'high';
    status?: 'pending' | 'in_progress' | 'done';
    type: 'planting' | 'weeding' | 'fertilizer' | 'irrigation' | 'pest' | 'harvest' | 'other';
    reminder?: boolean;
    completed?: boolean;
  }>) => {
    return apiRequest(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Delete task
  deleteTask: async (taskId: string) => {
    return apiRequest(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }
};

// Journal API - Using authenticated endpoints
export const journalAPI = {
  // Get all journal entries for current user
  getJournalEntries: async () => {
    return apiRequest('/api/journal');
  },

  // Create new journal entry for current user
  createJournalEntry: async (entryData: {
    plotId: string;
    date: string;
    type: 'planting' | 'fertilizer' | 'irrigation' | 'pest' | 'harvest' | 'other';
    title: string;
    content?: string;
    photos?: string[];
    audioNote?: string;
  }) => {
    // Convert camelCase to snake_case for backend API
    const apiData = {
      plot_id: entryData.plotId,
      date: entryData.date,
      type: entryData.type,
      title: entryData.title,
      content: entryData.content || '',
      photos: entryData.photos || [],
      audio_note: entryData.audioNote || ''
    };
    
    return apiRequest('/api/journal', {
      method: 'POST',
      body: JSON.stringify(apiData),
    });
  },

  // Update journal entry for current user
  updateJournalEntry: async (entryId: string, entryData: Partial<{
    title: string;
    content?: string;
    date: string;
    type: 'planting' | 'fertilizer' | 'irrigation' | 'pest' | 'harvest' | 'other';
    photos?: string[];
    audioNote?: string;
  }>) => {
    // Convert camelCase to snake_case for backend API
    const apiData: any = {};
    if (entryData.title !== undefined) apiData.title = entryData.title;
    if (entryData.content !== undefined) apiData.content = entryData.content;
    if (entryData.date !== undefined) apiData.date = entryData.date;
    if (entryData.type !== undefined) apiData.type = entryData.type;
    if (entryData.photos !== undefined) apiData.photos = entryData.photos;
    if (entryData.audioNote !== undefined) apiData.audio_note = entryData.audioNote;
    
    return apiRequest(`/api/journal/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify(apiData),
    });
  },

  // Delete journal entry for current user
  deleteJournalEntry: async (entryId: string) => {
    return apiRequest(`/api/journal/${entryId}`, {
      method: 'DELETE',
    });
  }
};

// Weather API
export const weatherAPI = {
  // Get weather data (with optional coordinates)
  getWeather: async (lat?: number, lon?: number, city?: string) => {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lon !== undefined) params.append('lon', lon.toString());
    if (city) params.append('city', city);
    
    return apiRequest(`/api/weather?${params.toString()}`);
  }
};

// Assistant API
export const assistantAPI = {
  // Get all conversations for current user
  getConversations: async () => {
    return apiRequest('/api/assistant/conversations');
  },

  // Get specific conversation with messages
  getConversation: async (conversationId: string) => {
    return apiRequest(`/api/assistant/conversations/${conversationId}`);
  },

  // Create new conversation
  createConversation: async (context?: any) => {
    return apiRequest('/api/assistant/conversations', {
      method: 'POST',
      body: JSON.stringify({ context }),
    });
  },

  // Send message to conversation
  sendMessage: async (conversationId: string, message: string, metadata?: any) => {
    return apiRequest(`/api/assistant/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ 
        content: message,
        metadata 
      }),
    });
  },

  // Get suggested questions
  getSuggestedQuestions: async () => {
    return apiRequest('/api/assistant/suggestions');
  }
};

// Uploads API - Using no-auth endpoints
export const uploadsAPI = {
  // Upload image file (no auth)
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/api/uploads/images/no-auth', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
    });
  },

  // Upload audio file (no auth)
  uploadAudio: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest('/api/uploads/audio/no-auth', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
    });
  },

  // Delete media file (no auth)
  deleteMedia: async (mediaId: string) => {
    return apiRequest(`/api/uploads/${mediaId}`, {
      method: 'DELETE',
    });
  }
};

// Users API
export const usersAPI = {
  // Get current user profile
  getProfile: async () => {
    return apiRequest('/api/users');
  },

  // Update user profile
  updateProfile: async (userData: Partial<{
    name: string;
    email?: string;
    phone?: string;
    language: string;
    font_scale?: string;
  }>) => {
    return apiRequest('/api/users', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    return apiRequest('/');
  },

  checkAPIStatus: async () => {
    return apiRequest('/api/status');
  }
};

// Demo data for fallback
export const demoData = {
  user: {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Demo Farmer',
    email: 'demo@airrvie.app',
    phone: '+84123456789',
    language: 'VI' as const,
    farms: [
      {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Trang Trại Mẫu',
        location: 'An Giang, Việt Nam',
        plots: [
          {
            id: '33333333-3333-3333-3333-333333333333',
            name: 'Lô Lúa Chính',
            soilType: 'Phù sa',
            riceVariety: 'OM 5451',
            sowingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            harvestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            irrigation: 'Tưới ngập',
            area: 5000,
            areaUnit: 'm²',
            photos: []
          }
        ]
      }
    ]
  },

  tasks: [
    {
      id: '44444444-4444-4444-4444-444444444444',
      plotId: '33333333-3333-3333-3333-333333333333',
      title: 'Bón phân đợt 1',
      description: 'Bón phân NPK 20-20-15 với liều lượng 80kg/ha',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      type: 'fertilizer' as const,
      reminder: true
    }
  ],

  journalEntries: [
    {
      id: '77777777-7777-7777-7777-777777777777',
      plotId: '33333333-3333-3333-3333-333333333333',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'planting' as const,
      title: 'Gieo sạ giống lúa',
      content: 'Đã gieo sạ giống OM 5451 với mật độ 120kg/ha. Thời tiết thuận lợi, đất đủ ẩm.',
      photos: []
    },
    {
      id: '88888888-8888-8888-8888-888888888888',
      plotId: '33333333-3333-3333-3333-333333333333',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'irrigation' as const,
      title: 'Tưới nước lần đầu',
      content: 'Tưới ngập nước lần đầu tiên sau khi gieo sạ. Mực nước duy trì 3-5cm.',
      photos: []
    }
  ],

  weather: {
    location: 'Xã Trà Côn, Vĩnh Long Province, VN',
    timezone: 'Asia/Ho_Chi_Minh',
    current: {
      temperature: 25,
      humidity: 78,
      rainfall: 0,
      windSpeed: 12,
      condition: 'Clouds'
    },
    forecast: [
      { date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], high: 32, low: 24, rainfall: 0, condition: 'Sunny' },
      { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], high: 30, low: 23, rainfall: 5, condition: 'Light Rain' },
      { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], high: 29, low: 22, rainfall: 15, condition: 'Rain' },
      { date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], high: 31, low: 25, rainfall: 0, condition: 'Partly Cloudy' },
      { date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], high: 33, low: 26, rainfall: 0, condition: 'Sunny' }
    ],
    alerts: [
      {
        type: 'Weather Advisory',
        message: 'Monitor weather conditions for potential changes',
        severity: 'low' as const
      }
    ]
  }
};
