import create from 'zustand'; import { User } 
from '../types'; import { authService } from 
'../services/auth'; interface AuthState {
  user: User | null; isLoading: boolean; 
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => 
  Promise<void>; register: (username: string, 
  email: string, password: string) => 
  Promise<void>; logout: () => void; 
  loadUser: () => Promise<void>; clearError: 
  () => void;
}
export const useAuthStore = 
create<AuthState>((set) => ({
  user: null, isLoading: false, error: null,
  
  login: async (email, password) => { try { 
      set({ isLoading: true, error: null }); 
      const { user } = await 
      authService.login(email, password); 
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error 
        instanceof Error ? error.message : 
        'Login failed'
      });
      throw error;
    }
  },
  
  register: async (username, email, password) 
  => {
    try { set({ isLoading: true, error: null 
      });
      const { user } = await 
      authService.register(username, email, 
      password); set({ user, isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false, error: error 
        instanceof Error ? error.message : 
        'Registration failed'
      });
      throw error;
    }
  },
  
  logout: () => { authService.logout(); set({ 
    user: null });
  },
  
  loadUser: async () => { if 
    (!authService.isAuthenticated()) {
      set({ user: null }); return;
    }
    
    try { set({ isLoading: true, error: null 
      });
      const user = await 
      authService.getCurrentUser(); set({ 
      user, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false, 
        error: error instanceof Error ? 
        error.message : 'Failed to load user'
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));
