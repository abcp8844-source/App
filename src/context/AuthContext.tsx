import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'customer' | 'merchant' | 'admin' | null;

interface AuthContextType {
  userToken: string | null;
  role: UserRole;
  isLoading: boolean;
  signIn: (token: string, userRole: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const savedRole = await AsyncStorage.getItem('userRole') as UserRole;
        setUserToken(token);
        setRole(savedRole);
      } catch (e) {
        console.error("Failed to load auth state", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const signIn = async (token: string, userRole: UserRole) => {
    setUserToken(token);
    setRole(userRole);
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userRole', userRole || '');
  };

  const signOut = async () => {
    setUserToken(null);
    setRole(null);
    await AsyncStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ userToken, role, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
