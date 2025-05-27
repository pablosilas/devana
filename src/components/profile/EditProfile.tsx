// components/profile/EditProfile.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Code,
  Save,
  ArrowLeft,
  Camera,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../layout/MainLayout";

interface EditProfileFormData {
  name: string;
  email: string;
  birthDate: string;
  role: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface para os dados de atualização do perfil
interface UpdateProfileData {
  name: string;
  email: string;
  birthDate: string;
  role: string;
  currentPassword?: string;
  newPassword?: string;
}

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, userType, refreshAuth } = useAuth();

  // Estados do formulário
  const [formData, setFormData] = useState<EditProfileFormData>({
    name: "",
    email: "",
    birthDate: "",
    role: "frontend",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Carregar dados do usuário
  useEffect(() => {
    if (user && userType === "user") {
      setFormData({
        name: user.name,
        email: user.email,
        birthDate: user.birthDate.split("T")[0], // Formatar data para input
        role: user.role,
      });
    }
  }, [user, userType]);

  // Verificar se é convidado
  if (userType === "guest") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-600">
          <h2 className="text-xl font-bold text-white mb-4">Acesso Restrito</h2>
          <p className="text-gray-300 mb-6">
            Convidados não podem editar perfil. Faça login ou registre-se para
            acessar esta funcionalidade.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Voltar ao Desktop
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors([]); // Limpar erros ao digitar
    setSuccessMessage("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setErrors([]);
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push("Nome é obrigatório");
    }

    if (!formData.email.trim()) {
      newErrors.push("Email é obrigatório");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Email deve ter um formato válido");
    }

    if (!formData.birthDate) {
      newErrors.push("Data de nascimento é obrigatória");
    }

    // Validação de senha se seção estiver aberta
    if (showPasswordSection) {
      if (!passwordData.currentPassword) {
        newErrors.push("Senha atual é obrigatória");
      }

      if (!passwordData.newPassword) {
        newErrors.push("Nova senha é obrigatória");
      } else if (passwordData.newPassword.length < 6) {
        newErrors.push("Nova senha deve ter pelo menos 6 caracteres");
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.push("Confirmação de senha não confere");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = "http://localhost:3003";
      const token = localStorage.getItem("authToken");

      // Preparar dados para envio com tipagem adequada
      const updateData: UpdateProfileData = {
        name: formData.name,
        email: formData.email,
        birthDate: formData.birthDate,
        role: formData.role,
      };

      // Adicionar dados de senha se necessário
      if (showPasswordSection && passwordData.newPassword) {
        updateData.currentPassword = passwordData.currentPassword;
        updateData.newPassword = passwordData.newPassword;
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar perfil");
      }

      const updatedUser = await response.json();

      // Atualizar dados no localStorage
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      // Forçar refresh do contexto
      refreshAuth();

      setSuccessMessage("Perfil atualizado com sucesso!");

      // Limpar dados de senha
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "frontend", label: "Frontend Developer" },
    { value: "backend", label: "Backend Developer" },
    { value: "fullstack", label: "Fullstack Developer" },
    { value: "mobile", label: "Mobile Developer" },
    { value: "devops", label: "DevOps Engineer" },
    { value: "ui-ux", label: "UI/UX Developer" },
    { value: "data", label: "Data Engineer" },
    { value: "qa", label: "QA Engineer" },
  ];

  return (
    <MainLayout showSidebar={false} showFooter={false}>
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
          </div>

          {/* Mensagens de Erro/Sucesso */}
          {errors.length > 0 && (
            <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle size={16} className="text-red-400" />
                <span className="text-red-400 font-medium">
                  Erro(s) encontrado(s):
                </span>
              </div>
              <ul className="text-red-300 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Foto do Perfil</h3>
                  <p className="text-gray-400 text-sm">
                    Clique para alterar sua foto
                  </p>
                  <button
                    type="button"
                    className="mt-2 flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <Camera size={14} />
                    <span>Alterar Foto</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dados Pessoais */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
              <h3 className="text-white font-medium mb-4">Dados Pessoais</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
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
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400"
                      placeholder="Seu nome completo"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
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
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400"
                      placeholder="seu@email.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Data de Nascimento */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
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
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Função */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Função como Desenvolvedor
                  </label>
                  <div className="relative">
                    <Code
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white appearance-none"
                      disabled={loading}
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Senha */}
            <div className="bg-gray-800 rounded-lg border border-gray-600">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Alterar Senha</h3>
                  <button
                    type="button"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {showPasswordSection ? "Cancelar" : "Alterar Senha"}
                  </button>
                </div>

                {showPasswordSection && (
                  <div className="space-y-4">
                    {/* Senha Atual */}
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          size={16}
                        />
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400"
                          placeholder="Sua senha atual"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nova Senha */}
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Nova Senha
                        </label>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            size={16}
                          />
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400"
                            placeholder="Nova senha"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Confirmar Nova Senha */}
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Confirmar Nova Senha
                        </label>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            size={16}
                          />
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-400"
                            placeholder="Confirme a nova senha"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProfile;
