import React, { createContext, useContext, useState } from 'react';
type User = {
  id: string;
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  gioi_tinh: string;
  anh_dai_dien: string;
  so_lan_vi_pham: number;  
  id_phan_quyen: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
