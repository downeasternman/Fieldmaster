import React, { createContext, useContext } from 'react';

const UserSettingsContext = createContext(null);

export const UserSettingsProvider = ({ children, value }) => {
  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}; 