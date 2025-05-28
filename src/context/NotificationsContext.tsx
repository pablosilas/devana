// src/context/NotificationsContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export type NotificationType =
  | "update"
  | "announcement"
  | "warning"
  | "maintenance"
  | "feature";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface NotificationData {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  isRead: boolean;
  isDismissed: boolean;
}

interface NotificationsContextType {
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationIds: number[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissNotification: (notificationId: number) => Promise<void>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, userType, token } = useAuth();

  const API_BASE_URL = "http://localhost:3003";

  // Fazer request para API
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

  // Buscar notificações
  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated || userType === "guest") {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const [notificationsData, unreadData] = await Promise.all([
        apiRequest("/notifications"),
        apiRequest("/notifications/unread-count"),
      ]);

      setNotifications(notificationsData);
      setUnreadCount(unreadData.count);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, userType, token]);

  // Marcar notificações como lidas
  const markAsRead = useCallback(
    async (notificationIds: number[]) => {
      if (!isAuthenticated || userType === "guest") return;

      try {
        await apiRequest("/notifications/mark-read", {
          method: "POST",
          body: JSON.stringify({ notificationIds }),
        });

        // Atualizar estado local
        setNotifications((prev) =>
          prev.map((notification) =>
            notificationIds.includes(notification.id)
              ? { ...notification, isRead: true }
              : notification
          )
        );

        // Atualizar contador
        setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));
      } catch (error) {
        console.error("Erro ao marcar notificações como lidas:", error);
      }
    },
    [isAuthenticated, userType, token]
  );

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);

    if (unreadIds.length > 0) {
      await markAsRead(unreadIds);
    }
  }, [notifications, markAsRead]);

  // Dispensar notificação
  const dismissNotification = useCallback(
    async (notificationId: number) => {
      if (!isAuthenticated || userType === "guest") return;

      try {
        await apiRequest(`/notifications/${notificationId}/dismiss`, {
          method: "POST",
        });

        // Remover da lista local
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

        // Atualizar contador se não estava lida
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification && !notification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error("Erro ao dispensar notificação:", error);
      }
    },
    [isAuthenticated, userType, token, notifications]
  );

  // Carregar notificações quando usuário logar
  useEffect(() => {
    if (isAuthenticated && userType === "user") {
      refreshNotifications();

      // Atualizar a cada 5 minutos
      const interval = setInterval(refreshNotifications, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userType, refreshNotifications]);

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    isLoading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
