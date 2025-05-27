// contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Tipos para os dados do usuário
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  birthDate: string;
}

export interface Guest {
  id: number;
  name: string;
  sessionId: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userType: "user" | "guest" | null;
  user: User | null;
  guest: Guest | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (userData: { access_token: string; user: User; type: "user" }) => void;
  register: (userData: {
    access_token: string;
    user: User;
    type: "user";
  }) => void;
  guestAccess: (userData: {
    access_token: string;
    guest: Guest;
    type: "guest";
  }) => void;
  logout: () => void;
  getCurrentUser: () => User | Guest | null;
  getUserDisplayName: () => string;
  getUserEmail: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    user: null,
    guest: null,
    token: null,
  });

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType") as
      | "user"
      | "guest"
      | null;

    if (token && userType) {
      if (userType === "user") {
        // Para usuários, você pode fazer uma requisição para buscar os dados atuais
        // ou salvar os dados no localStorage também
        const savedUser = localStorage.getItem("userData");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setAuthState({
            isAuthenticated: true,
            userType: "user",
            user,
            guest: null,
            token,
          });
        }
      } else if (userType === "guest") {
        const guestName = sessionStorage.getItem("guestName");
        const guestSessionId = sessionStorage.getItem("guestSessionId");

        if (guestName && guestSessionId) {
          const guest: Guest = {
            id: Date.now(), // ID temporário para guest
            name: guestName,
            sessionId: guestSessionId,
          };

          setAuthState({
            isAuthenticated: true,
            userType: "guest",
            user: null,
            guest,
            token,
          });
        }
      }
    }
  }, []);

  const login = (userData: {
    access_token: string;
    user: User;
    type: "user";
  }) => {
    localStorage.setItem("authToken", userData.access_token);
    localStorage.setItem("userType", userData.type);
    localStorage.setItem("userData", JSON.stringify(userData.user));

    setAuthState({
      isAuthenticated: true,
      userType: "user",
      user: userData.user,
      guest: null,
      token: userData.access_token,
    });
  };

  const register = (userData: {
    access_token: string;
    user: User;
    type: "user";
  }) => {
    localStorage.setItem("authToken", userData.access_token);
    localStorage.setItem("userType", userData.type);
    localStorage.setItem("userData", JSON.stringify(userData.user));

    setAuthState({
      isAuthenticated: true,
      userType: "user",
      user: userData.user,
      guest: null,
      token: userData.access_token,
    });
  };

  const guestAccess = (userData: {
    access_token: string;
    guest: Guest;
    type: "guest";
  }) => {
    localStorage.setItem("authToken", userData.access_token);
    localStorage.setItem("userType", userData.type);
    sessionStorage.setItem("guestName", userData.guest.name);
    sessionStorage.setItem("guestSessionId", userData.guest.sessionId);

    setAuthState({
      isAuthenticated: true,
      userType: "guest",
      user: null,
      guest: userData.guest,
      token: userData.access_token,
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("guestName");
    sessionStorage.removeItem("guestSessionId");

    setAuthState({
      isAuthenticated: false,
      userType: null,
      user: null,
      guest: null,
      token: null,
    });
  };

  const getCurrentUser = (): User | Guest | null => {
    return authState.userType === "user" ? authState.user : authState.guest;
  };

  const getUserDisplayName = (): string => {
    if (authState.userType === "user" && authState.user) {
      return authState.user.name;
    } else if (authState.userType === "guest" && authState.guest) {
      return authState.guest.name;
    }
    return "Usuário";
  };

  const getUserEmail = (): string | null => {
    if (authState.userType === "user" && authState.user) {
      return authState.user.email;
    }
    return null; // Guests não têm email
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    guestAccess,
    logout,
    getCurrentUser,
    getUserDisplayName,
    getUserEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
