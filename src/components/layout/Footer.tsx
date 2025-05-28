import React, { useEffect, useState } from "react";
import type { WindowState } from "../../types/types";

interface WindowManager {
  minimizedWindows: WindowState[];
  createWindow: (component: string, title: string) => void;
  restoreWindow: (id: string) => void;
}

interface FooterProps {
  sidebarWidth: number;
  minimizedWindows: WindowState[];
  windowManager?: WindowManager;
}

const Footer: React.FC<FooterProps> = ({
  sidebarWidth,
  minimizedWindows,
  windowManager,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  // Atualizar relógio a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="bg-gray-800 border-t border-gray-600 px-4 py-2 flex items-center space-x-2 flex-shrink-0 transition-all duration-300"
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
      <div className="flex space-x-2 flex-1">
        {minimizedWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => windowManager?.restoreWindow(window.id)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-white text-sm max-w-48 truncate"
            title={window.title}
          >
            {window.title}
          </button>
        ))}

        {minimizedWindows.length === 0 && (
          <div className="text-gray-500 text-sm italic">
            Nenhuma janela minimizada
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4 text-gray-300">
        {/* Date */}
        <div className="text-xs text-gray-300 font-medium border-r border-gray-600 pr-4">
          {currentTime.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        {/* Clock */}
        <div className="text-sm font-medium">
          {currentTime.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
export default Footer;
