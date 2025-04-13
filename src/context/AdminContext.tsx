
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

type AdminContextType = {
  isAdmin: boolean;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Check if current user is the admin (kartikmehta18)
  const isAdmin = user?.email === 'kartikmehta18@gmail.com' || 
                  user?.id === 'kartikmehta18';
  
  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
