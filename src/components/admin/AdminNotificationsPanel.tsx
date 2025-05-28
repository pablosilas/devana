// src/components/admin/AdminNotificationsPanel.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Bell,
  AlertCircle,
  Info,
  Zap,
  Settings,
  AlertTriangle,
  ExternalLink,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useToastHelpers } from "../../hooks/useToastHelpers";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../layout/MainLayout";

interface NotificationFormData {
  title: string;
  message: string;
  type: "update" | "announcement" | "warning" | "maintenance" | "feature";
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  actionText?: string;
  expiresAt?: string;
}

interface NotificationData extends NotificationFormData {
  id: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationStats {
  total: number;
  active: number;
  inactive: number;
  recent: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

const AdminNotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: "",
    message: "",
    type: "announcement",
    priority: "medium",
    actionUrl: "",
    actionText: "",
    expiresAt: "",
  });

  const navigate = useNavigate();
  const { token, userType } = useAuth();
  const { toastSuccess, toastError, toastWarning } = useToastHelpers();

  const API_BASE_URL = "http://localhost:3003";

  // Verificar se é admin e carregar dados
  useEffect(() => {
    checkAdminAccess();
  }, []);

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Erro na requisição");
    }

    return response.json();
  };

  const checkAdminAccess = async () => {
    if (userType === "guest") {
      toastError(
        "Acesso negado",
        "Convidados não podem acessar a área administrativa"
      );
      navigate("/home");
      return;
    }

    try {
      await apiRequest("/notifications/admin/check");
      setIsAdmin(true);
      loadNotifications();
      loadStats();
    } catch {
      toastError(
        "Acesso negado",
        "Você não tem permissão para acessar esta área"
      );
      navigate("/home");
    }
  };

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest("/notifications/admin/all");
      setNotifications(data);
    } catch {
      toastError("Erro", "Não foi possível carregar as notificações");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await apiRequest("/notifications/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toastWarning("Campos obrigatórios", "Título e mensagem são obrigatórios");
      return;
    }

    try {
      const endpoint = editingId
        ? `/notifications/admin/${editingId}`
        : "/notifications/admin";

      const method = editingId ? "PATCH" : "POST";

      await apiRequest(endpoint, {
        method,
        body: JSON.stringify({
          ...formData,
          actionUrl: formData.actionUrl || undefined,
          actionText: formData.actionText || undefined,
          expiresAt: formData.expiresAt || undefined,
        }),
      });

      toastSuccess(
        editingId ? "Notificação atualizada!" : "Notificação criada!",
        "A notificação foi salva com sucesso"
      );

      resetForm();
      loadNotifications();
      loadStats();
    } catch (error) {
      toastError(
        "Erro ao salvar",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  };

  const handleEdit = (notification: NotificationData) => {
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      actionUrl: notification.actionUrl || "",
      actionText: notification.actionText || "",
      expiresAt: notification.expiresAt
        ? notification.expiresAt.split("T")[0]
        : "",
    });
    setEditingId(notification.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta notificação?")) {
      return;
    }

    try {
      await apiRequest(`/notifications/admin/${id}`, { method: "DELETE" });
      toastSuccess("Excluído!", "Notificação removida com sucesso");
      loadNotifications();
      loadStats();
    } catch {
      toastError("Erro", "Não foi possível excluir a notificação");
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const endpoint = isActive
        ? `/notifications/admin/${id}/deactivate`
        : `/notifications/admin/${id}/activate`;

      await apiRequest(endpoint, { method: "PATCH" });

      toastSuccess(
        isActive ? "Desativada!" : "Ativada!",
        `Notificação ${isActive ? "desativada" : "ativada"} com sucesso`
      );
      loadNotifications();
      loadStats();
    } catch {
      toastError("Erro", "Não foi possível alterar o status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "announcement",
      priority: "medium",
      actionUrl: "",
      actionText: "",
      expiresAt: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getTypeIcon = (type: string) => {
    const props = { size: 16 };
    switch (type) {
      case "update":
        return <Zap {...props} className="text-blue-400" />;
      case "feature":
        return <Zap {...props} className="text-green-400" />;
      case "announcement":
        return <Info {...props} className="text-blue-400" />;
      case "warning":
        return <AlertTriangle {...props} className="text-yellow-400" />;
      case "maintenance":
        return <Settings {...props} className="text-orange-400" />;
      default:
        return <Info {...props} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-600 text-white";
      case "medium":
        return "bg-blue-600 text-white";
      case "low":
        return "bg-gray-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "update":
        return "🔄 Atualização";
      case "feature":
        return "🚀 Nova Funcionalidade";
      case "announcement":
        return "📢 Anúncio";
      case "warning":
        return "⚠️ Aviso";
      case "maintenance":
        return "🔧 Manutenção";
      default:
        return type;
    }
  };

  if (!isAdmin && !isLoading) {
    return null;
  }

  return (
    <MainLayout showFooter={false} showSidebar={false}>
      <div className="min-h-screen bg-gray-900 p-6 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Bell size={24} className="text-blue-400" />
              <h1 className="text-2xl font-bold text-white">
                Painel de Administração - Notificações
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Voltar ao Desktop
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <BarChart3 size={16} />
                <span>Estatísticas</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Nova Notificação</span>
              </button>
            </div>
          </div>

          {/* Estatísticas */}
          {showStats && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center space-x-3">
                  <Bell className="text-blue-400" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center space-x-3">
                  <Eye className="text-green-400" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Ativas</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.active}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center space-x-3">
                  <EyeOff className="text-gray-400" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Inativas</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.inactive}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-purple-400" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Esta Semana</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.recent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estatísticas por Tipo */}
              <div className="md:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-medium mb-4">Por Tipo</h3>
                <div className="space-y-2">
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">
                        {getTypeLabel(type)}
                      </span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estatísticas por Prioridade */}
              <div className="md:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-medium mb-4">Por Prioridade</h3>
                <div className="space-y-2">
                  {Object.entries(stats.byPriority).map(([priority, count]) => (
                    <div
                      key={priority}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300 capitalize">
                        {priority}
                      </span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Formulário */}
          {showForm && (
            <div className="bg-gray-800 rounded-lg border border-gray-600 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  {editingId ? "Editar Notificação" : "Nova Notificação"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Título */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Título da notificação"
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tipo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as NotificationFormData["type"],
                        })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="announcement">📢 Anúncio</option>
                      <option value="update">🔄 Atualização</option>
                      <option value="feature">🚀 Nova Funcionalidade</option>
                      <option value="warning">⚠️ Aviso</option>
                      <option value="maintenance">🔧 Manutenção</option>
                    </select>
                  </div>

                  {/* Prioridade */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Prioridade
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target
                            .value as NotificationFormData["priority"],
                        })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>

                  {/* Mensagem */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={3}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Conteúdo da notificação"
                      required
                    />
                  </div>

                  {/* URL de Ação */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      URL de Ação (opcional)
                    </label>
                    <input
                      type="url"
                      value={formData.actionUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, actionUrl: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://exemplo.com"
                    />
                  </div>

                  {/* Texto da Ação */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Texto da Ação (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.actionText}
                      onChange={(e) =>
                        setFormData({ ...formData, actionText: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ver Mais"
                    />
                  </div>

                  {/* Data de Expiração */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Data de Expiração (opcional)
                    </label>
                    <input
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) =>
                        setFormData({ ...formData, expiresAt: e.target.value })
                      }
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-600">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save size={16} />
                    <span>{editingId ? "Atualizar" : "Criar"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Notificações */}
          <div className="bg-gray-800 rounded-lg border border-gray-600">
            <div className="p-6 border-b border-gray-600">
              <h2 className="text-lg font-semibold text-white">
                Notificações Cadastradas ({notifications.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-400">Carregando...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <Bell size={48} className="mb-4 opacity-50" />
                <p className="text-lg mb-2">Nenhuma notificação cadastrada</p>
                <p className="text-sm">
                  Clique em "Nova Notificação" para começar
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 transition-colors ${
                      !notification.isActive ? "bg-gray-800/50 opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getTypeIcon(notification.type)}
                          <h3
                            className={`font-medium ${
                              notification.isActive
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              notification.priority
                            )}`}
                          >
                            {notification.priority.toUpperCase()}
                          </span>
                          {!notification.isActive && (
                            <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded-full text-xs">
                              INATIVA
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-sm mb-3 ${
                            notification.isActive
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {notification.message}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>
                            Criada:{" "}
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString("pt-BR")}
                          </span>
                          {notification.expiresAt && (
                            <span>
                              Expira:{" "}
                              {new Date(
                                notification.expiresAt
                              ).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                          {notification.actionUrl && (
                            <div className="flex items-center space-x-1">
                              <ExternalLink size={12} />
                              <span>Com ação</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() =>
                            toggleActive(notification.id, notification.isActive)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            notification.isActive
                              ? "text-green-400 hover:bg-green-400/10"
                              : "text-gray-400 hover:bg-gray-600"
                          }`}
                          title={notification.isActive ? "Desativar" : "Ativar"}
                        >
                          {notification.isActive ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>

                        <button
                          onClick={() => handleEdit(notification)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer com informações */}
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <AlertCircle size={16} />
              <span>
                As notificações são exibidas para todos os usuários registrados
                automaticamente. Notificações inativas não aparecem para os
                usuários.
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminNotificationsPanel;
