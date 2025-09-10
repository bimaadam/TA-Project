// src/context/UserContext.tsx
"use client";

import React,
  { createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  // Add other user profile fields as needed
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isReady: boolean; // New state
  fetchUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // const [user, setUser] = useState<{ fullName?: string; email?: string } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false); // New state
  const router = useRouter();

  const fetchUser = async () => {
  setLoading(true);
  setError(null);
  try {
  const userData = await authService.getProfile();
  setUser(userData); // ini udah langsung { id, email, fullName, role }

  } catch (err: unknown) {
  let message = "Failed to fetch user profile.";

  if (err instanceof Error) {
    message = err.message;

    if (err.message.includes("401")) {
      authService.removeToken();
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    }
  }

  setError(message);
  setUser(null);
} finally {
  setLoading(false);
  setIsReady(true);
}

};


  const logout = () => {
    authService.removeToken();
    setUser(null);
    setTimeout(() => {
      router.push('/')
    }, 2000)
  };

  useEffect(() => {
    // Fetch user on initial load if token exists
    if (authService.getToken()) {
      fetchUser();
    } else {
      setLoading(false); // No token, so not loading user
      setIsReady(true); // Set ready if no token found
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, isReady, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
