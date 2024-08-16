import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const accessToken = localStorage.getItem('token');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (accessToken) {
          const response = await axios.get('https://nuniali-51afdf69a4d2.herokuapp.com/auth/validate-token', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (response.data.message === 'Token is valid') {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
