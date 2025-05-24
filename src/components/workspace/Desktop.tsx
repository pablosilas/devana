import React from "react";
import { useWindowManager } from "../../hooks/useWindowManager";
import Window from "../ui/Window";
import Taskbar from "./Taskbar";
import { renderTool } from "../../utils/toolRegistry";

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

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Desktop Area */}
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
          >
            {renderTool(window.component)}
          </Window>
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar
        onCreateWindow={createWindow}
        minimizedWindows={minimizedWindows}
        onRestoreWindow={restoreWindow}
      />
    </div>
  );
};

export default Desktop;
