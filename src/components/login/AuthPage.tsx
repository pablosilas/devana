import React, { useState } from "react";
import {
  User,
  Lock,
  Mail,
  Calendar,
  Code,
  UserCheck,
  LogIn,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  role: string;
}

interface GuestFormData {
  name: string;
}

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

interface AuthPageProps {
  onLogin: (userData: LoginResponse) => void;
  onRegister: (userData: RegisterResponse) => void;
  onGuestAccess: (userData: GuestResponse) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({
  onLogin,
  onRegister,
  onGuestAccess,
}) => {
  const API_BASE_URL = "http://localhost:3003";

  const [currentMode, setCurrentMode] = useState<
    "login" | "register" | "guest"
  >("login");
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false); // ← ADICIONADO: estado de loading

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    birthDate: "",
    role: "frontend",
  });

  const [guestData, setGuestData] = useState<GuestFormData>({
    name: "",
  });

  // Função auxiliar para fazer requisições
  const apiRequest = async (
    endpoint: string,
    data: LoginFormData | RegisterFormData | GuestFormData
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro na requisição");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na API:", error);
      throw error;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (currentMode === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else if (currentMode === "register") {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    } else {
      setGuestData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentMode === "login") {
        if (loginData.email && loginData.password) {
          const response: LoginResponse = await apiRequest(
            "/auth/login",
            loginData
          );
          localStorage.setItem("authToken", response.access_token);
          localStorage.setItem("userType", response.type);
          onLogin(response);
        }
      } else if (currentMode === "register") {
        if (
          registerData.name &&
          registerData.email &&
          registerData.password &&
          registerData.birthDate
        ) {
          const response: RegisterResponse = await apiRequest(
            "/auth/register",
            registerData
          );
          localStorage.setItem("authToken", response.access_token);
          localStorage.setItem("userType", response.type);
          onRegister(response);
        }
      } else {
        if (guestData.name.trim()) {
          const response: GuestResponse = await apiRequest(
            "/auth/guest",
            guestData
          );
          localStorage.setItem("authToken", response.access_token);
          localStorage.setItem("userType", response.type);
          onGuestAccess(response);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setLoginData({ email: "", password: "" });
    setRegisterData({
      name: "",
      email: "",
      password: "",
      birthDate: "",
      role: "frontend",
    });
    setGuestData({ name: "" });
  };

  const switchMode = (mode: "login" | "register" | "guest") => {
    setCurrentMode(mode);
    resetForms();
  };

  const handleShowRegister = () => {
    setShowRegister(true);
    setCurrentMode("register");
    resetForms();
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
    setCurrentMode("login");
    resetForms();
  };

  const getTitle = () => {
    switch (currentMode) {
      case "login":
        return "Bem-vindo de volta";
      case "register":
        return "Criar nova conta";
      case "guest":
        return "Acesso como convidado";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-700 py-4 px-4 overflow-y-auto">
      <div className="flex justify-center">
        <div className="w-full max-w-md min-h-0">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <h1 className="text-4xl font-bold text-white font-['Space_Grotesk']">
                Devana
              </h1>
            </div>
            <p className="text-gray-400 text-sm">{getTitle()}</p>
          </div>

          {/* Form Container */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-600 p-4 mb-4">
            {/* Botão Voltar (apenas no cadastro) */}
            {showRegister && (
              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-3"
              >
                <ArrowLeft size={14} />
                <span className="text-xs">Voltar ao Login</span>
              </button>
            )}

            {/* Mode Toggle */}
            <div className="flex mb-3 bg-gray-700 rounded-lg p-1">
              {!showRegister ? (
                // Toggle Login/Convidado
                <>
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      currentMode === "login"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("guest")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      currentMode === "guest"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Convidado
                  </button>
                </>
              ) : (
                // Toggle Cadastro/Convidado
                <>
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      currentMode === "register"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Cadastro
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("guest")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      currentMode === "guest"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Convidado
                  </button>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Campos do Login */}
              {currentMode === "login" && (
                <>
                  {/* Email */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400 text-sm"
                        placeholder="seu@email.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400 text-sm"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Campos do Cadastro */}
              {currentMode === "register" && (
                <>
                  {/* Nome */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <input
                        type="text"
                        name="name"
                        value={registerData.name}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400 text-sm"
                        placeholder="Seu nome completo"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400 text-sm"
                        placeholder="seu@email.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <input
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400 text-sm"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Data de Nascimento */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Data de Nascimento
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <input
                        type="date"
                        name="birthDate"
                        value={registerData.birthDate}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white text-sm"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Função como Desenvolvedor */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Função como Desenvolvedor
                    </label>
                    <div className="relative">
                      <Code
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={16}
                      />
                      <select
                        name="role"
                        value={registerData.role}
                        onChange={handleInputChange}
                        className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white appearance-none text-sm"
                        required
                        disabled={loading}
                      >
                        <option value="frontend">Frontend Developer</option>
                        <option value="backend">Backend Developer</option>
                        <option value="fullstack">Fullstack Developer</option>
                        <option value="mobile">Mobile Developer</option>
                        <option value="devops">DevOps Engineer</option>
                        <option value="ui-ux">UI/UX Developer</option>
                        <option value="data">Data Engineer</option>
                        <option value="qa">QA Engineer</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Campos do Convidado */}
              {currentMode === "guest" && (
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Nome
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <input
                      type="text"
                      name="name"
                      value={guestData.name}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400 text-sm"
                      placeholder="Seu nome"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Link para Cadastro (apenas no Login) */}
              {currentMode === "login" && !showRegister && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleShowRegister}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    disabled={loading}
                  >
                    Não tem conta? Cadastre-se aqui
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg text-sm mt-4 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span>Carregando...</span>
                ) : (
                  <>
                    {currentMode === "login" && (
                      <>
                        <LogIn size={18} />
                        <span>Entrar</span>
                      </>
                    )}
                    {currentMode === "register" && (
                      <>
                        <UserPlus size={18} />
                        <span>Criar Conta</span>
                      </>
                    )}
                    {currentMode === "guest" && (
                      <>
                        <UserCheck size={18} />
                        <span>Entrar como Convidado</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-3 text-center">
              <p className="text-gray-400 text-xs">
                {currentMode === "login" && "Entre com suas credenciais"}
                {currentMode === "register" &&
                  "Crie sua conta para acesso completo"}
                {currentMode === "guest" &&
                  "Acesso limitado às funcionalidades principais"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
