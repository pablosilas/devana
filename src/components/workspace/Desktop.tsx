import React from "react";
import Window from "../ui/Window";
import MainLayout from "../layout/MainLayout";
import { renderTool } from "../../utils/toolRegistry";
import { useWindowManager } from "../../hooks/useWindowManager";

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
    <MainLayout
      showSidebar={true}
      showHeader={true}
      showFooter={true}
      // Passando as funções do window manager para o MainLayout
      windowManager={{
        minimizedWindows,
        createWindow,
        restoreWindow,
      }}
    >
      {/* Área onde as janelas serão renderizadas */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Renderizar todas as janelas */}
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

        {/* Mensagem quando não há janelas abertas */}
        {windows.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <h2 className="text-2xl font-semibold mb-2">
                Bem-vindo ao Devana
              </h2>
              <p className="text-lg">
                Clique em uma ferramenta na barra lateral para começar
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Desktop;
