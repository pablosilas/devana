import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onEditProfile?: () => void;
  onNotifications?: () => void;
  sidebarWidth?: number; // Para ajustar com a sidebar
}

const Header: React.FC<HeaderProps> = ({
  onEditProfile,
  onNotifications,
  sidebarWidth = 64,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Dados do AuthContext
  const { userType, logout, getUserDisplayName, getUserEmail } = useAuth();

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    // Você pode adicionar redirecionamento aqui se necessário
    // navigate('/login');
  };

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      console.log("Editar perfil não implementado");
    }
  };

  const displayName = getUserDisplayName();
  const email = getUserEmail();
  const isGuest = userType === "guest";

  return (
    <header
      className="fixed top-0 right-0 bg-gray-800 border-b border-gray-600 shadow-sm z-40"
      style={{ left: `${sidebarWidth}px`, height: "69px" }}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo e Nome do Site */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
              Devana
            </h1>
          </div>
        </div>

        {/* Área do Usuário */}
        <div className="flex items-center space-x-4">
          {/* Botão de Notificações - apenas para usuários registrados */}
          {!isGuest && onNotifications && (
            <button
              onClick={onNotifications}
              className="p-2 text-white hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors relative"
            >
              <Bell size={20} />
              {/* Badge de notificação */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          )}

          {/* Menu do Usuário */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-3 p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {isGuest ? (
                  <UserCheck size={16} className="text-white" />
                ) : (
                  <User size={16} className="text-white" />
                )}
              </div>

              {/* Nome do usuário */}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-white">{displayName}</p>
                {email ? (
                  <p className="text-xs text-gray-400">{email}</p>
                ) : (
                  <p className="text-xs text-yellow-400">Convidado</p>
                )}
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2 z-50">
                {/* Info do usuário no mobile */}
                <div className="px-4 py-3 border-b border-gray-600 sm:hidden">
                  <p className="text-sm font-medium text-white">
                    {displayName}
                  </p>
                  {email ? (
                    <p className="text-xs text-gray-400">{email}</p>
                  ) : (
                    <p className="text-xs text-yellow-400">
                      Acesso como convidado
                    </p>
                  )}
                </div>

                {/* Status do usuário */}
                <div className="px-4 py-2 border-b border-gray-600">
                  {isGuest ? (
                    <div className="flex items-center space-x-2">
                      <UserCheck size={14} className="text-yellow-400" />
                      <span className="text-xs text-yellow-400">
                        Sessão de Convidado
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User size={14} className="text-blue-400" />
                      <span className="text-xs text-blue-400">
                        Usuário Registrado
                      </span>
                    </div>
                  )}
                </div>

                {/* Opções do menu */}
                {!isGuest && (
                  <button
                    onClick={() => handleMenuAction(handleEditProfile)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Editar Perfil</span>
                  </button>
                )}

                <button
                  onClick={() => handleMenuAction(handleLogout)}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
