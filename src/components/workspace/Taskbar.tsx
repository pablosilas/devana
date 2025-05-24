import React from "react";
import type { WindowState } from "../../types/types";
import { TOOL_REGISTRY, type ToolType } from "../../utils/toolRegistry";

interface TaskbarProps {
  onCreateWindow: (component: string, title: string) => void;
  minimizedWindows: WindowState[];
  onRestoreWindow: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({
  onCreateWindow,
  minimizedWindows,
  onRestoreWindow,
}) => {
  const toolEntries = Object.entries(TOOL_REGISTRY) as [
    ToolType,
    (typeof TOOL_REGISTRY)[ToolType]
  ][];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-600 p-2 flex justify-between items-center">
      <div className="flex space-x-2">
        {toolEntries.map(([toolType, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={toolType}
              onClick={() => onCreateWindow(toolType, config.defaultTitle)}
              className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors text-white ${
                config.buttonClassName || "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Icon size={16} />
              <span>{config.defaultTitle}</span>
            </button>
          );
        })}
      </div>

      <div className="flex space-x-2">
        {minimizedWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => onRestoreWindow(window.id)}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm transition-colors"
          >
            {window.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Taskbar;
