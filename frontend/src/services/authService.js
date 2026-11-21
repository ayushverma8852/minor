import api from './api';

export const authService = {
  /**
   * Log in user with credentials
   */
  async login(usernameOrEmail, password) {
    try {
      const response = await api.post('/api/auth/login', {
        usernameOrEmail,
        password
      });

      const { accessToken, user } = response.data;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('interviewprep_jwt', accessToken);
      }
      if (user) {
        localStorage.setItem('interviewprep_user', JSON.stringify(user));
      }
      return { success: true, user, token: accessToken, source: 'backend' };
    } catch (error) {
      console.warn('[authService] Backend login call failed, trying local fallback:', error.message);
      
      // Local fallback for demo credentials when backend is offline
      if (
        (usernameOrEmail === 'demo@interviewprep.ai' || usernameOrEmail === 'demouser') &&
        password === 'DemoPass123!'
      ) {
        const demoUser = {
          id: 1,
          username: 'demouser',
          email: 'demo@interviewprep.ai',
          fullName: 'Alex Morgan',
          role: 'ROLE_USER'
        };
        const demoToken = 'mock-jwt-demo-alex-morgan';
        localStorage.setItem('token', demoToken);
        localStorage.setItem('interviewprep_jwt', demoToken);
        localStorage.setItem('interviewprep_user', JSON.stringify(demoUser));
        return { success: true, user: demoUser, token: demoToken, source: 'local-fallback' };
      }

      throw error;
    }
  },

  /**
   * Register new user account
   */
  async register({ username, email, password, fullName }) {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        fullName
      });

      const { accessToken, user } = response.data;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        localStorage.setItem('interviewprep_jwt', accessToken);
      }
      if (user) {
        localStorage.setItem('interviewprep_user', JSON.stringify(user));
      }
      return { success: true, user, token: accessToken, source: 'backend' };
    } catch (error) {
      console.warn('[authService] Backend register call failed, using local registration:', error.message);
      
      // Local fallback for offline demo
      const newUser = {
        id: Date.now(),
        username,
        email,
        fullName: fullName || username,
        role: 'ROLE_USER'
      };
      const token = `mock-jwt-${username}-${Date.now()}`;
      localStorage.setItem('token', token);
      localStorage.setItem('interviewprep_jwt', token);
      localStorage.setItem('interviewprep_user', JSON.stringify(newUser));
      return { success: true, user: newUser, token, source: 'local-fallback' };
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data) {
        localStorage.setItem('interviewprep_user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.warn('[authService] Could not fetch current user from backend:', error.message);
    }

    const localUser = localStorage.getItem('interviewprep_user');
    return localUser ? JSON.parse(localUser) : null;
  },

  /**
   * Update user profile information
   */
  async updateProfile({ fullName, email }) {
    try {
      const response = await api.put('/api/auth/profile', { fullName, email });
      if (response.data) {
        localStorage.setItem('interviewprep_user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.warn('[authService] Backend profile update failed, updating locally:', error.message);
    }

    const localUser = JSON.parse(localStorage.getItem('interviewprep_user') || '{}');
    const updated = { ...localUser, fullName: fullName || localUser.fullName, email: email || localUser.email };
    localStorage.setItem('interviewprep_user', JSON.stringify(updated));
    return updated;
  },

  /**
   * Log out user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('interviewprep_jwt');
    localStorage.removeItem('interviewprep_user');
    return { success: true };
  }
};

export default authService;
