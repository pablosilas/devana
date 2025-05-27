// components/ui/Toast.tsx
import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-600 border-green-500 text-white";
      case "error":
        return "bg-red-600 border-red-500 text-white";
      case "warning":
        return "bg-yellow-600 border-yellow-500 text-white";
      case "info":
        return "bg-blue-600 border-blue-500 text-white";
      default:
        return "bg-gray-600 border-gray-500 text-white";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "info":
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div
      className={`
        ${getToastStyles()}
        border rounded-lg p-4 shadow-lg
        transform transition-all duration-300 ease-in-out
        animate-slide-in-right
        min-w-80 max-w-md
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getIcon()}</div>

        <div className="flex-1">
          <h4 className="font-medium text-sm">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm opacity-90 mt-1">{toast.message}</p>
          )}
        </div>

        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
