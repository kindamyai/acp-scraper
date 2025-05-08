import api from './api'; import { User } from 
'../types'; export const authService = {
  // Register new user
  register: async (username: string, email: 
  string, password: string): Promise<{ user: 
  User; token: string }> => {
    const response = await 
    api.post('/auth/register', {
      username, email, password,
    });
    return response.data;
  },
  
  // Login user
  login: async (email: string, password: 
  string): Promise<{ user: User; token: 
  string }> => {
    const response = await 
    api.post('/auth/login', {
      email, password,
    });
    // Store token in localStorage
    if (response.data.token) { 
      localStorage.setItem('token', 
      response.data.token);
    }
    return response.data;
  },
  
  // Logout user
  logout: (): void => { 
    localStorage.removeItem('token');
  },
  
  // Get current user
  getCurrentUser: async (): Promise<User> => 
  {
    const response = await 
    api.get('/auth/me'); return 
    response.data;
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => { return 
    localStorage.getItem('token') !== null;
  },
};
