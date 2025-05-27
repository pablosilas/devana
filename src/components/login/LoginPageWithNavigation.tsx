import React from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";

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

  const handleLogin = (userData: LoginResponse) => {
    console.log("Login realizado:", userData);
    console.log("Usuário:", userData.user);
    console.log("Token:", userData.access_token);

    // Token já foi salvo no localStorage pelo AuthPage
    // Agora só precisamos navegar
    navigate("/home");
  };

  const handleRegister = (userData: RegisterResponse) => {
    console.log("Cadastro realizado:", userData);
    console.log("Usuário:", userData.user);
    console.log("Token:", userData.access_token);

    // Token já foi salvo no localStorage pelo AuthPage
    // Agora só precisamos navegar
    navigate("/home");
  };

  const handleGuestAccess = (userData: GuestResponse) => {
    console.log("Acesso como convidado:", userData);
    console.log("Convidado:", userData.guest);
    console.log("Token:", userData.access_token);

    // Token já foi salvo no localStorage pelo AuthPage
    // Podemos salvar info adicional se necessário
    sessionStorage.setItem("guestName", userData.guest.name);
    sessionStorage.setItem("guestSessionId", userData.guest.sessionId);

    // Navegar para versão limitada ou home
    navigate("/home");
  };

  return (
    <AuthPage
      onLogin={handleLogin}
      onRegister={handleRegister}
      onGuestAccess={handleGuestAccess}
    />
  );
};

export default LoginPageWithNavigation;
