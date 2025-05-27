import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import { useAuth } from "../../context/AuthContext";

// Interfaces das respostas da API (mesmas do AuthPage)
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  birthDate: string;
}

interface Guest {
  id: number;
  name: string;
  sessionId: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
  type: "user";
}

interface RegisterResponse {
  access_token: string;
  user: User;
  type: "user";
}

interface GuestResponse {
  access_token: string;
  guest: Guest;
  type: "guest";
}

const LoginPageWithNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, guestAccess, isAuthenticated, isLoading } =
    useAuth();

  // Redirecionar para home se já estiver logado
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("✅ Usuário já está logado, redirecionando para home");
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = (userData: LoginResponse) => {
    console.log("Login realizado:", userData);

    // Usar o método login do contexto
    login(userData);

    // Navegar para home
    navigate("/home");
  };

  const handleRegister = (userData: RegisterResponse) => {
    console.log("Cadastro realizado:", userData);

    // Usar o método register do contexto
    register(userData);

    // Navegar para home
    navigate("/home");
  };

  const handleGuestAccess = (userData: GuestResponse) => {
    console.log("Acesso como convidado:", userData);

    // Usar o método guestAccess do contexto
    guestAccess(userData);

    // Navegar para home
    navigate("/home");
  };

  // Mostrar loading se ainda está verificando autenticação
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-white text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthPage
      onLogin={handleLogin}
      onRegister={handleRegister}
      onGuestAccess={handleGuestAccess}
    />
  );
};

export default LoginPageWithNavigation;
