import { useState } from "react";
import type { WindowState } from "../types/types";
import Window from "./Window";
import { Play, Timer, User } from "lucide-react";

const DevEnvironment: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1);

  const createWindow = (component: string, title: string) => {
    const newWindow: WindowState = {
      id: Date.now().toString(),
      title,
      component,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      size: { width: 400, height: 300 },
      zIndex: nextZIndex,
    };
    setWindows([...windows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter((w) => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(
      windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows(
      windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      )
    );
  };

  const moveWindow = (id: string, position: { x: number; y: number }) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, position } : w)));
  };

  const resizeWindow = (
    id: string,
    size: { width: number; height: number }
  ) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, size } : w)));
  };

  const focusWindow = (id: string) => {
    setWindows(
      windows.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex(nextZIndex + 1);
  };

  const restoreWindow = (id: string) => {
    setWindows(
      windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
      )
    );
    setNextZIndex(nextZIndex + 1);
  };

  const minimizedWindows = windows.filter((w) => w.isMinimized);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Desktop */}
      <div className="h-full relative">
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
          />
        ))}
      </div>

      {/* Barra de tarefas */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-600 p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => createWindow("timer", "Timer")}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-white"
          >
            <Timer size={16} />
            <span>Timer</span>
          </button>
          <button
            onClick={() => createWindow("music", "Player de Música")}
            className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-white"
          >
            <Play size={16} />
            <span>Música</span>
          </button>
          <button
            onClick={() => createWindow("fakedata", "Gerador de Dados")}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-white"
          >
            <User size={16} />
            <span>Dados Fake</span>
          </button>
        </div>

        <div className="flex space-x-2">
          {minimizedWindows.map((window) => (
            <button
              key={window.id}
              onClick={() => restoreWindow(window.id)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm transition-colors"
            >
              {window.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevEnvironment;
