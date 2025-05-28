import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "./components/ui/IntroScreen";
import LoginPageWithNavigation from "./components/login/LoginPageWithNavigation";
import Desktop from "./components/workspace/Desktop";
import ProtectedRoute from "./components/login/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import EditProfile from "./components/profile/EditProfile";
import { ToastProvider } from "./context/ToastContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import AdminNotificationsPanel from "./components/admin/AdminNotificationsPanel";

// Componente principal da aplicação
const AppContent: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const handleIntroComplete = () => {
    setShowIntro(false);
    navigate("/login");
  };

  return (
    <div className="app-root">
      <AnimatePresence>
        {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {!showIntro && (
        <Routes>
          <Route path="/login" element={<LoginPageWithNavigation />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Desktop />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          {/* Rota de Admin - Painel de Notificações */}
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute>
                <AdminNotificationsPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

// Componente App principal com Router e AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationsProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationsProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
