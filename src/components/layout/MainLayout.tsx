// components/layout/MainLayout.tsx
import React, { useState, type ReactNode } from "react";
import Header from "../workspace/Header";
import Sidebar from "../workspace/Sidebar";
import { useWindowManager } from "../../hooks/useWindowManager";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { minimizedWindows, createWindow, restoreWindow } = useWindowManager();

  const sidebarWidth = isExpanded ? 256 : 64;

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Container principal com flexbox */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            onCreateWindow={createWindow}
            minimizedWindows={minimizedWindows}
            onRestoreWindow={restoreWindow}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        )}

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {showHeader && (
            <Header
              onNotifications={() => console.log("Notificações")}
              sidebarWidth={showSidebar ? sidebarWidth : 0}
            />
          )}

          {/* Área de conteúdo */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
      {showFooter && (
        <div
          className="bg-gray-800 border-t border-gray-600 px-4 py-2 flex items-center space-x-2 flex-shrink-0"
          style={showSidebar ? { marginLeft: `${sidebarWidth}px` } : {}}
        >
          {/* Minimized Windows */}
          <div className="flex space-x-2">
            {minimizedWindows.map((window) => (
              <button
                key={window.id}
                onClick={() => restoreWindow(window.id)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white text-sm"
              >
                {window.title}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Clock */}
          <div className="text-white text-sm font-medium">
            {new Date().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
