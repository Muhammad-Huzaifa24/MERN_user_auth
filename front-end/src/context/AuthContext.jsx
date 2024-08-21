// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verifyToken } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const isValid = await verifyToken(token);
          setIsAuthenticated(isValid);
          if (isValid) {
            navigate("/home");
          }
        } catch (error) {
          toast.error("Authentication failed, please log in again.");
          localStorage.removeItem("token");
          navigate("/");
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  const login = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
