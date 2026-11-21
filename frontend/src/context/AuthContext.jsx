import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEMO_USER = {
  id: 'usr-demo-01',
  name: 'Ayush Sharma',
  email: 'demo@interviewprep.ai',
  password: 'password123',
  targetRole: 'Full Stack & Software Developer',
  experienceLevel: 'Entry Level (0-1 yrs)',
  college: 'Apex Institute of Technology',
  degree: 'B.Tech in Computer Science & Engineering',
  graduationYear: '2027',
  bio: 'Computer Science student passionate about technical interview preparation, algorithms, Java, Python, React, and building scalable modern web apps.',
  preferredTech: ['Java', 'Python', 'JavaScript', 'React', 'SQL'],
  avatarInitials: 'AS',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  joinedDate: 'November 2026'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('interviewprep_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    }
    // Start as null if not logged in so Login/Signup workflow is front and center
    return null;
  });

  const [authError, setAuthError] = useState('');

  // Persist user whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('interviewprep_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('interviewprep_user');
    }
  }, [user]);

  // Seed demo user in registered users list if empty
  useEffect(() => {
    try {
      const existing = localStorage.getItem('interviewprep_users');
      if (!existing) {
        localStorage.setItem('interviewprep_users', JSON.stringify([DEMO_USER]));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getUsers = () => {
    try {
      const stored = localStorage.getItem('interviewprep_users');
      return stored ? JSON.parse(stored) : [DEMO_USER];
    } catch (e) {
      return [DEMO_USER];
    }
  };

  const login = (email, password) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setAuthError('Please provide both email and password.');
      return false;
    }

    const users = getUsers();
    const matched = users.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
    );

    if (matched) {
      const { password: _, ...userData } = matched;
      setUser(userData);
      return true;
    }

    // Special allowance for demo credentials
    if (cleanEmail === 'demo@interviewprep.ai' && cleanPassword === 'password123') {
      setUser(DEMO_USER);
      return true;
    }

    setAuthError('Invalid email or password. Use demo credentials or sign up.');
    return false;
  };

  const loginAsDemo = () => {
    setAuthError('');
    setUser(DEMO_USER);
    return true;
  };

  const signup = ({ name, email, password, targetRole, experienceLevel }) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail || !password) {
      setAuthError('Please fill out all required fields.');
      return false;
    }

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      setAuthError('An account with this email already exists. Please log in.');
      return false;
    }

    const initials = cleanName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'IP';

    const newUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: password.trim(),
      targetRole: targetRole || 'Software Developer',
      experienceLevel: experienceLevel || 'Beginner',
      college: 'Computer Science & Engineering',
      degree: 'Undergraduate Program',
      graduationYear: '2027',
      bio: `Aspiring ${targetRole || 'Software Developer'} preparing for technical interviews.`,
      preferredTech: ['Java', 'JavaScript', 'React'],
      avatarInitials: initials,
      avatarUrl: '',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    users.push(newUser);
    try {
      localStorage.setItem('interviewprep_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }

    const { password: _, ...userData } = newUser;
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('interviewprep_user');
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      try {
        const users = getUsers();
        const index = users.findIndex(u => u.id === updated.id || u.email === updated.email);
        if (index !== -1) {
          users[index] = { ...users[index], ...updatedFields };
          localStorage.setItem('interviewprep_users', JSON.stringify(users));
        }
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authError,
        setAuthError,
        login,
        loginAsDemo,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
