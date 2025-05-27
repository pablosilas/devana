// utils/toolRegistry.tsx
import React from "react";
import { Timer, Play, User } from "lucide-react";
import TimerComponent from "../components/tools/Timer";
import MusicPlayer from "../components/tools/MusicPlayer";
import FakeDataGenerator from "../components/tools/FakeDataGenerator";

export type ToolType = "timer" | "music" | "fakedata";

export interface ToolConfig {
  component: React.ComponentType;
  defaultTitle: string;
  defaultSize: { width: number; height: number };
  icon: React.ComponentType<{ size?: number }>;
  buttonClassName?: string;
}

export const TOOL_REGISTRY: Record<ToolType, ToolConfig> = {
  timer: {
    component: TimerComponent,
    defaultTitle: "Timer",
    defaultSize: { width: 400, height: 350 },
    icon: Timer,
    buttonClassName: "bg-blue-600 hover:bg-blue-700",
  },
  music: {
    component: MusicPlayer,
    defaultTitle: "Player de Música",
    defaultSize: { width: 450, height: 400 },
    icon: Play,
    buttonClassName: "bg-blue-600 hover:bg-blue-700",
  },
  fakedata: {
    component: FakeDataGenerator,
    defaultTitle: "Gerador de Dados",
    defaultSize: { width: 500, height: 450 },
    icon: User,
    buttonClassName: "bg-blue-600 hover:bg-blue-700",
  },
};

export const renderTool = (toolType: string): React.ReactElement => {
  const toolConfig = TOOL_REGISTRY[toolType as ToolType];
  if (!toolConfig) {
    return <div className="p-4">Componente não encontrado</div>;
  }

  const Component = toolConfig.component;
  return <Component />;
};
