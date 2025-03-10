import { useEffect } from "react";

const COLORS = ["#fff2", "#fff4", "#fff7", "#fffc"];

// Función para generar capas de estrellas con tipado
const generateSpaceLayer = (
  size: string,
  selector: string,
  totalStars: number,
  duration: string
): void => {
  const layer: string[] = [];
  for (let i = 0; i < totalStars; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    layer.push(`${x}vw ${y}vh 0 ${color}, ${x}vw ${y + 100}vh 0 ${color}`);
  }

  const container = document.querySelector<HTMLElement>(selector);
  if (container) {
    container.style.setProperty("--size", size);
    container.style.setProperty("--duration", duration);
    container.style.setProperty("--space-layer", layer.join(","));
  }
};

const ParticlesBackgroud: React.FC = () => {
  useEffect(() => {
    generateSpaceLayer("2px", ".space-1", 250, "25s");
    generateSpaceLayer("3px", ".space-2", 100, "20s");
    generateSpaceLayer("6px", ".space-3", 25, "15s");
  }, []);

  return (
    <div className="top-0 left-0 w-full h-full z-0">
      <div className="space space-1"></div>
      <div className="space space-2"></div>
      <div className="space space-3"></div>
      <style jsx>{`
        .space {
          position: absolute;
          top: 0;
          left: 0;
          width: var(--size);
          height: var(--size);
          background: white;
          box-shadow: var(--space-layer);
          opacity: 0.75;
          animation: move var(--duration) linear infinite;
        }

        @keyframes move {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default ParticlesBackgroud;
