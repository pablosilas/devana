// contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
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
  isLoading: boolean; // Adicionar estado de loading
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
  refreshAuth: () => void; // Método para forçar recarregamento
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
    isLoading: true, // Começar com loading true
  });

  // Função para carregar dados do storage
  const loadAuthFromStorage = useCallback(() => {
    console.log("🔄 Carregando dados do storage...");

    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType") as
      | "user"
      | "guest"
      | null;

    console.log("📦 Dados encontrados:", {
      token: token ? "***TOKEN***" : null,
      userType,
    });

    // Se não há token, usuário não está logado
    if (!token || !userType) {
      console.log("❌ Nenhum token encontrado, usuário não está logado");
      setAuthState({
        isAuthenticated: false,
        userType: null,
        user: null,
        guest: null,
        token: null,
        isLoading: false,
      });
      return;
    }

    // Tem token, verificar tipo de usuário
    if (userType === "user") {
      const savedUser = localStorage.getItem("userData");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          console.log("👤 Carregando usuário:", {
            name: user.name,
            email: user.email,
          });

          setAuthState({
            isAuthenticated: true,
            userType: "user",
            user,
            guest: null,
            token,
            isLoading: false,
          });
          return;
        } catch (error) {
          console.error("❌ Erro ao parsear dados do usuário:", error);
          // Se erro ao parsear, limpar tudo
          localStorage.removeItem("authToken");
          localStorage.removeItem("userType");
          localStorage.removeItem("userData");
        }
      }
    } else if (userType === "guest") {
      const guestName = sessionStorage.getItem("guestName");
      const guestSessionId = sessionStorage.getItem("guestSessionId");

      if (guestName && guestSessionId) {
        const guest: Guest = {
          id: Date.now(),
          name: guestName,
          sessionId: guestSessionId,
        };

        console.log("👥 Carregando convidado:", { name: guest.name });

        setAuthState({
          isAuthenticated: true,
          userType: "guest",
          user: null,
          guest,
          token,
          isLoading: false,
        });
        return;
      } else {
        console.log("❌ Dados de convidado incompletos, limpando");
        // Limpar dados de convidado corrompidos
        localStorage.removeItem("authToken");
        localStorage.removeItem("userType");
        sessionStorage.removeItem("guestName");
        sessionStorage.removeItem("guestSessionId");
      }
    }

    // Se chegou até aqui, dados são inválidos
    console.log("❌ Dados inválidos encontrados, limpando estado");
    setAuthState({
      isAuthenticated: false,
      userType: null,
      user: null,
      guest: null,
      token: null,
      isLoading: false,
    });
  }, []);

  // Método para forçar recarregamento (útil para debug e casos específicos)
  const refreshAuth = useCallback(() => {
    console.log("🔄 Forçando refresh do auth...");
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    setTimeout(() => {
      loadAuthFromStorage();
    }, 100);
  }, [loadAuthFromStorage]);

  // Carregar dados na inicialização
  useEffect(() => {
    console.log("🚀 Inicializando AuthProvider");
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  const login = (userData: {
    access_token: string;
    user: User;
    type: "user";
  }) => {
    console.log("🔐 Login iniciado:", {
      name: userData.user.name,
      email: userData.user.email,
    });

    // Primeiro, limpar qualquer estado anterior
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("guestName");
    sessionStorage.removeItem("guestSessionId");

    // Salvar novos dados
    localStorage.setItem("authToken", userData.access_token);
    localStorage.setItem("userType", userData.type);
    localStorage.setItem("userData", JSON.stringify(userData.user));

    // Atualizar estado imediatamente
    setAuthState({
      isAuthenticated: true,
      userType: "user",
      user: userData.user,
      guest: null,
      token: userData.access_token,
      isLoading: false,
    });

    console.log("✅ Login concluído, estado atualizado");
  };

  const register = (userData: {
    access_token: string;
    user: User;
    type: "user";
  }) => {
    console.log("📝 Registro iniciado:", {
      name: userData.user.name,
      email: userData.user.email,
    });

    // Limpar estado anterior
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("guestName");
    sessionStorage.removeItem("guestSessionId");

    // Salvar novos dados
    localStorage.setItem("authToken", userData.access_token);
    localStorage.setItem("userType", userData.type);
    localStorage.setItem("userData", JSON.stringify(userData.user));

    // Atualizar estado imediatamente
    setAuthState({
      isAuthenticated: true,
      userType: "user",
      user: userData.user,
      guest: null,
      token: userData.access_token,
      isLoading: false,
    });

    console.log("✅ Registro concluído, estado atualizado");
  };

  const guestAccess = (userData: {
    access_token: string;
    guest: Guest;
    type: "guest";
  }) => {
    console.log("👥 Acesso de convidado iniciado:", {
      name: userData.guest.name,
    });

    // Limpar estado anterior
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("guestName");
    sessionStorage.removeItem("guestSessionId");

    // Salvar novos dados
    localStorage.setItem("authToken", userData.access_token);
    localStorage.setItem("userType", userData.type);
    sessionStorage.setItem("guestName", userData.guest.name);
    sessionStorage.setItem("guestSessionId", userData.guest.sessionId);

    // Atualizar estado imediatamente
    setAuthState({
      isAuthenticated: true,
      userType: "guest",
      user: null,
      guest: userData.guest,
      token: userData.access_token,
      isLoading: false,
    });

    console.log("✅ Acesso de convidado concluído, estado atualizado");
  };

  const logout = () => {
    console.log("🚪 Logout iniciado");

    // Remover do storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("guestName");
    sessionStorage.removeItem("guestSessionId");

    // Atualizar estado imediatamente
    setAuthState({
      isAuthenticated: false,
      userType: null,
      user: null,
      guest: null,
      token: null,
      isLoading: false,
    });

    console.log("✅ Logout concluído, estado limpo");
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
    return null;
  };

  // Log do estado atual para debug
  console.log("🔍 Estado atual do Auth:", {
    isAuthenticated: authState.isAuthenticated,
    userType: authState.userType,
    userName: authState.user?.name || authState.guest?.name || "N/A",
    userEmail: authState.user?.email || "N/A",
    isLoading: authState.isLoading,
  });

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    guestAccess,
    logout,
    getCurrentUser,
    getUserDisplayName,
    getUserEmail,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
