import { useState } from "react";
import type { WindowState } from "../types/types";

export const useWindowManager = () => {
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
    setWindows((prev) => [...prev, newWindow]);
    setNextZIndex((prev) => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const moveWindow = (id: string, position: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  };

  const resizeWindow = (
    id: string,
    size: { width: number; height: number }
  ) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
  };

  const focusWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex((prev) => prev + 1);
  };

  const restoreWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
      )
    );
    setNextZIndex((prev) => prev + 1);
  };

  return {
    windows,
    minimizedWindows: windows.filter((w) => w.isMinimized),
    createWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    focusWindow,
    restoreWindow,
  };
};
