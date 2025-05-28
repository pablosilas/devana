import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Devana";

  useEffect(() => {
    // Efeito de digitação
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedText(() => fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(typingInterval);
    }, 250);

    return () => {
      clearInterval(typingInterval);
    };
  }, [fullText]);

  useEffect(() => {
    // Timer para completar a intro
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="intro-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <ParticlesBackground />
      <motion.h1
        className="intro-text"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {typedText}
      </motion.h1>
      <motion.p
        className="intro-slogan"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.5 }}
      >
        Sua jornada digital começa aqui.
      </motion.p>
    </motion.div>
  );
};

export default IntroScreen;
