import React from "react";
import { ChevronLeft, Menu } from "lucide-react";
import type { WindowState } from "../../types/types";
import { TOOL_REGISTRY, type ToolType } from "../../utils/toolRegistry";

interface SidebarProps {
  onCreateWindow: (component: string, title: string) => void;
  minimizedWindows: WindowState[];
  onRestoreWindow: (id: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onCreateWindow,
  isExpanded,
  setIsExpanded,
}) => {
  const toolEntries = Object.entries(TOOL_REGISTRY) as [
    ToolType,
    (typeof TOOL_REGISTRY)[ToolType]
  ][];

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Overlay para fechar o menu em telas menores */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-800 border-r border-gray-600 z-50 transition-all duration-500 ease-out ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* Header com botão de toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          {isExpanded && (
            <h2 className="text-white font-semibold text-lg">Ferramentas</h2>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors ${
              !isExpanded ? "mx-auto" : ""
            }`}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Lista de ferramentas */}
        <div className="py-4">
          <div className="space-y-2 px-2">
            {toolEntries.map(([toolType, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={toolType}
                  onClick={() => onCreateWindow(toolType, config.defaultTitle)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors text-white hover:bg-gray-700 ${
                    !isExpanded ? "justify-center" : "space-x-3"
                  } ${
                    config.buttonClassName?.includes("bg-")
                      ? config.buttonClassName.replace(
                          /bg-\w+-\d+/,
                          "hover:bg-gray-700"
                        )
                      : ""
                  }`}
                  title={!isExpanded ? config.defaultTitle : undefined}
                >
                  <div className="flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  {isExpanded && (
                    <div className="transition-all duration-500 ease-out overflow-hidden w-auto opacity-100">
                      <span className="text-left font-medium whitespace-nowrap">
                        {config.defaultTitle}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer removido - será controlado pelo Desktop */}
    </>
  );
};

export default Sidebar;
