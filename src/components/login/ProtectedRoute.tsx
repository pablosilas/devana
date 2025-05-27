// components/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="text-white text-lg">Verificando autenticação...</div>
        </div>
      </div>
    );
  }

  // Só redirecionar para login se não estiver loading E não estiver autenticado
  if (!isLoading && !isAuthenticated) {
    console.log("🚫 Usuário não autenticado, redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  // Renderizar conteúdo protegido se autenticado
  if (!isLoading && isAuthenticated) {
    return <>{children}</>;
  }

  // Fallback (não deveria chegar aqui)
  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-lg">Carregando...</div>
    </div>
  );
};

export default ProtectedRoute;
