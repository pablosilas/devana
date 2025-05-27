import React, { useState } from "react";
import { useWindowManager } from "../../hooks/useWindowManager";
import Window from "../ui/Window";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { renderTool } from "../../utils/toolRegistry";

const Desktop: React.FC = () => {
  // Estado para controlar se o sidebar está expandido
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    windows,
    minimizedWindows,
    createWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    focusWindow,
    restoreWindow,
  } = useWindowManager();

  // Calcula a largura atual do sidebar
  const sidebarWidth = isExpanded ? 256 : 64;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black to-gray-700 overflow-hidden">
      {/* Container principal com flexbox */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          onCreateWindow={createWindow}
          minimizedWindows={minimizedWindows}
          onRestoreWindow={restoreWindow}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header
            onEditProfile={() => console.log("Editar perfil")}
            onNotifications={() => console.log("Notificações")}
            sidebarWidth={0} // Não precisa ajustar pois agora está em flexbox
          />

          {/* Desktop Area - onde as janelas ficam */}
          <div className="flex-1 relative overflow-hidden">
            {windows.map((window) => (
              <Window
                key={window.id}
                window={window}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onMaximize={maximizeWindow}
                onMove={moveWindow}
                onResize={resizeWindow}
                onFocus={focusWindow}
              >
                {renderTool(window.component)}
              </Window>
            ))}
          </div>
        </div>
      </div>

      {/* Taskbar fixo na parte inferior */}
      <div
        className="bg-gray-800 border-t border-gray-600 px-4 py-2 flex items-center space-x-2 flex-shrink-0"
        style={{ marginLeft: `${sidebarWidth}px` }}
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
    </div>
  );
};

export default Desktop;
