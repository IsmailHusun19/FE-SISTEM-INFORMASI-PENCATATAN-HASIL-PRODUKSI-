import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ApiMe } from "../service/Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await ApiMe();
        if (res?.success) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    check();
  }, []);
  
  const logout = () => {
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
