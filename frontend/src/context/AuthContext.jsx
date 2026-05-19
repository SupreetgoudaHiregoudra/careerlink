import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      const storedUser =
        localStorage.getItem("user");

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error(
        "CareerLink auth initialization failed:",
        error
      );

      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthStorage = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("refreshToken");

    localStorage.removeItem("user");
  };

  const login = (userData, token) => {
  localStorage.setItem(
    "token",
    token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(userData)
  );

  setUser(userData);

  setIsAuthenticated(true);
};
  const logout = () => {
    clearAuthStorage();

    setUser(null);

    setIsAuthenticated(false);

    window.location.href = "/";
  };

  const updateUser = (updatedUserData) => {
    const mergedUser = {
      ...user,
      ...updatedUserData,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(mergedUser)
    );

    setUser(mergedUser);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuthStatus: initializeAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};