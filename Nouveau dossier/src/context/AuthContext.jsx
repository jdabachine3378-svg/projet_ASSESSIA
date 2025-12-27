import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const savedAuth = storage.getAuth();
    if (savedAuth) {
      setAuth(savedAuth);
    }
  }, []);

  const login = (email, role) => {
    const authData = { email, role };
    storage.setAuth(authData);
    setAuth(authData);
  };

  const logout = () => {
    storage.clearAuth();
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
