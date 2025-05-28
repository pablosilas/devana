// src/components/notifications/NotificationsPanel.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  CheckCheck,
  ExternalLink,
  Info,
  Zap,
  Settings,
  AlertTriangle,
} from "lucide-react";
import {
  useNotifications,
  type NotificationData,
  type NotificationType,
} from "../../context/NotificationsContext";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  anchorRef,
}) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications();

  const panelRef = useRef<HTMLDivElement>(null);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });

  // Calcular posição do painel
  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      setPanelPosition({
        top: anchorRect.bottom + 8,
        right: window.innerWidth - anchorRect.right,
      });
    }
  }, [isOpen, anchorRef]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, anchorRef]);

  const getNotificationIcon = (type: NotificationType) => {
    const iconProps = { size: 16 };

    switch (type) {
      case "update":
        return <Zap {...iconProps} className="text-blue-400" />;
      case "feature":
        return <Zap {...iconProps} className="text-green-400" />;
      case "announcement":
        return <Info {...iconProps} className="text-blue-400" />;
      case "warning":
        return <AlertTriangle {...iconProps} className="text-yellow-400" />;
      case "maintenance":
        return <Settings {...iconProps} className="text-orange-400" />;
      default:
        return <Info {...iconProps} className="text-gray-400" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "update":
      case "feature":
        return "border-l-blue-500";
      case "announcement":
        return "border-l-blue-400";
      case "warning":
        return "border-l-yellow-500";
      case "maintenance":
        return "border-l-orange-500";
      default:
        return "border-l-gray-500";
    }
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    if (!notification.isRead) {
      await markAsRead([notification.id]);
    }

    if (notification.actionUrl) {
      window.open(notification.actionUrl, "_blank");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Agora há pouco";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else if (diffInHours < 48) {
      return "Ontem";
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 w-96 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl"
        style={{
          top: panelPosition.top,
          right: panelPosition.right,
          maxHeight: "70vh",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <Bell size={18} className="text-blue-400" />
            <h3 className="text-white font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                title="Marcar todas como lidas"
              >
                <CheckCheck size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-400">Carregando...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-400">
              <Bell size={32} className="mb-2 opacity-50" />
              <p className="text-sm">Nenhuma notificação</p>
              <p className="text-xs mt-1">Você está em dia! 🎉</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 hover:bg-gray-700 transition-colors cursor-pointer border-l-4 ${getNotificationColor(
                    notification.type
                  )} ${!notification.isRead ? "bg-gray-750" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4
                          className={`text-sm font-medium ${
                            notification.isRead ? "text-gray-300" : "text-white"
                          }`}
                        >
                          {notification.title}
                        </h4>

                        <div className="flex items-center space-x-2 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification.id);
                            }}
                            className="text-gray-500 hover:text-gray-300 transition-colors"
                            title="Dispensar"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>

                        {notification.actionUrl && notification.actionText && (
                          <div className="flex items-center space-x-1 text-blue-400 text-xs">
                            <span>{notification.actionText}</span>
                            <ExternalLink size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-600 bg-gray-750">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {notifications.length} notificação
                {notifications.length !== 1 ? "ões" : ""}
              </span>
              <span>
                {unreadCount > 0
                  ? `${unreadCount} não lida${unreadCount !== 1 ? "s" : ""}`
                  : "Todas lidas"}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationsPanel;
