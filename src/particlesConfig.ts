// particlesConfig.ts
import type { Engine } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import type { ISourceOptions } from "@tsparticles/engine";

export const particlesInit = async (engine: Engine): Promise<void> => {
  await loadFull(engine);
};

export const particlesConfig: ISourceOptions = {
  fullScreen: {
    enable: true,
    zIndex: -1,
  },
  background: {
    color: {
      value: "#1c2534",
    },
  },
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        width: 800,
      },
    },
    color: {
      value: "#ffffff",
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.5,
    },
    size: {
      value: { min: 1, max: 5 },
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      outModes: {
        default: "bounce",
      },
    },
    links: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },
  },
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: {
        enable: true,
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  detectRetina: true,
};
