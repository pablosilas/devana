// components/workspace/Desktop.tsx
import React from "react";
import { Timer, Play, User } from "lucide-react";
import Window from "../ui/Window";
import Header from "./Header";
import { useWindowManager } from "../../hooks/useWindowManager";
import { renderTool, TOOL_REGISTRY } from "../../utils/toolRegistry";
import type { ToolType } from "../../utils/toolRegistry";

const Desktop: React.FC = () => {
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

  const openTool = (toolType: ToolType) => {
    const toolConfig = TOOL_REGISTRY[toolType];
    createWindow(toolType, toolConfig.defaultTitle);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header com informações do usuário */}
      <Header
        sidebarWidth={0}
        onEditProfile={() => console.log("Editar perfil")}
        onNotifications={() => console.log("Notificações")}
      />

      {/* Desktop Area */}
      <div className="flex-1 relative">
        {/* Desktop Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>

        {/* Desktop Icons */}
        <div className="absolute top-6 left-6 flex flex-col space-y-4">
          <button
            onClick={() => openTool("timer")}
            className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Timer size={24} className="text-white" />
            </div>
            <span className="text-white text-sm">Timer</span>
          </button>

          <button
            onClick={() => openTool("music")}
            className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors">
              <Play size={24} className="text-white" />
            </div>
            <span className="text-white text-sm">Música</span>
          </button>

          <button
            onClick={() => openTool("fakedata")}
            className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
              <User size={24} className="text-white" />
            </div>
            <span className="text-white text-sm">Dados Fake</span>
          </button>
        </div>

        {/* Windows */}
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

      {/* Taskbar */}
      <div className="bg-gray-800 border-t border-gray-600 px-4 py-2 flex items-center space-x-2">
        {/* Start Button */}
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium">
          Menu
        </button>

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
        <div className="text-white text-sm">
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
