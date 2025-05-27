import React, { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { particlesConfig } from "../../particlesConfig";

const ParticlesBackground: React.FC = React.memo(() => {
  const [init, setInit] = useState(false);

  // Memoiza a configuração das partículas para evitar recriação
  const memoizedParticlesConfig = useMemo(() => particlesConfig, []);

  useEffect(() => {
    // Inicializar partículas apenas uma vez
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      options={memoizedParticlesConfig}
      className="particles-bg"
    />
  );
});

ParticlesBackground.displayName = "ParticlesBackground";

export default ParticlesBackground;
