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
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

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
          <Route path="/home" element={<Desktop />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
};

// Componente App principal com Router e AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
