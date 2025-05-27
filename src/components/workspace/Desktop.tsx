import React from "react";
import { useWindowManager } from "../../hooks/useWindowManager";
import Window from "../ui/Window";
import { renderTool } from "../../utils/toolRegistry";
import MainLayout from "../layout/MainLayout";

const Desktop: React.FC = () => {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    focusWindow,
  } = useWindowManager();

  return (
    <MainLayout>
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
    </MainLayout>
  );
};

export default Desktop;
