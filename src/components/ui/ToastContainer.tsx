// components/ui/ToastContainer.tsx
import React from "react";
import Toast, { type ToastData } from "./Toast";

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onRemoveToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
