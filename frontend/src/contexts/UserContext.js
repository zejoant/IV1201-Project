import React, { createContext, useState, useEffect } from 'react';

/**
 * Context for managing the current user state across the application.
 * Provides currentUser, login and logout functions.
 *
 * @type {React.Context<{currentUser: Object|null, login: Function, logout: Function}>}
 */
export const UserContext = createContext();

/**
 * Provider component that wraps the app and makes user object available to any
 * child component that calls useContext(UserContext).
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The provider with user state
 */
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Restore user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  /**
   * Logs in a user: sets state and stores in localStorage.
   * @param {Object} user - The user object from backend
   */
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  /**
   * Logs out the current user: clears state and localStorage,
   * and optionally calls logout endpoint.
   */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // Optionally call logout endpoint (fire-and-forget)
    fetch('/account/sign_out', { method: 'POST', credentials: 'include' }).catch(() => {});
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}