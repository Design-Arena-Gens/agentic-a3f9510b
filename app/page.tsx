"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Scene = {
  id: string;
  title: string;
  subtitle: string;
  duration: number;
};

const scenes: Scene[] = [
  {
    id: "market",
    title: "Chợ chiều vắng khách",
    subtitle: "Bà Hoa ngồi bên xe cà phê của mình, mong có người ghé",
    duration: 3500
  },
  {
    id: "conversation",
    title: "Nụ cười thân quen",
    subtitle: "Bà bắt chuyện với bạn, mời ly cà phê đậm tình",
    duration: 3200
  },
  {
    id: "invitation",
    title: "Lời mời bất ngờ",
    subtitle: "\"Chiều nay rảnh chứ? Vô Khiêu vũ Hoa Hoa với bà cho vui!\"",
    duration: 3200
  },
  {
    id: "club-exterior",
    title: "Ánh đèn Hoa Hoa",
    subtitle: "Tấm bảng neon sáng lên, ngân nga điệu bolero",
    duration: 3200
  },
  {
    id: "club-interior",
    title: "Nhịp điệu thăng hoa",
    subtitle: "Sàn nhảy mở rộng vòng tay đón chào mọi người",
    duration: 3600
  }
];

const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0);

export default function Page() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const sceneTimeout = setTimeout(() => {
      setSceneIndex((index) => (index === scenes.length - 1 ? index : index + 1));
    }, scenes[sceneIndex].duration);

    return () => clearTimeout(sceneTimeout);
  }, [sceneIndex, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    let animationFrame: number;
    const start = performance.now();
    const baseElapsed = sceneProgressLookup(sceneIndex);

    const tick = (now: number) => {
      const sceneElapsed = Math.min(now - start, scenes[sceneIndex].duration);
      setElapsed(baseElapsed + sceneElapsed);
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [sceneIndex, isPlaying]);

  useEffect(() => {
    if (sceneIndex === scenes.length - 1 && elapsed >= totalDuration) {
      setIsPlaying(false);
    }
  }, [elapsed, sceneIndex]);

  const progress = useMemo(() => Math.min(1, elapsed / totalDuration), [elapsed]);

  const handleReplay = () => {
    setSceneIndex(0);
    setElapsed(0);
    setIsPlaying(true);
  };

  return (
    <main className={styles.main}>
      <section className={styles.stageWrapper}>
        <AnimatedScene scene={scenes[sceneIndex]} progress={progress} />
        <div className={styles.caption}>
          <h1>{scenes[sceneIndex].title}</h1>
          <p>{scenes[sceneIndex].subtitle}</p>
        </div>
        <div className={styles.controls}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
          </div>
          <button type="button" onClick={handleReplay} className={styles.button}>
            Xem lại
          </button>
        </div>
      </section>
    </main>
  );
}

function sceneProgressLookup(index: number) {
  let sum = 0;
  for (let i = 0; i < index; i += 1) {
    sum += scenes[i].duration;
  }
  return sum;
}

type AnimatedSceneProps = {
  scene: Scene;
  progress: number;
};

function AnimatedScene({ scene, progress }: AnimatedSceneProps) {
  const sceneClass = (styles as Record<string, string>)[scene.id] ?? "";

  return (
    <div className={`${styles.scene} ${sceneClass}`}>
      <svg viewBox="0 0 640 360" className={styles.svg} aria-hidden>
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a2540" />
            <stop offset="70%" stopColor="#0e141f" />
          </linearGradient>
          <linearGradient id="sunset" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f69259" />
            <stop offset="100%" stopColor="#9e2f6f" />
          </linearGradient>
          <radialGradient id="neon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe0f5" />
            <stop offset="100%" stopColor="#ff1f8f" />
          </radialGradient>
        </defs>

        <rect width="640" height="360" fill="url(#sky)" />
        <rect width="640" height="140" y="220" fill="#262626" />

        <MarketProps sceneId={scene.id} />
        <Vendor sceneId={scene.id} />
        <SpeechBubble sceneId={scene.id} />
        <NeonSign sceneId={scene.id} />
        <Foreground sceneId={scene.id} />
      </svg>
      <div className={styles.overlay}>
        <SceneFilters progress={progress} sceneId={scene.id} />
      </div>
    </div>
  );
}

type SceneAwareProps = {
  sceneId: Scene["id"];
};

function MarketProps({ sceneId }: SceneAwareProps) {
  return (
    <g>
      <rect x="40" y="160" width="200" height="80" fill="#3f2c23" rx="12" />
      <rect x="50" y="140" width="180" height="30" fill="#5a3d2e" rx="8" />
      <circle cx="140" cy="135" r="10" fill="#ffd27d" opacity={sceneId === "market" ? 0.9 : 0.3} />
      <rect x="70" y="220" width="40" height="50" fill="#7c533f" rx="6" />
      <rect x="160" y="220" width="40" height="50" fill="#7c533f" rx="6" />
      <rect x="260" y="240" width="80" height="15" fill="#514e4a" opacity="0.7" />
      <rect x="260" y="255" width="80" height="15" fill="#433f3b" opacity="0.6" />
      <rect x="360" y="240" width="90" height="15" fill="#514e4a" opacity="0.4" />
      <rect x="360" y="255" width="90" height="15" fill="#433f3b" opacity="0.3" />
    </g>
  );
}

function Vendor({ sceneId }: SceneAwareProps) {
  return (
    <g transform="translate(140 200)">
      <circle cx="0" cy="-60" r="28" fill="#f4c99e" />
      <rect x="-28" y="-40" width="56" height="65" rx="18" fill="#c0396b" />
      <rect x="-25" y="-5" width="50" height="60" rx="16" fill="#ee6f9b" />
      <path d="M -32 16 L -10 10 L -5 65 L -34 65 Z" fill="#5c1c39" />
      <path d="M 32 16 L 10 10 L 5 65 L 34 65 Z" fill="#5c1c39" />
      <circle cx="-10" cy="-64" r="4" fill="#0e0e0e" />
      <circle cx="10" cy="-64" r="4" fill="#0e0e0e" />
      <path
        d="M -14 -52 Q 0 -44 14 -52"
        stroke="#0e0e0e"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M -12 -70 Q 0 -80 12 -70"
        stroke="#1f1f1f"
        strokeWidth="5"
        fill="none"
        opacity={sceneId === "invitation" || sceneId === "club-interior" ? 0.1 : 0.6}
      />
      <circle
        cx="0"
        cy="-96"
        r="24"
        fill="#35241c"
        opacity={sceneId === "club-interior" ? 0.95 : 0.65}
      />
      <path
        d="M -18 -44 Q 0 -38 18 -44"
        stroke="#ad1f56"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity={sceneId === "conversation" || sceneId === "invitation" ? 0.8 : 0.3}
      />
      <circle cx="14" cy="-45" r="6" fill="#ffd27d" opacity={sceneId === "club-interior" ? 0.6 : 0} />
    </g>
  );
}

function SpeechBubble({ sceneId }: SceneAwareProps) {
  const visible = sceneId === "invitation";

  if (!visible) return null;

  return (
    <g transform="translate(320 70)">
      <rect x="0" y="0" width="220" height="120" rx="20" fill="#ffffff" opacity="0.9" />
      <polygon points="60,120 100,120 90,150" fill="#ffffff" opacity="0.9" />
      <text x="20" y="40" fill="#311d44" fontSize="18" fontWeight="bold">
        Cầm tay mình nè!
      </text>
      <text x="20" y="72" fill="#311d44" fontSize="16">
        Chiều nay, vô Khiêu vũ
      </text>
      <text x="20" y="96" fill="#311d44" fontSize="16">
        Hoa Hoa cho vui nhé?
      </text>
    </g>
  );
}

function NeonSign({ sceneId }: SceneAwareProps) {
  const showExterior = sceneId === "club-exterior";
  const showInterior = sceneId === "club-interior";

  if (!showExterior && !showInterior) return null;

  return (
    <g transform="translate(360 60)">
      <rect x="-40" y="-20" width="200" height="120" rx="18" fill="rgba(10, 8, 26, 0.65)" />
      <rect
        x="-50"
        y="-30"
        width="220"
        height="140"
        rx="24"
        stroke={showInterior ? "#ffe0f5" : "#ff4faf"}
        strokeWidth="6"
        fill="none"
        opacity="0.8"
      />
      <text
        x="70"
        y="36"
        textAnchor="middle"
        fontSize="28"
        fontWeight="bold"
        fill={showInterior ? "url(#neon)" : "#ff8fd1"}
        style={{ letterSpacing: "3px" }}
      >
        HOA HOA
      </text>
      <text
        x="70"
        y="72"
        textAnchor="middle"
        fontSize="18"
        fill={showInterior ? "#ffe0f5" : "#ffe8f6"}
      >
        Khiêu Vũ
      </text>
      {showInterior ? (
        <g>
          <circle cx="0" cy="0" r="6" fill="#ffe8f6" opacity="0.6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="140" cy="0" r="6" fill="#ffe8f6" opacity="0.6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
          </circle>
        </g>
      ) : null}
    </g>
  );
}

function Foreground({ sceneId }: SceneAwareProps) {
  const dancing = sceneId === "club-interior";

  return (
    <g>
      <rect x="0" y="300" width="640" height="60" fill="#1b1b1b" opacity="0.8" />
      <g opacity={dancing ? 1 : 0}>
        <Dancer x={180} delay={0} color="#ff75c3" />
        <Dancer x={260} delay={0.4} color="#72f6ff" />
        <Dancer x={340} delay={0.2} color="#ffe580" />
      </g>
    </g>
  );
}

type DancerProps = {
  x: number;
  delay: number;
  color: string;
};

function Dancer({ x, delay, color }: DancerProps) {
  return (
    <g transform={`translate(${x} 280)`}>
      <circle cx="0" cy="-60" r="16" fill="#f8d9b5" />
      <path
        d="M -20 -50 Q 0 -90 20 -50 L 20 0 L -20 0 Z"
        fill={color}
        opacity="0.85"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          values="-6 0 -40; 6 0 -40; -6 0 -40"
          dur="2.6s"
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
      </path>
      <line x1="-30" y1="-20" x2="30" y2="-20" stroke="#f7f7f7" strokeWidth="4" strokeLinecap="round">
        <animate
          attributeName="y1"
          values="-24;-16;-24"
          dur="1.9s"
          begin={`${delay + 0.2}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="y2"
          values="-16;-24;-16"
          dur="1.9s"
          begin={`${delay + 0.2}s`}
          repeatCount="indefinite"
        />
      </line>
    </g>
  );
}

function SceneFilters({ sceneId, progress }: { sceneId: Scene["id"]; progress: number }) {
  if (sceneId === "market") {
    return <div className={styles.filterWarm} />;
  }

  if (sceneId === "conversation" || sceneId === "invitation") {
    return <div className={styles.filterCinematic} />;
  }

  if (sceneId === "club-exterior") {
    return <div className={styles.filterNeon} />;
  }

  if (sceneId === "club-interior") {
    return <div className={styles.filterDance} style={{ opacity: 0.6 + progress * 0.34 }} />;
  }

  return null;
}
