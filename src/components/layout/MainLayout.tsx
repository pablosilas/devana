// src/components/layout/MainLayout.tsx
import React, { useState, type ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import type { WindowState } from "../../types/types";
import Footer from "./Footer";

interface WindowManager {
  minimizedWindows: WindowState[];
  createWindow: (component: string, title: string) => void;
  restoreWindow: (id: string) => void;
}

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  windowManager?: WindowManager;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
  windowManager,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarWidth = isExpanded ? 256 : 64;
  const minimizedWindows = windowManager?.minimizedWindows || [];

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Container principal com flexbox */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && windowManager && (
          <Sidebar
            onCreateWindow={windowManager.createWindow}
            minimizedWindows={minimizedWindows}
            onRestoreWindow={windowManager.restoreWindow}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        )}

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header com sistema de notificações integrado */}
          {showHeader && (
            <Header sidebarWidth={showSidebar ? sidebarWidth : 0} />
          )}

          {/* Área de conteúdo */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>

      {/* Footer/Taskbar */}
      {showFooter && windowManager && (
        <Footer
          sidebarWidth={showSidebar ? sidebarWidth : 0}
          minimizedWindows={minimizedWindows}
          windowManager={windowManager}
        />
      )}
    </div>
  );
};

export default MainLayout;
