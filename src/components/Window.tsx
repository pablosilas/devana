import { useEffect, useRef, useState } from "react";
import { X, Minus, Square } from "lucide-react";
import type { WindowState } from "../types/types";
import TimerComponent from "./Timer";
import MusicPlayer from "./MusicPlayer";
import FakeDataGenerator from "./FakeDataGenerator";

const Window: React.FC<{
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  onFocus: (id: string) => void;
}> = ({ window, onClose, onMinimize, onMaximize, onMove, onFocus }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Modificado: agora permite drag do header inteiro
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    // Não iniciar drag se clicou em um botão
    if (
      (e.target as HTMLElement).tagName === "BUTTON" ||
      (e.target as HTMLElement).closest("button")
    ) {
      return;
    }

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    });
    onFocus(window.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        onMove(window.id, {
          x: e.clientX - dragOffset.x,
          y: Math.max(0, e.clientY - dragOffset.y), // Impede que suba além do topo
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, onMove, window.isMaximized]);

  const renderComponent = () => {
    switch (window.component) {
      case "timer":
        return <TimerComponent />;
      case "music":
        return <MusicPlayer />;
      case "fakedata":
        return <FakeDataGenerator />;
      default:
        return <div className="p-4">Componente não encontrado</div>;
    }
  };

  if (window.isMinimized) {
    return null;
  }

  // Corrigido: estilo de maximização
  const windowStyle = window.isMaximized
    ? {
        width: "100vw",
        height: "calc(100vh - 60px)", // Deixa espaço para a taskbar
        left: 0,
        top: 0,
        transform: "none",
        zIndex: window.zIndex,
      }
    : {
        width: window.size.width,
        height: window.size.height,
        left: window.position.x,
        top: window.position.y,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden flex flex-col"
      style={windowStyle}
      onClick={() => onFocus(window.id)}
    >
      {/* Header - modificado para permitir drag em toda a área */}
      <div
        className="bg-gray-700 px-4 py-2 flex justify-between items-center cursor-move select-none flex-shrink-0"
        onMouseDown={handleHeaderMouseDown}
      >
        <span className="text-white font-medium">{window.title}</span>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Impede que o clique propague
              onMinimize(window.id);
            }}
            className="w-6 h-6 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center transition-colors"
            title="Minimizar"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Impede que o clique propague
              onMaximize(window.id);
            }}
            className="w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
            title="Maximizar"
          >
            <Square size={10} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Impede que o clique propague
              onClose(window.id);
            }}
            className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
            title="Fechar"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Conteúdo - modificado para usar flex-1 */}
      <div className="flex-1 overflow-auto">{renderComponent()}</div>
    </div>
  );
};

export default Window;
